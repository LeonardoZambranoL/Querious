# Middleware API Endpoints Documentation

## 1. Search Endpoint
### `POST /search`
- **Description:** Direct endpoint for searching log lines based on provided parameters.
- **Tags:** query
- **Parameters:**
  - `query` (str): The search query.
  - `logId` (str): The unique identifier for the log.
  - `top_n_lines` (int, optional): Number of top log lines to retrieve (default is 1).
- **Response:**
  - `timestamp` (str): Timestamp of the search request.
  - `logId` (str): Unique identifier of the log.
  - `LogLine` (list): List of log lines matching the search query.
    - `lineId` (str): Unique identifier of the log line.
    - `content` (str): Content of the log line.

## 2. Question Answering Endpoint
### `POST /qa`
- **Description:** Direct endpoint for question answering based on log content.
- **Tags:** query
- **Parameters:**
  - `query` (str): The question to be answered.
  - `logId` (str): The unique identifier for the log.
  - `top_n_lines` (int, optional): Number of top log lines used for generating the answer (default is 1).
- **Response:**
  - `answer` (str): The generated answer to the question.
  - `timestamp` (str): Timestamp of the question answering request.
  - `logs` (list): List of log lines used for generating the answer.
    - `lineId` (str): Unique identifier of the log line.
    - `content` (str): Content of the log line.

## 3. Summarization Endpoint
### `POST /summary`
- **Description:** Direct endpoint for summarizing log files within a specified time window and line range.
- **Tags:** query
- **Parameters:**
  - `logId` (str): The unique identifier for the log.
  - `prompt` (str): The prompt for log summarization.
  - `lineFrom` (int): Starting line number for summarization.
  - `lineTo` (int): Ending line number for summarization.
  - `timeFrom` (int): Start timestamp for summarization.
  - `timeTo` (int): End timestamp for summarization.
- **Response:**
  - Dynamic response based on your application's logic.
  
## 4. Get All Logs Endpoint
### `GET /all`
- **Description:** Retrieve all logs belonging to the organization.
- **Tags:** logs
- **Parameters:**
  - `organization` (str): The organization to which the logs belong.
- **Response:**
  - List of logs belonging to the specified organization.

## 5. Get Log Endpoint
### `GET /{log_uuid}`
- **Description:** Retrieve a specific log by its UUID, ensuring it belongs to the organization.
- **Tags:** logs
- **Parameters:**
  - `log_uuid` (str): The UUID of the log to retrieve.
  - `organization` (str): The organization to which the logs belong.
- **Response:**
  - Details of the requested log.

Note: Ensure that you have the necessary permissions and valid input for successful API requests.