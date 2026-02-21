import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { callWorkflowWebhook, WebhookClientResponse } from "@/api/promptWeaverWebhook";
import { WorkflowType } from "@/config/workflows";
import { toast } from "@/hooks/use-toast";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

// Error status that drives the UI error panel in PremiumChatbot
export type ChatErrorStatus = "UNAUTHORIZED" | "NO_CREDITS" | "CONFIG_ERROR" | null;

interface UsePromptWeaverChatProps {
    workflowType: WorkflowType;
    onDataReceived?: (data: WebhookClientResponse) => void;
}

/**
 * Maps a webhook error code to:
 *  - The UI error status (drives which error panel to show)
 *  - A human-friendly toast message
 *  - Whether to sign the user out (ONLY on true auth failures)
 */
function resolveError(code: string | undefined, rawMessage: string | undefined): {
    status: ChatErrorStatus;
    toastTitle: string;
    toastMessage: string;
    signOut: boolean;
} {
    switch (code) {
        case "UNAUTHORIZED":
            return {
                status: "UNAUTHORIZED",
                toastTitle: "Session Expired",
                toastMessage: "Your session expired. Please log in again.",
                signOut: true,
            };

        case "INSUFFICIENT_CREDITS":
            return {
                status: "NO_CREDITS",
                toastTitle: "Out of Credits",
                toastMessage: "You're out of credits. Please upgrade your plan.",
                signOut: false,
            };

        case "RATE_LIMITED":
            return {
                status: null,
                toastTitle: "Too Many Requests",
                toastMessage: "Too many requests. Please wait a moment and try again.",
                signOut: false,
            };

        case "BAD_REQUEST":
            return {
                status: null,
                toastTitle: "Invalid Request",
                toastMessage: "The request was invalid. Please check your input.",
                signOut: false,
            };

        case "CONFIG_MISSING":
        case "CONFIG_ERROR":
            return {
                status: "CONFIG_ERROR",
                toastTitle: "Configuration Error",
                toastMessage: "The assistant is not configured correctly. Please contact support.",
                signOut: false,
            };

        case "NETWORK_ERROR":
            return {
                status: null,
                toastTitle: "Connection Error",
                toastMessage: "Could not reach the server. Check your internet connection.",
                signOut: false,
            };

        case "SERVER_ERROR":
        case "PARSE_ERROR":
        case "REQUEST_FAILED":
        default:
            return {
                status: null,
                toastTitle: "Server Error",
                toastMessage: rawMessage || "Something went wrong. Please try again.",
                signOut: false,
            };
    }
}

export function usePromptWeaverChat({ workflowType, onDataReceived }: UsePromptWeaverChatProps) {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [credits, setCredits] = useState<number | null>(null);
    const [errorStatus, setErrorStatus] = useState<ChatErrorStatus>(null);
    const [lastResponse, setLastResponse] = useState<WebhookClientResponse | null>(null);

    // ── Multi-turn conversation state ──────────────────────────────────────────
    // Stored in a ref so sendMessage always sees the latest value without
    // triggering re-renders or stale closure issues.
    const conversationIdRef = useRef<string | undefined>(undefined);

    const isMounted = useRef(true);
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const sendMessage = useCallback(
        async (message: string) => {
            if (!message.trim() || isLoading) return;

            setChatHistory((prev) => [...prev, { role: "user", content: message }]);
            setIsLoading(true);
            setErrorStatus(null);

            try {
                // Forward the active conversation_id on every turn after the first.
                const response = await callWorkflowWebhook(
                    workflowType,
                    message,
                    conversationIdRef.current
                );

                if (!isMounted.current) return;
                setLastResponse(response);

                if (!response.success) {
                    const { status, toastTitle, toastMessage, signOut } = resolveError(
                        response.code,
                        response.error ?? response.message
                    );

                    // Show precise UI error panel state
                    if (status) setErrorStatus(status);

                    // Show friendly toast — never show raw codes or "Assistant Error"
                    toast({
                        title: toastTitle,
                        description: toastMessage,
                        variant: "destructive",
                    });

                    // Add a sensible in-chat message
                    setChatHistory((prev) => [
                        ...prev,
                        { role: "assistant", content: `⚠️ ${toastMessage}` },
                    ]);

                    // Sign out ONLY on true auth failure
                    if (signOut) {
                        await supabase.auth.signOut();
                        navigate("/auth", { replace: true });
                    }

                    return;
                }

                // ── Success path ─────────────────────────────────────────────────────

                // Persist conversation_id for all subsequent turns.
                // If backend sends a new ID (new conversation), store it.
                // If backend sends the same ID, it's a no-op.
                if (response.conversation_id) {
                    conversationIdRef.current = response.conversation_id;
                }

                if (response.remaining_credits !== undefined) {
                    setCredits(response.remaining_credits);
                }

                let assistantText = "";
                if (response.message) {
                    assistantText = response.message;
                } else if (!response.ready && response.questions?.length) {
                    assistantText = response.questions.join("\n\n");
                } else if (response.ready) {
                    assistantText = "Excellent! I've prepared your premium prompt package. You can view it below.";
                } else {
                    assistantText = "Settings updated. What else would you like to refine?";
                }

                setChatHistory((prev) => [...prev, { role: "assistant", content: assistantText }]);

                if (onDataReceived) {
                    onDataReceived(response);
                }
            } catch (err: any) {
                // Truly unexpected JS error — not a server error
                if (!isMounted.current) return;
                toast({
                    title: "Unexpected Error",
                    description: "Something went wrong. Please refresh the page and try again.",
                    variant: "destructive",
                });
                setChatHistory((prev) => [
                    ...prev,
                    { role: "assistant", content: "Something went wrong on my end. Please try again." },
                ]);
            } finally {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            }
        },
        [workflowType, isLoading, onDataReceived, navigate]
    );

    const clearChat = useCallback(() => {
        setChatHistory([]);
        setLastResponse(null);
        setErrorStatus(null);
        // Reset conversation so next message starts a fresh one
        conversationIdRef.current = undefined;
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
