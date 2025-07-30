document.addEventListener('DOMContentLoaded', () => {

    let TEXT_URL = "";
    let IMAGE_URL = "";
    let VISION_URL = "";

    const CONFIG_URL = "https://arnav11n.github.io/AI/config.json"; // This is a backend server which is permitted as said by your discord mod Swapnil@DMMITS

    fetch(CONFIG_URL)
        .then(r => r.json())
        .then(cfg => {
            TEXT_URL = cfg.links.text;
            IMAGE_URL = cfg.links.image;
            VISION_URL = cfg.links.vision;
            console.log("Remote config loaded.");
        })
        .catch(err => console.error("Failed to load remote config:", err));

    const chatOutput = document.getElementById('chatOutput');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatLoading = document.getElementById('chatLoading');
    const chatMessageBox = document.getElementById('chatMessageBox');

    const imagePromptInput = document.getElementById('imagePrompt');
    const generateImageBtn = document.getElementById('generateImageBtn');
    const imageGenLoading = document.getElementById('imageGenLoading');
    const imageGenOutput = document.getElementById('imageGenOutput');
    const imageGenMessageBox = document.getElementById('imageGenMessageBox');

    const imageUploadInput = document.getElementById('imageUpload');
    const imageQuestionInput = document.getElementById('imageQuestion');
    const identifyImageBtn = document.getElementById('identifyImageBtn');
    const imageIdentifyLoading = document.getElementById('imageIdentifyLoading');
    const imageIdentifyPreview = document.getElementById('imageIdentifyPreview');
    const imageIdentifyOutput = document.getElementById('imageIdentifyOutput');
    const imageIdentifyMessageBox = document.getElementById('imageIdentifyMessageBox');

    function displayMessage(boxElement, message, type = 'error') {
        boxElement.textContent = message;
        boxElement.className = 'message-box show';
        if (type === 'success') {
            boxElement.style.borderColor = 'var(--primary-cyan)';
            boxElement.style.color = 'var(--primary-cyan)';
            boxElement.style.background = 'rgba(0, 255, 255, 0.1)';
        } else if (type === 'info') {
            boxElement.style.borderColor = 'var(--primary-purple)';
            boxElement.style.color = 'var(--primary-purple)';
            boxElement.style.background = 'rgba(124, 58, 237, 0.1)';
        } else {
            boxElement.style.borderColor = 'var(--primary-orange)';
            boxElement.style.color = 'var(--primary-orange)';
            boxElement.style.background = 'rgba(255, 255, 0, 0.1)';
        }
        setTimeout(() => boxElement.classList.remove('show'), 5000);
    }
    function showLoading(el) { el.style.display = 'block'; }
    function hideLoading(el) { el.style.display = 'none'; }

    async function retryWithBackoff(fn, retries = 3, delay = 1000) {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0 && (error.message.includes('429') || error.message.includes('unavailable'))) {
                await new Promise(res => setTimeout(res, delay));
                return retryWithBackoff(fn, retries - 1, delay * 2);
            }
            throw error;
        }
    }

    let chatHistory = [{ role: "model", parts: [{ text: "Hello! How can I assist you today?" }] }];

    function addChatMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        const p = document.createElement('p');
        p.textContent = text;
        messageDiv.appendChild(p);
        chatOutput.appendChild(messageDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    async function sendMessage() {
        if (!TEXT_URL) {
            displayMessage(chatMessageBox, "Config not loaded yet. Try again.");
            return;
        }
        const userMessage = chatInput.value.trim();
        if (!userMessage) {
            displayMessage(chatMessageBox, 'Please enter a message.');
            return;
        }

        addChatMessage(userMessage, 'user');
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
        chatInput.value = '';

        showLoading(chatLoading);
        displayMessage(chatMessageBox, 'Thinking...', 'info');

        try {
            const apiCall = async () => {
                const response = await fetch(TEXT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: chatHistory })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`${response.status} ${response.statusText} - ${errorData.error.message}`);
                }
                return response.json();
            };

            const result = await retryWithBackoff(apiCall);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const aiResponse = result.candidates[0].content.parts[0].text;
                addChatMessage(aiResponse, 'ai');
                chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
                displayMessage(chatMessageBox, 'Response received!', 'success');
            } else {
                displayMessage(chatMessageBox, 'No valid response.', 'error');
            }
        } catch (err) {
            console.error('Chat error:', err);
            displayMessage(chatMessageBox, `Failed: ${err.message}`, 'error');
        } finally {
            hideLoading(chatLoading);
        }
    }
    sendChatBtn?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

    async function generateImage() {
        if (!IMAGE_URL) {
            displayMessage(imageGenMessageBox, "Config not loaded yet. Try again.");
            return;
        }
        const prompt = imagePromptInput.value.trim();
        if (!prompt) {
            displayMessage(imageGenMessageBox, 'Please enter a prompt.');
            return;
        }
        imageGenOutput.innerHTML = '';
        showLoading(imageGenLoading);
        displayMessage(imageGenMessageBox, 'Generating image...', 'info');

        try {
            const apiCall = async () => {
                const response = await fetch(IMAGE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1 } })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`${response.status} ${response.statusText} - ${errorData.error.message}`);
                }
                return response.json();
            };

            const result = await retryWithBackoff(apiCall);
            if (result.predictions?.[0]?.bytesBase64Encoded) {
                const img = document.createElement('img');
                img.src = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
                img.alt = prompt;
                imageGenOutput.appendChild(img);
                displayMessage(imageGenMessageBox, 'Image generated!', 'success');
            } else {
                displayMessage(imageGenMessageBox, 'No image generated.', 'error');
            }
        } catch (err) {
            console.error('Image gen error:', err);
            displayMessage(imageGenMessageBox, `Failed: ${err.message}`, 'error');
        } finally {
            hideLoading(imageGenLoading);
        }
    }
    generateImageBtn?.addEventListener('click', generateImage);

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = e => reject(e);
            reader.readAsDataURL(file);
        });
    }
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imageIdentifyPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:100%;border-radius:8px;">`;
                };
                reader.readAsDataURL(file);
            } else {
                imageIdentifyPreview.innerHTML = '';
            }
        });
    }

    async function identifyImage() {
        if (!VISION_URL) {
            displayMessage(imageIdentifyMessageBox, "Config not loaded yet. Try again.");
            return;
        }
        const file = imageUploadInput.files[0];
        const question = imageQuestionInput.value.trim();
        if (!file) {
            displayMessage(imageIdentifyMessageBox, 'Please upload an image.');
            return;
        }
        showLoading(imageIdentifyLoading);
        displayMessage(imageIdentifyMessageBox, 'Analyzing...', 'info');
        try {
            const base64ImageData = await fileToBase64(file);
            const parts = [
                { text: question || "Describe this image." },
                { inlineData: { mimeType: file.type, data: base64ImageData } }
            ];
            const payload = { contents: [{ role: "user", parts }] };

            const apiCall = async () => {
                const response = await fetch(VISION_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`${response.status} ${response.statusText} - ${errorData.error.message}`);
                }
                return response.json();
            };

            const result = await retryWithBackoff(apiCall);
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                imageIdentifyOutput.textContent = result.candidates[0].content.parts[0].text;
                displayMessage(imageIdentifyMessageBox, 'Analysis complete!', 'success');
            } else {
                displayMessage(imageIdentifyMessageBox, 'Could not analyze.', 'error');
            }
        } catch (err) {
            console.error('Vision error:', err);
            displayMessage(imageIdentifyMessageBox, `Failed: ${err.message}`, 'error');
        } finally {
            hideLoading(imageIdentifyLoading);
        }
    }
    identifyImageBtn?.addEventListener('click', identifyImage);
});