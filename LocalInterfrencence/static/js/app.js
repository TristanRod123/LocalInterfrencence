const generateText = async () => {
    const textInput = document.getElementById("textInput").value;
    const maxTokens = document.getElementById("maxTokens").value;
    const doSample = document.getElementById("doSample").checked;
    const mode = document.querySelector('input[name="mode"]:checked').value;

    // Show loading state
    const outputElement = document.getElementById("output");
    outputElement.innerText = "Processing...";
    outputElement.classList.add("loading");

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: textInput,
                max_new_tokens: parseInt(maxTokens),
                do_sample: doSample,
                mode: mode,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            outputElement.innerText = data.generated_text;
            outputElement.classList.remove("loading");
        } else {
            outputElement.innerText = "Error: Unable to process request.";
            outputElement.classList.remove("loading");
        }
    } catch (error) {
        outputElement.innerText = "Error: " + error.message;
        outputElement.classList.remove("loading");
    }
};

// Update UI based on selected mode
const updateModeUI = () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const placeholder = document.getElementById("textInput");
    const label = document.querySelector('label[for="textInput"]');
    
    if (mode === "summarize") {
        placeholder.placeholder = "Enter text to summarize...";
        label.innerText = "Text to Summarize:";
    } else {
        placeholder.placeholder = "Enter your prompt...";
        label.innerText = "Your Prompt:";
    }
};

document.getElementById("generateButton").addEventListener("click", generateText);
document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", updateModeUI);
});

// Initialize UI
updateModeUI();