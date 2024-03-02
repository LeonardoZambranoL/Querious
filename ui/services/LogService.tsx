import { Log } from "@/entities/Log";
import { DEBUG, PATH, TOKEN }from "./Constants"
import logData from "./data/logData.json"

const getLogForLogId = async (logId: string) => {
    
    if(DEBUG){
        await new Promise(resolve => setTimeout(resolve, 1500));
        const data = logData as Log[];
        return data.find((log) => log.logId == logId)!;
    }

    return await new Promise<Log>( async (resolve, reject) => {
        const response = await fetch(`${PATH}/log/${logId}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            method: "GET",

        });
        if (response.ok) {
            const data = await response.json(); 
            resolve(data as Log);
        } else {
            reject(new Error("Failed to fetch log")); 
        }
    })
}

const getAllLogs = async () => {
   
    if(DEBUG){
        await new Promise(resolve => setTimeout(resolve, 1500));
        return logData as Log[];
    }

    return await new Promise<Log[]>( async (resolve, reject) => {
        const response = await fetch(`${PATH}/log/all`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            method: "GET",

        });
        if (response.ok) {
            const data = await response.json(); 
            resolve(data as Log[]);
        } else {
            reject(new Error("Failed to fetch logs")); 
        }
    })
}


export { getLogForLogId, getAllLogs }