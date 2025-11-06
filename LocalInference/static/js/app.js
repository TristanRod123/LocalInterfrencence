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

const predictNext = async () => {
    const textInput = document.getElementById("textInput").value;
    
    if (!textInput.trim()) {
        alert("Please enter some text first!");
        return;
    }

    // Show loading state
    const predictionsElement = document.getElementById("predictions");
    predictionsElement.innerHTML = "Loading predictions...";

    try {
        const response = await fetch("/predict_next", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: textInput,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            displayPredictions(data.predictions);
        } else {
            predictionsElement.innerHTML = "Error: Unable to get predictions.";
        }
    } catch (error) {
        predictionsElement.innerHTML = "Error: " + error.message;
    }
};

const displayPredictions = (predictions) => {
    const predictionsElement = document.getElementById("predictions");
    
    if (predictions.length === 0) {
        predictionsElement.innerHTML = "No predictions available.";
        return;
    }

    let html = '<div class="predictions-list">';
    predictions.forEach((pred, index) => {
        const barWidth = pred.probability;
        html += `
            <div class="prediction-item">
                <div class="prediction-header">
                    <span class="prediction-rank">#${index + 1}</span>
                    <span class="prediction-token">"${pred.token}"</span>
                    <span class="prediction-probability">${pred.probability}%</span>
                </div>
                <div class="prediction-bar-container">
                    <div class="prediction-bar" style="width: ${barWidth}%"></div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    predictionsElement.innerHTML = html;
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
document.getElementById("predictButton").addEventListener("click", predictNext);
document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", updateModeUI);
});

// Initialize UI
updateModeUI();