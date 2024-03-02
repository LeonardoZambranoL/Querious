from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, HTTPException
from server.query import routes as query
from server.authentication import routes as auth
from server.query.log_search.routes import search
from server.query.question_answering.routes import qa
from server.query.summarization.routes import summary
from server.logs import routes as logs
from server.helpers.utils import *

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes to the multiple services
app.include_router(auth.router, prefix="/auth")
app.include_router(logs.router, prefix="/log")
app.include_router(query.router, prefix="/query")


@app.post("/query", tags=["query"])
async def query(request: Request):
    """
    Central Endpoint.
    All requests concerning summarization, question answering and log search can be done to this endpoint.
    """
    payload = await request.json()
    operation_type = payload.get("type")
    logId = payload.get("logId")
    if logId is None:
        raise HTTPException(status_code=400, detail="Missing logId field in JSON payload.")
    if operation_type is not None:
        # for the moment query is the only operation type available
        if operation_type == "query":
            sub_type = payload.get("subtype")
            if sub_type == "qa":
                # Get the question
                q = payload.get("content").get("question")
                if q is None:
                    raise HTTPException(status_code=400, detail="Missing question field in JSON payload.")
                top_n_lines = payload.get("content").get("topNLines")
                if top_n_lines is None:
                    top_n_lines = 10
                top_n_lines = max(top_n_lines, 10)
                results = qa(q, logId, top_n_lines)
                logs = [log for log in results.get("logs")]
                answer = {
                    "logId": logId,
                    "timestamp": generate_timestamp(),
                    "type": "response",
                    "subtype": "qa",
                    "content": {
                        "answer": results.get("answer"),
                        "lines": logs
                    },
                }
                return answer

            elif sub_type == "search":
                q = payload.get("content").get("prompt")
                if q is None:
                    raise HTTPException(status_code=400, detail="Missing prompt field in JSON payload.")
                top_n_lines = payload.get("content").get("topNLines")
                if top_n_lines is None:
                    top_n_lines = 10
                top_n_lines = max(top_n_lines, 10)
                results = search(q, logId, top_n_lines)
                answer = {
                    "logId": logId,
                    "timestamp": generate_timestamp(),
                    "type": "response",
                    "subtype": "search",
                    "content": {
                        "lines": results.get("LogLine")
                    }
                }
                return answer

            elif sub_type == "summary":
                q = payload.get("content").get("prompt")
                if q is None:
                    raise HTTPException(status_code=400, detail="Missing prompt field in JSON payload.")
                timeFrom = payload.get("content").get("timeFrom")
                if timeFrom is None:
                    raise HTTPException(status_code=400, detail="Missing timeFrom field in JSON payload.")
                timeTo = payload.get("content").get("timeTo")
                if timeTo is None:
                    raise HTTPException(status_code=400, detail="Missing timeTo field in JSON payload.")
                lineFrom = payload.get("content").get("timeTo")
                if lineFrom is None:
                    raise HTTPException(status_code=400, detail="Missing lineFrom field in JSON payload.")
                lineTo = payload.get("content").get("timeTo")
                if lineTo is None:
                    raise HTTPException(status_code=400, detail="Missing lineTo field in JSON payload.")
                try:
                    answer, ids = summary(logId, q, lineFrom, lineTo, timeFrom, timeTo)
                except:
                    raise HTTPException(status_code=500, detail="Something went terribly wrong.")
                result = {
                    "logId": logId,
                    "timestamp": generate_timestamp(),
                    "type": "response",
                    "subtype": "summary",
                    "content": {
                        "summary": answer
                    }
                }
                return result
            else:
                # any subtype not matching the previous ones is not supported
                raise HTTPException(status_code=400, detail="Unsupported operation subtype.")
        else:
            raise HTTPException(status_code=400, detail="Unsupported operation.")
    else:
        raise HTTPException(status_code=400, detail="Missing type field in JSON payload.")


@app.get("/", tags=["root"])
def root():
    return {"status": "up and running"}


@app.get("/test", tags=["test"])
def test():
    from backend.QA.main import test
    test()
