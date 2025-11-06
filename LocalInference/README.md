---
title: AI Text Assistant
emoji: 🤖
colorFrom: purple
colorTo: blue
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
license: mit
---

# AI Text Assistant

An interactive web application for text generation, summarization, and next-word prediction using transformer models.

## Features

- **Text Generation**: Generate creative text continuations using Qwen2.5-0.5B-Instruct model
- **Text Summarization**: Summarize long texts using BART-large-CNN model
- **Next Word Prediction**: Get top 10 predictions for the next word with probability scores

## Models Used

- **Text Generation**: [Qwen/Qwen2.5-0.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct)
- **Summarization**: [facebook/bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn)

## Project Structure

```
LocalInference/
├── app.py              # Main FastAPI application
├── requirements.txt    # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css  # UI styles
│   └── js/
│       └── app.js     # Client-side JavaScript
└── templates/
    └── index.html     # Main HTML interface
```

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd LocalInference
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```
   
   The application will be accessible at `http://localhost:7860`

## Usage

1. Open the application in your web browser
2. Choose between "Text Generation" or "Text Summarization" mode
3. Enter your text in the input field
4. Adjust max tokens and sampling options as needed
5. Click "Process" to generate results
6. Use "Get Next Word Predictions" to see likely next words

## API Endpoints

- `GET /` - Web interface
- `POST /generate` - Generate or summarize text
- `POST /predict_next` - Get next word predictions

## License

This project is licensed under the MIT License.