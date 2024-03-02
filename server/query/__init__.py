# initialize backend objects
from backend.QA.main import LogQA
from server.logs.dummy import log_file_db

log_qa_dict = {}
for i, path in log_file_db.items():
    print("loading: ", path)
    try:
        lqa = LogQA()
        lqa.set_session_parameters(path)
        log_qa_dict[i] = lqa
    except:
        log_qa_dict[i] = None

print(log_qa_dict)
