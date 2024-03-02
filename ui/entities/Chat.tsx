interface Query {
    logId: string;
    timestamp: number;
    type: "query";
    subtype: "qa" | "search" | "summary";
    content: QueryContent;
  }
  
interface Response {
    logId: string;
    timestamp: number;
    type: "response";
    subtype: "qa" | "search" | "summary";
    content: ResponseContent;
  }
  
  interface QueryContent {
    question?: string;
    prompt?: string;
    timeFrom?: number;
    timeTo?: number;
    lineFrom?: number;
    lineTo?: number;
  }
  
  interface ResponseContent {
    answer?: string;
    lines?: Line[];
    summary?: string;
  }
  
  interface Line {
    lineId: number;
    content: string;
  }

  interface Error{
    type: "error"
    message: string
  }

  export type { Query, Response, Error, QueryContent, ResponseContent}
  
  export type Chat = (Query | Response | Error);