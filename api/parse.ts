export default async function handler(req, res) {
    try {
        // Set basic headers
        res.setHeader("Content-Type", "application/json");

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const { session_id, message, current_fields } = req.body || {};

        if (!session_id || !message) {
            return res.status(400).json({ error: "Missing session_id or message" });
        }

        // TEMP: Return a static valid JSON response for testing connectivity
        return res.status(200).json({
            fields: { ...(current_fields || {}), subject_description: message },
            patch: { subject_description: message },
            missing_questions: [
                "Testing mode active. Connectivity confirmed.",
                "Real AI logic will be restored in next step."
            ],
            confidence: { subject_description: 0.9 }
        });

    } catch (err) {
        console.error("API /parse error:", err);
        return res.status(500).json({
            error: "Internal Server Error",
            details: String(err?.message || err)
        });
    }
}
