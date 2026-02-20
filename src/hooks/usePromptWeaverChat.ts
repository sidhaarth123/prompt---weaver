import { useState, useCallback, useRef, useEffect } from "react";
import { callWorkflowWebhook, WebhookClientResponse } from "@/api/promptWeaverWebhook";
import { WorkflowType } from "@/config/workflows";
import { toast } from "@/hooks/use-toast";

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface UsePromptWeaverChatProps {
    workflowType: WorkflowType;
    onDataReceived?: (data: WebhookClientResponse) => void;
}

export function usePromptWeaverChat({ workflowType, onDataReceived }: UsePromptWeaverChatProps) {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [credits, setCredits] = useState<number | null>(null);
    const [errorStatus, setErrorStatus] = useState<'UNAUTHORIZED' | 'NO_CREDITS' | 'CONFIG_ERROR' | null>(null);
    const [lastResponse, setLastResponse] = useState<WebhookClientResponse | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim() || isLoading) return;

        // Add user message to history
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);
        setIsLoading(true);
        setErrorStatus(null);

        try {
            const response = await callWorkflowWebhook(workflowType, message);

            if (!isMounted.current) return;

            setLastResponse(response);

            if (!response.success) {
                let errorMsg = response.error || "Failed to communicate with AI.";

                if (response.code === 'UNAUTHORIZED') {
                    setErrorStatus('UNAUTHORIZED');
                    errorMsg = "Session expired. Please login again.";
                } else if (response.code === 'NO_CREDITS') {
                    setErrorStatus('NO_CREDITS');
                    errorMsg = "No credits remaining. Please upgrade.";
                } else if (response.code === 'CONFIG_MISSING' || response.code === 'CONFIG_ERROR') {
                    setErrorStatus('CONFIG_ERROR');
                }

                toast({
                    title: "Assistant Error",
                    description: errorMsg,
                    variant: "destructive",
                });

                setChatHistory(prev => [...prev, {
                    role: 'assistant',
                    content: `⚠️ Error: ${errorMsg}`
                }]);
                return;
            }

            // Handle successful response
            if (response.remaining_credits !== undefined) {
                setCredits(response.remaining_credits);
            }

            // Add assistant response to history
            let assistantText = "";
            if (response.message) {
                assistantText = response.message;
            } else if (!response.ready && response.questions && response.questions.length > 0) {
                assistantText = response.questions.join("\n\n");
            } else if (response.ready) {
                assistantText = "Excellent! I've prepared your premium prompt package. You can view it below.";
            } else {
                assistantText = "Settings updated. What else would you like to refine?";
            }

            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: assistantText
            }]);

            if (onDataReceived) {
                onDataReceived(response);
            }

        } catch (error: any) {
            if (!isMounted.current) return;
            console.error("Chat Error:", error);
            toast({
                title: "Assistant Error",
                description: "Network error. Please try again.",
                variant: "destructive",
            });
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting to my brain. Please try again in a moment."
            }]);
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [workflowType, isLoading, onDataReceived]);

    const clearChat = useCallback(() => {
        setChatHistory([]);
        setLastResponse(null);
        setErrorStatus(null);
    }, []);

    return {
        chatHistory,
        isLoading,
        credits,
        errorStatus,
        lastResponse,
        sendMessage,
        clearChat,
    };
}
