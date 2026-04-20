import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import ollama
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from agents.orchestrator import AgentOrchestrator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = AgentOrchestrator()

# ================= PIPELINE =================
@app.post("/run-agent")
async def run_agent(request: Request):
    try:
        body = await request.json()

        structured_input = {
            "query": body.get("query"),
            "agent1": body.get("agent1", {}),
            "agent2": body.get("agent2", {}),
            "agent3": body.get("agent3", {})
        }

        result = orchestrator.run_pipeline(structured_input)

        return {
            "status": "success",
            "pipeline_output": result
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

# ================= CHAT =================
@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    msg = body.get("message", "")

    prompt = f"""
You are an agriculture expert.
User: {msg}
Give short, practical answer.
"""

    res = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"reply": res["message"]["content"]}

# ================= RUN =================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api.server:app", host="0.0.0.0", port=8000, reload=True)