const MODULE_ID = "phils-universal-translator";

/**
 * LocalLlmClient
 * Handles direct HTTP communication with locally hosted LLM instances (Ollama, LM Studio, LocalAI).
 */
export class LocalLlmClient {
    /**
     * Normalizes an endpoint URL by stripping trailing slashes.
     * @param {string} url
     * @returns {string}
     */
    static normalizeUrl(url) {
        if (!url || typeof url !== 'string') return "http://localhost:11434";
        let cleaned = url.trim();
        while (cleaned.endsWith('/')) {
            cleaned = cleaned.slice(0, -1);
        }
        return cleaned;
    }

    /**
     * Tests the connection to a local LLM endpoint and retrieves available models.
     * @param {string} endpoint
     * @returns {Promise<{success: boolean, models: string[], serverType: string, error?: string}>}
     */
    static async testConnection(endpoint) {
        const base = this.normalizeUrl(endpoint);
        
        // 1. Try Ollama native endpoint (/api/tags)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const res = await fetch(`${base}/api/tags`, {
                method: "GET",
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                const models = Array.isArray(data.models) ? data.models.map(m => m.name || m.model || m) : [];
                return {
                    success: true,
                    serverType: "ollama",
                    models: models.length > 0 ? models : ["llama3:latest", "mistral", "gemma2"]
                };
            }
        } catch (e) {
            // Fall through to OpenAI-compatible test
        }

        // 2. Try OpenAI-compatible endpoint (/v1/models or /models)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const url = base.endsWith("/v1") ? `${base}/models` : `${base}/v1/models`;
            const res = await fetch(url, {
                method: "GET",
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                const models = Array.isArray(data.data) ? data.data.map(m => m.id) : [];
                return {
                    success: true,
                    serverType: "openai-compatible",
                    models: models.length > 0 ? models : ["local-model"]
                };
            }
        } catch (e) {
            // Continue to error reporting
        }

        return {
            success: false,
            serverType: "unknown",
            models: [],
            error: game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.LocalLlm.ConnectionFailed") || "Could not connect to local LLM endpoint."
        };
    }

    /**
     * Sends a translation prompt directly to the configured local LLM.
     * @param {object} options
     * @param {string} options.prompt
     * @param {string} [options.endpoint]
     * @param {string} [options.model]
     * @param {number} [options.timeoutMs]
     * @returns {Promise<string>} Raw AI response text
     */
    static async queryDirect({ prompt, endpoint, model, timeoutMs = 180000 }) {
        const ep = this.normalizeUrl(endpoint || game.settings.get(MODULE_ID, 'localLlmEndpoint') || "http://localhost:11434");
        const mdl = model || game.settings.get(MODULE_ID, 'localLlmModel') || "llama3";

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            // 1. Try Ollama native POST /api/generate
            const isOllamaEndpoint = !ep.endsWith("/v1");
            if (isOllamaEndpoint) {
                try {
                    const response = await fetch(`${ep}/api/generate`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            model: mdl,
                            prompt: prompt,
                            stream: false,
                            format: "json",
                            options: {
                                temperature: 0.2,
                                num_ctx: 8192
                            }
                        }),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const data = await response.json();
                        if (data.response) return data.response;
                    }
                } catch (ollamaErr) {
                    console.warn("Phil's Universal Translator | Ollama direct generation attempt failed, falling back to OpenAI format:", ollamaErr);
                }
            }

            // 2. OpenAI compatible POST /v1/chat/completions fallback
            const chatUrl = ep.endsWith("/v1") ? `${ep}/chat/completions` : `${ep}/v1/chat/completions`;
            const chatRes = await fetch(chatUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: mdl,
                    messages: [
                        { role: "system", content: "You are a professional RPG translator and local utility for Foundry VTT. Always return valid JSON only." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.2
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (chatRes.ok) {
                const chatData = await chatRes.json();
                const content = chatData.choices?.[0]?.message?.content;
                if (content) return content;
            }

            throw new Error(`Server returned HTTP status ${chatRes.status}: ${chatRes.statusText}`);
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                throw new Error(game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.LocalLlm.TimeoutError") || "Local LLM request timed out.");
            }
            throw err;
        }
    }
}
