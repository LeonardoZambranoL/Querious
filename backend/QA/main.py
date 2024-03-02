import yaml
import json
import time
import logging
from logging import getLogger
from pathlib import Path
from pydantic import BaseModel
from datetime import datetime

from backend.QA import generate_chunk_log_embeddings, load_embeddings, create_search_index, rerank_results, \
    generate_chatgpt, generate_claude

logger = getLogger(__name__)

logging.basicConfig(level=logging.INFO)


class GeneralConfig(BaseModel):
    embedding_model: str
    reranking_model: str


class AppConfig(BaseModel):
    general: GeneralConfig


def parse_config(yaml_config):
    # Parse the YAML
    with open(yaml_config, 'r') as yaml_file:
        config_dict = yaml.safe_load(yaml_file)

    # Create a Pydantic object
    app_config = AppConfig(**config_dict)
    return app_config


class LogQA:
    def __init__(self):
        self.data_dir = Path(r'backend/QA/data')
        self.config_path = self.data_dir / 'config.yaml'
        self.general_config = parse_config(self.config_path).general
        self.file_tracker = {}
        self.initialize_file_tracker()

        # Current session parameters
        self.path_to_logfile = None
        self.path_to_logfile_json = None
        self.path_to_logfile_embeddings = None
        self.log_embeddings = None
        self.log_jsons = None
        self.index = None

    def initialize_file_tracker(self):
        path_to_file_tracker = self.data_dir / 'file_tracker.json'

        if path_to_file_tracker.is_file():
            try:
                with open(path_to_file_tracker, 'r', encoding='utf-8') as file:
                    self.file_tracker = json.load(file)
            except Exception as e:
                logger.error(f'Failed to load file tracker: {e}')
                logger.info('Initializing an empty file tracker...')
                with open(path_to_file_tracker, 'w', encoding='utf-8') as file:
                    json.dump(self.file_tracker, file, indent=4)
        else:
            with open(path_to_file_tracker, 'w', encoding='utf-8') as file:
                json.dump(self.file_tracker, file, indent=4)

    def update_file_tracker(self):
        path_to_file_tracker = self.data_dir / 'file_tracker.json'
        with open(path_to_file_tracker, 'w', encoding='utf-8') as file:
            json.dump(self.file_tracker, file, indent=4)

    def preprocess_logfile(self, path_to_logfile: str):
        """
        Preprocesses the log file to be used for similarity search.
        Args:
            path_to_logfile [str]: path to the log file

        Returns:
            None

        """
        path_to_logfile = Path(path_to_logfile)
        log_file_dir = self.data_dir / path_to_logfile.stem
        log_file_dir.mkdir(exist_ok=True)
        path_to_logfile_json = log_file_dir / f'{path_to_logfile.stem}.json'
        path_to_logfile_embeddings = log_file_dir / f'{path_to_logfile.stem}_embeddings.json'
        generate_chunk_log_embeddings(path_to_logfile, path_to_logfile_json, path_to_logfile_embeddings)

        self.file_tracker[str(path_to_logfile)] = {
            'path_to_logfile': str(path_to_logfile),
            'path_to_logfile_json': str(path_to_logfile_json),
            'path_to_logfile_embeddings': str(path_to_logfile_embeddings),
            #     TODO: add start, end time of log file, its size and length.
        }
        self.update_file_tracker()

    def set_session_parameters(self, file_path):
        if file_path not in self.file_tracker:
            raise ValueError(f'File {file_path} not found in the database. Use the method preprocess_logfile() to add '
                             f'this file to the database.')
        file_path = str(Path(file_path))
        self.path_to_logfile = self.file_tracker[file_path]['path_to_logfile']
        self.path_to_logfile_json = self.file_tracker[file_path]['path_to_logfile_json']
        self.path_to_logfile_embeddings = self.file_tracker[file_path]['path_to_logfile_embeddings']

        self.log_embeddings = load_embeddings(self.path_to_logfile_embeddings, mode='list')
        self.log_jsons = load_embeddings(self.path_to_logfile_json, mode='json')
        self.index = create_search_index(self.log_embeddings)

    def get_log_line_by_id(self, line_id):
        """
        Returns the log line by its id.
        Args:
            line_id [int]: id of the log line

        Returns:
            log_line [str]: the log line
        """
        if self.log_jsons is None:
            raise ValueError('Session parameters not set. Use the method set_session_parameters() to set the '
                             'current logfile.')
        return self.log_jsons[line_id]['log_line']

    def get_all_log_lines(self):
        """
        Returns all log lines in the current log file.
        Returns:
            log_lines [list]: list of all log lines
        """
        if self.log_jsons is None:
            raise ValueError('Session parameters not set. Use the method set_session_parameters() to set the '
                             'current logfile.')
        return self.log_jsons

    def get_logs_by_date(self,
                         start_date="Nov 09 13:11:13",
                         end_date="Nov 11 13:11:13",
                         default_year=2023,
                         given_logs=None):
        """
        Returns all log lines in the current log file.
        Returns:
            log_lines [list]: list of all log lines
        """

        date_string_start = start_date
        date_string_end = end_date
        date_format = "%b %d %H:%M:%S"

        # Convert the date string to a datetime object
        dt_object_start = datetime.strptime(f"{default_year} {date_string_start}", "%Y " + date_format)
        dt_object_end = datetime.strptime(f"{default_year} {date_string_end}", "%Y " + date_format)

        # Convert the datetime object to a timestamp (Unix timestamp)
        timestamp_start = dt_object_start.timestamp()
        timestamp_end = dt_object_end.timestamp()

        def is_in_range(log_line):
            try:
                dt_object = datetime.strptime(f"{default_year} {log_line['log_line'][:15]}", "%Y " + date_format)
                timestamp = dt_object.timestamp()
                return timestamp_start <= timestamp <= timestamp_end
            except Exception as e:
                return False

        logs = given_logs if given_logs else self.log_jsons
        filtered_logs = list(filter(is_in_range, logs))
        return filtered_logs

    def get_logs_by_id_range(self, start_id, end_id):
        """
        Returns all log lines in the current log file.
        Returns:
            log_lines [list]: list of all log lines
        """
        return self.log_jsons[start_id:end_id]

    # TODO: Optimize this method
    def get_logs_by_all_filters(self, query, start_id=None, end_id=None, start_date=None, end_date=None):
        """
        Returns all log lines in the current log file.
        Returns:
            log_lines [list]: list of all log lines
        """
        current_logs = self.log_jsons
        if not start_id is None and not end_id is None:
            current_logs = self.get_logs_by_id_range(start_id, end_id)
        if start_date and end_date:
            current_logs = self.get_logs_by_date(start_date, end_date, given_logs=current_logs)
        if query:
            current_embeddings = []
            for i, log in enumerate(current_logs):
                current_embeddings.append(self.log_embeddings[log['id']])
                log['id'] = i
            filtered_search_index = create_search_index(current_embeddings)
            results = rerank_results(query, current_embeddings, current_logs, filtered_search_index, top_n=45)
            current_logs = [{'log_line': result.document['text'],
                             'id': result.document['id'],
                             'score': result.relevance_score} for result in results]
        return current_logs

    def log_search(self, query: str, top_n_lines: int) -> list:
        """
        Searches the log file for the query and returns the top k results.
        Args:
            file_path [str]: name of the log file
            query [str]: string query to search for
            top_k_lines [int]: number of lines to return
        """
        results = rerank_results(query, self.log_embeddings, self.log_jsons, self.index, top_n=top_n_lines)
        final_results = [{'logline': result.document['text'],
                          'id': result.document['id'],
                          'score': result.relevance_score} for result in results]
        return final_results

    def generate_llm_answer(self, query: str, top_n_lines: int):
        """
        Generates an answer to the query using the Log Language Model.
        Args:
            query [str]: query to be answered
            top_n_lines [int]: number of lines to use as context for the answer

        Returns:
            answer [str]: the generated answer
            ids [list]: list of ids of the lines used as context for the answer
        """
        top_loglines = self.log_search(query, top_n_lines)
        context = "\n".join([top_logline['logline'] for top_logline in top_loglines])
        ids = [top_logline['id'] for top_logline in top_loglines]
        prompt = f"Question: {query}\nContext from logfile: {context}"
        return generate_chatgpt(prompt), ids

    def generate_dynamic_summary(self, query, start_id=None, end_id=None, start_date=None, end_date=None,
                                 model='claude'):
        top_loglines = self.get_logs_by_all_filters(query, start_id, end_id, start_date, end_date)
        context = "\n".join([top_logline['log_line'] for top_logline in top_loglines])
        ids = [top_logline['id'] for top_logline in top_loglines]
        prompt = f"Following are the most important lines from a logfile. Write a paragraph summarizing this logfile\n\nContext from logfile:\n{context}"

        if model == 'chatgpt':
            return generate_chatgpt(prompt), ids
        else:
            return generate_claude(prompt), ids

    def reduce_resolution(self, log_jsons, step_size):
        """
        Reduces the resolution of the log file by a factor of step_size.
        Args:
            log_jsons [list]: list of log lines
            step_size [int]: step size to use for reducing the resolution
        """
        reduced_lines = [line for i, line in enumerate(log_jsons) if i % step_size == 0]
        return reduced_lines

    def generate_static_summary(self):
        ...

if __name__=='__main__':
    log = LogQA()
    path = r"/home/leo/Desktop/2/Querius/backend/QA/logs/final_log.out"
    log.preprocess_logfile(path)
    # log.set_session_parameters(path)
    # print(log.get_log_line_by_id(1000))
    # log.log_search('When were the root privileges removed for user avahi?', 10)
    # log.generate_llm_answer('What is most suspicious about these logs?', 50)
    # log.get_all_log_lines()
    # log.get_logs_by_date(start_date="Nov 09 13:42:49")
    # log.get_logs_by_all_filters(query='When were the root privileges removed for user avahi?',
    #                             start_date="Nov 08 13:42:49",
    #                             end_date="Nov 11 13:42:49",
    #                             start_id=0,
    #                             end_id=500)
    # log.generate_dynamic_summary(query='What are the errors?',
    #                              start_date="Nov 08 13:42:49",
    #                              end_date="Nov 11 13:42:49",
    #                              start_id=1,
    #                              end_id=501,
    #                              model='claude')