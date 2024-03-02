"use client"
import { Log } from "@/entities/Log";
import { getLogForLogId } from "@/services/LogService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "./page.module.css"
import { ActionIcon, Image, Loader, NumberInput, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import data from "./test_log_1k.json"


export default function RefinePage() {

    const router = useRouter();

    const searchParams = useSearchParams()
    const logId = searchParams.get('log_id');

    const [log, setLog] = useState<Log>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const [min, setMin] = useState<number>(0);
    const [max, setMax] = useState<number>(100);

    const slicedData = data.lines.slice(min, max)

    if(!logId){
        return <p>Error</p>
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const l: Log = await getLogForLogId(logId)
            setLog(l);
        }
      
        fetchData()
          .then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.error(error);
          });
        
    }, [])

    if(isLoading){
        return(
            <div className={classes.loadingWrapper}>
                <Loader/>
            </div>
        );
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <div className={classes.titleWrapper}>
                    <ActionIcon variant="subtle" aria-label="Back" onClick={() => router.push("/dashboard")}>
                        <IconArrowLeft stroke={1.5} />
                    </ActionIcon>
                    <h3 className={classes.title}><span>Refine</span> {log?.fileName} <Text>{data.lines.length } Lines <span className={classes.red}>Mock Data & In Development</span></Text> </h3>
                </div>
                <div className={classes.logoWrapper}>
                    <span>Querious</span>
                    <Image src="./Rohde_Schwarz_Logo_Small.png" className={classes.logo}/>
                </div>
                
            </div>
            <div className={classes.options}>
                <NumberInput
                    label="Min Line"
                    min={0}
                    value={min}
                    max={data.lines.length}
                    onChange={(num) => setMin(num as number)}
                    />
                <NumberInput
                    label="Max Line"
                    value={max}
                    min={0}
                    max={data.lines.length}
                    onChange={(num) => setMax(num as number)}
                    />
                
            </div>
            <div className={classes.body}>
                
                {
                    slicedData.map((line) => {
                        return <div className={classes.lineWrapper}>
                            <span>{line.id}</span>
                            <div className={classes.line}>{line.log_line}</div>
                        </div>
                    })
                }
            </div>
            
        </div>
    );

}