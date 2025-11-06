from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import uvicorn
import os

app = FastAPI()

# Load models and tokenizer
model_name = "Qwen/Qwen2.5-0.5B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
generator_pipe = pipeline("text-generation", model=model_name, tokenizer=tokenizer)
summarizer_pipe = pipeline("summarization", model="facebook/bart-large-cnn")

app.mount("/static", StaticFiles(directory="static"), name="static")

class GenRequest(BaseModel):
    text: str
    max_new_tokens: int = 150
    do_sample: bool = False
    mode: str = "generate"  # "generate" or "summarize"

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("templates/index.html", "r") as f:
        return f.read()

@app.post("/generate")
def generate(req: GenRequest):
    if req.mode == "summarize":
        # Use summarization pipeline
        out = summarizer_pipe(
            req.text,
            max_length=req.max_new_tokens,
            min_length=30,
            do_sample=req.do_sample,
        )
        return {"generated_text": out[0]["summary_text"]}
    else:
        # Use text generation pipeline
        out = generator_pipe(
            req.text,
            max_new_tokens=req.max_new_tokens,
            do_sample=req.do_sample,
            truncation=True,
            return_full_text=False,
        )
        return {"generated_text": out[0]["generated_text"]}

@app.post("/predict_next")
def predict_next(req: GenRequest):
    """Get top predictions for next word/token"""
    inputs = tokenizer(req.text, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)
        next_token_logits = outputs.logits[0, -1, :]
        
        # Get top 10 predictions
        top_k = 10
        probs = torch.softmax(next_token_logits, dim=-1)
        top_probs, top_indices = torch.topk(probs, top_k)
        
        predictions = []
        for prob, idx in zip(top_probs.tolist(), top_indices.tolist()):
            token = tokenizer.decode([idx])
            predictions.append({
                "token": token,
                "probability": round(prob * 100, 2)
            })
    
    return {"predictions": predictions}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
