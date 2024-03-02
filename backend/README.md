# Logfiles Analysis Backend

The `LogQA` class in `backend/QA/main.py` is the heart of our log analysis and designed to facilitate log file analysis and question answering using preprocessed log data. It provides methods for preprocessing log files, setting session parameters, and performing various queries on log data.

## Initialization

```python
log_qa = LogQA()
```

The class is initialized with default parameters, and you can customize the data directory by modifying the `data_dir` attribute.

## Methods

### 1. `preprocess_logfile`

```python
log_qa.preprocess_logfile(path_to_logfile: str)
```

Preprocesses a log file, generating JSON and embeddings files for later use in similarity searches. This method creates a directory for each log file containing the processed data.

### 2. `set_session_parameters`

```python
log_qa.set_session_parameters(file_path: str)
```

Sets the session parameters based on the given log file. This includes the paths to the log file, JSON file, and embeddings file. It also loads log embeddings and creates a search index for similarity searches.

### 3. `get_log_line_by_id`

```python
log_qa.get_log_line_by_id(line_id: int) -> str
```

Returns the log line based on its ID.

### 4. `get_all_log_lines`

```python
log_qa.get_all_log_lines() -> list
```

Returns a list of all log lines in the current log file.

### 5. `get_logs_by_date`

```python
log_qa.get_logs_by_date(start_date: str, end_date: str, default_year: int = 2023, given_logs: list = None) -> list
```

Returns log lines within a specified date range.

### 6. `get_logs_by_id_range`

```python
log_qa.get_logs_by_id_range(start_id: int, end_id: int) -> list
```

Returns log lines within a specified ID range.

### 7. `get_logs_by_all_filters`

```python
log_qa.get_logs_by_all_filters(query: str, start_id: int = None, end_id: int = None, start_date: str = None,
                               end_date: str = None) -> list
```

Returns log lines based on multiple filters combined such as query, ID range, and date range.

### 8. `log_search`

```python
log_qa.log_search(query: str, top_n_lines: int) -> list
```

Searches the log file for the query and returns the top results.

### 9. `generate_llm_answer`

```python
log_qa.generate_llm_answer(query: str, top_n_lines: int) -> tuple
```

Generates an answer to the query using a Large Language Model. We use ChatGPT for this purpose. Returns the answer and a list of line IDs used as context.

### 10. `generate_dynamic_summary`

```python
log_qa.generate_dynamic_summary(query: str, start_id: int = None, end_id: int = None, start_date: str = None,
                                end_date: str = None, model: str = 'claude') -> tuple
```

Generates a dynamic summary based on specified filters and model. One could use either ChatGPT (4092 tokens context window) or Claude Instant (100,000 tokens context window) as generative models. Per default Claude is chosen. Returns the summary and a list of line IDs used as context.



## Usage

1. **Initialization:**
   ```python
   log_qa = LogQA()
   ```

2. **Preprocess Log File:**
   ```python
   log_qa.preprocess_logfile("path/to/your/logfile.out")
   ```

3. **Set Session Parameters:**
   ```python
   log_qa.set_session_parameters("path/to/your/logfile.out")
   ```

4. **Perform Queries:**
   ```python
   # Example: Search for logs containing the word "error"
   query_result = log_qa.log_search("Lines with SSH access attempts", top_n_lines=30)
   ```

   ```python
   # Example: Generate a dynamic summary based on filters
   summary, context_ids = log_qa.generate_dynamic_summary("Error messages", start_id=10, end_id=2500, start_date="Nov 08 13:42:49", end_date="Nov 11 13:42:49")
   ```

5. **Generate Answers:**
   ```python
   # Example: Generate an answer to a question using Log Language Model
   answer, context_ids = log_qa.generate_llm_answer("When were the root privileges for user avahi removed?", top_n_lines=25)
   ```

Ensure that you have the required dependencies in `requirements.txt` and data files in the specified directory before using the `LogQA` class. For more details on each method, refer to the inline documentation provided in the code.