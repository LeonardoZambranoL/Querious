import { QueryItem, QueryType } from "@/entities/Query";
import { DEBUG, PATH, TOKEN }from "./Constants"
import chatData from "./data/chatData.json"
import { SummaryInputParams } from "@/components/summary/SummaryInput";
import { Chat, Query, Response } from "@/entities/Chat";
import { log } from "console";

const sendQuery = async (
    queryItem: QueryItem, 
    prompt: string, 
    logId: string, 
    timestamp: number, 
    summaryInputParams?: SummaryInputParams
) => {

    let response: Response | null = null;

    switch (queryItem.typeEnum) {
        case QueryType.QA:
            response = await sendQAQuery(prompt, logId, timestamp);
            break;
        case QueryType.SEARCH:
            response = await sendSearchQuery(prompt, logId, timestamp);
            break;
        case QueryType.SUMMARY:
            if(summaryInputParams != null){
                response = await sendSummaryQuery(
                {
                    prompt: prompt,
                    lineFrom: summaryInputParams.lineFrom,
                    lineTo: summaryInputParams.lineTo,
                    timeFrom: summaryInputParams.timeFrom,
                    timeTo: summaryInputParams.timeTo
                },
                logId,
                timestamp
                );
            }
            break;
        default:
            break;
    }

    console.log(summaryInputParams, response)

    return new Promise<Response>((resolve, reject) => {
        setTimeout( async () => {
            if(response == null){
                reject(new Error("response is null"))
            }
            resolve(response!);
        }, 1500)
    })

}

const sendQAQuery = async (question: string, logId: string, timestamp: number) => {
    if(DEBUG){
        return new Promise<Response>((resolve, reject) => {
            setTimeout(resolve, 1500);
            resolve((chatData as Chat[])[1] as Response)
        })
    }

    const queryData: Query = {
        "logId": logId,
        "timestamp": timestamp,
        "type": "query",
        "subtype": "qa",
        "content": {
            "question": question
        }
    };

    return await fetchQuery(`${PATH}/query`, queryData);

    
}

const sendSummaryQuery = async (query: SummaryQuery, logId: string, timestamp: number) => {
    if(DEBUG){
        return new Promise<Response>((resolve, reject) => {
            setTimeout(resolve, 1500);
            resolve((chatData as Chat[])[5] as Response)
        })
    }

        const queryData: Query = {
            "logId": logId,
            "timestamp": timestamp,
            "type": "query",
            "subtype": "summary",
            "content": {
                "prompt": query.prompt,
                "timeFrom": query.timeFrom,
                "timeTo": query.timeTo,
                "lineFrom": query.lineFrom,
                "lineTo": query.lineTo
            }
        };

        return await fetchQuery(`${PATH}/query`, queryData);
    
}

const sendSearchQuery = async (prompt: string, logId: string, timestamp: number) => {
    if(DEBUG){
        return new Promise<Response>((resolve, reject) => {
            setTimeout(resolve, 1500);
            resolve((chatData as Chat[])[3] as Response)
        })
    }

    const queryData: Query = {
        "logId": logId,
        "timestamp": timestamp,
        "type": "query",
        "subtype": "search",
        "content": {
            "prompt": prompt
        }
    };

    return await fetchQuery(`${PATH}/query`, queryData);

}

const fetchQuery = async (url: string, queryData: Query) => {

    console.log(queryData)

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(queryData)
    });

    if (response.ok) {
        const data = await response.json();
        return data as Response;
    } else {
        throw new Error("Failed to fetch log");
    }
}

interface SummaryQuery{
    prompt: string;
    timeFrom: number;
    timeTo: number;
    lineFrom: number;
    lineTo: number;
}

export type { SummaryQuery };
export { sendQuery };