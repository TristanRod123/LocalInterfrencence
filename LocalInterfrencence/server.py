from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from transformers import pipeline
import uvicorn

app = FastAPI()

# Load both models
generator_pipe = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct")
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# curl -sS -i http://127.0.0.1:8000/generate \
#   -H "Content-Type: application/json" \
#   --data '{"text":"Hello","max_new_tokens":20}'

# curl -sS -i -L "https://<NAME>-8000.app.github.dev/generate" \
#   -H "Content-Type: application/json" \
#   --data '{"text":"What is the capital of France?","max_new_tokens":32}'

# curl -sS -i -L "https://verbose-space-lamp-697x5775rr5h7xg-8000.app.github.dev/generate" \
#   -H "Content-Type: application/json" \
#   --data '{"text":"What is the capital of France?","max_new_tokens":32}'
