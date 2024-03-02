"use client"
import { useEffect, useState } from "react";
import logsData from "./data.json"
import { Log } from "@/entities/Log";
import LogCard from "@/components/log/LogCard";
import classes from "./page.module.css"
import { Button, Image, Loader } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { getAllLogs } from "@/services/LogService";

export default function Dashboard() {

  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getAllLogs()
        .then((logs) => setLogs(logs))
        .catch((error) => console.log);
      setIsLoading(false);
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


  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
      <Image src="./Rohde_Schwarz_Logo.png" className={classes.logo}/>
        
        <Button
          variant="light"
          leftSection={<IconUpload size={14} />}>
          New Log
        </Button>
      </div>
      {
        isLoading ? <div className={classes.loadingWrapper}>
          <Loader />
        </div> : null
      }
      <div className={classes.gridContainer}>
        {
          logs.map((log) => {
            return <LogCard log={log}/>
          })
        }
      </div>
      
    </div>
    
  )
}
