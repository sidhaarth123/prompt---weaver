import React from "react";

export default function AssistantTypingIndicator() {
    return (
        <div className="assistant-typing">
            <div className="assistant-bubble">
                ✨ Drafting premium prompt...
                <div className="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
}
