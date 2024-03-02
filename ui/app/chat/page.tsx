"use client"
import { useSearchParams } from "next/navigation"
import classes from "./page.module.css"
import { ActionIcon, TextInput, useMantineTheme, Image, Menu, Text } from "@mantine/core"
import { IconArrowLeft, IconArrowRight, IconCalendar, IconFileSearch, IconListSearch, IconPackage, IconQuestionMark, IconSearch, IconSquareCheck, IconStackFront, IconUsers, TablerIconsProps } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import chatData from "./data.json"
import { Chat, Query, Response } from "@/entities/Chat"
import ChatItem from "@/components/chat/ChatItem"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { QueryItem, QueryType } from "@/entities/Query"
import SummaryInput, { SummaryInputParams } from "@/components/summary/SummaryInput"
import { useInputState } from "@mantine/hooks"
import { sendQuery } from "@/services/QueryService"
import { Log } from "@/entities/Log"
import { getLogForLogId } from "@/services/LogService"




export default function ChatPage() {

    const queryTypeMap = new Map<QueryType, QueryItem>([
        [QueryType.QA, { type: "Q&A", typeEnum: QueryType.QA, prompt: "Ask Querious...", icon: <IconQuestionMark style={{ width: 18, height: 18 }} stroke={1.5}/> }],
        [QueryType.SEARCH, { type: "Search", typeEnum: QueryType.SEARCH, prompt: "Search relevant logs with Querious...", icon: <IconListSearch style={{ width: 18, height: 18 }} stroke={1.5}/> }],
        [QueryType.SUMMARY, { type: "Summary",typeEnum: QueryType.SUMMARY, prompt: "What do you want Querious to summarize?", icon: <IconStackFront style={{ width: 18, height: 18 }} stroke={1.5}/> }],
      ]);

    const searchParams = useSearchParams()
    const logId = searchParams.get('log_id');
    const router = useRouter();

    const theme = useMantineTheme();

    const [log, setLog] = useState<Log>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const [chats, setChats] = useState<Chat[]>([]);
    const [queryItem, setQueryItem] = useState<QueryItem>(queryTypeMap.get(QueryType.QA)!);

    const [prompt, setPrompt] = useInputState<string>("");
    const [inputParams, setInputParams] = useState<SummaryInputParams>();

    const [isQueryLoading, setIsQueryLoading] = useState<boolean>(false);
    

    if(!logId){
        return <p>Error</p>
    }
    
    useEffect(() => {
        const parsedData: Chat[] = [...(chatData as Chat[])].reverse();
        setChats(parsedData);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const l: Log = await getLogForLogId(logId)
            setLog(l);
            setInputParams({
                lineFrom: 0,
                lineTo: l.lines,
                timeFrom: l.firstLogTime,
                timeTo: l.lastLogTime
            });
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

    /*useEffect(() => {
        console.log("input", prompt, inputParams);
    });*/
    
    const updateQueryItem = (type: QueryType) => {
        setQueryItem(queryTypeMap.get(type)!);
    }

    const sendPayload  = async () => {

        setIsQueryLoading(true);
        const timestamp = Date.now();

        let type = "qa";

        switch (queryItem.typeEnum) {
            case QueryType.SEARCH:
                type = "search";
                break;
            case QueryType.SUMMARY:
                type = "summary";
                break;
            default:
                break;
        }

        let chat = {
            type: "query",
            logId: logId,
            subtype: type,
            timestamp: timestamp,
            content: {
                question: prompt,
                prompt: prompt
            }
        }

        setChats(prevChats => [chat as Query, ...prevChats]);

        await sendQuery(
            queryItem,
            prompt,
            logId,
            timestamp,
            inputParams
        )
        .then((result: Response) => {
            setChats(prevChats => [result, ...prevChats]);
            /*console.log(result)*/
            setIsQueryLoading(false)
            setPrompt("");
        })
        .catch((error: Error) => {
            setChats(prevChats => [{
                type: "error",
                message: error.message
            }, ...prevChats]);
            setIsQueryLoading(false)
        });
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <div className={classes.titleWrapper}>
                    <ActionIcon variant="subtle" aria-label="Back" onClick={() => router.push("/dashboard")}>
                        <IconArrowLeft stroke={1.5} />
                    </ActionIcon>
                    <h3 className={classes.title}><span>Chat with</span> {log?.fileName}</h3>
                </div>
                <div className={classes.logoWrapper}>
                    <span>Querious</span>
                    <Image src="./Rohde_Schwarz_Logo_Small.png" className={classes.logo}/>
                </div>
                
            </div>
            <div className={classes.body}>
            {
                chats.length == 0 ? 
                <div className={classes.placeholder}>
                    <motion.div
                        initial={{ y: -600, opacity: 0}}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ ease: "easeOut", duration: 0.8, delay: 1}}
                        >
                        <Image src="./Rohde_Schwarz_Logo_Small.png" className={classes.logo} />
                    </motion.div>
                </div>:
                <div className={classes.chat}>
                {   
                    chats.map((chat) => {
                        return <ChatItem chat={chat} key={JSON.stringify(chat)}/>
                    })
                } 
            </div>
            }
            </div>
                
            <div className={classes.footer}>

                {
                    queryItem.typeEnum == QueryType.SUMMARY ?
                    <motion.div
                        initial={{opacity: 0.4 }}
                        animate={{opacity: 1 }}
                        exit={{opacity: 0.4 }}
                        className={classes.summaryInputWrapper}
                        transition={{ duration: 0.2, ease: 'ease' }}>
                            <SummaryInput log={log!} onChange={setInputParams}/>
                    </motion.div>
                    : null
                }

                <div className={classes.inputWrapper}>

                    <Menu>
                        <Menu.Dropdown ml={12}>
                            <Menu.Item
                            leftSection={
                                <IconQuestionMark
                                style={{ width: 16, height: 16 }}
                                color={theme.colors.blue[6]}
                                stroke={1.5}
                                />
                            }
                            onClick={() => updateQueryItem(QueryType.QA)}>
                                Q&A
                            </Menu.Item>
                            <Menu.Item
                            leftSection={
                                <IconListSearch
                                    style={{ width: 16, height: 16 }}
                                    color={theme.colors.pink[6]}
                                    stroke={1.5}
                                />
                            }
                            onClick={() => updateQueryItem(QueryType.SEARCH)}>
                                Line Search
                            </Menu.Item>
                            <Menu.Item
                            leftSection={
                                <IconStackFront
                                style={{ width: 16, height: 16 }}
                                color={theme.colors.cyan[6]}
                                stroke={1.5}
                                />
                            }
                            onClick={() => updateQueryItem(QueryType.SUMMARY)}>
                                Summary
                            </Menu.Item>
                        </Menu.Dropdown>

                        <TextInput
                            placeholder={queryItem.prompt}
                            radius="xl"
                            size="md"
                            rightSectionWidth={42}
                            leftSectionWidth={42}
                            className={classes.input}
                            onChange={setPrompt}
                            value={prompt}
                            onKeyUp={(e) => {
                                if(e.code == "Enter"){
                                    sendPayload()
                                }
                            }}
                            leftSection={
                                <Menu.Target>
                                    <ActionIcon size={32} radius="xl" variant="default">
                                        {queryItem.icon}
                                    </ActionIcon>
                                </Menu.Target>
                                
                            }
                            rightSection={
                                <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled" 
                                    disabled={prompt==""} 
                                    onClick={sendPayload}
                                    loading={isQueryLoading}>
                                    <IconArrowRight style={{ width: 18, height: 18 }} stroke={1.5} />
                                </ActionIcon>
                            }
                            />
                    </Menu>
                </div>
            </div>
        </div>
    )
}


 /*{
      "logId": "a5bfa10f-27e2-45ec-b9f4-c2c32f7c4c0e",
      "timestamp": 1700260617547,
      "type": "query",
      "subtype": "qa",
      "content": {
        "question": "What is the capital of France?"
      }
    },
    {
      "logId": "a5bfa10f-27e2-45ec-b9f4-c2c32f7c4c0e",
      "timestamp": 1700260617547,
      "type": "response",
      "subtype": "qa",
      "content": {
        "answer": "Paris."
      }
    },
    {
      "logId": "a5bfa10f-27e2-45ec-b9f4-c2c32f7c4c0e",
      "timestamp": 1700260617547,
      "type": "query",
      "subtype": "search",
      "content": {
        "prompt": "Search the most segnificant error."
      }
    },
    {
      "logId": "a5bfa10f-27e2-45ec-b9f4-c2c32f7c4c0e",
      "timestamp": 1700260617547,
      "type": "response",
      "subtype": "search",
      "content": {
        "lines": [
          {
            "lineId": 12,
            "content": "LOG WARN 12124356 TEST LINUX KERNEL"
          },
          {
            "lineId": 19,
            "content": "LOG ERROR 121123356 TEST LINUX KERNEL"
          }
        ]
      }
    },
    {
      "logId": "a5bfa10f-27e2-45ec-b9f4-c2c32f7c4c0e",
      "timestamp": 1700260617547,
      "type": "query",
      "subtype": "summary",
      "content": {
        "prompt": "What are the errors?",
        "timeFrom": 1695629100000,
        "timeTo": 1695753660000,
        "lineFrom": 50,
        "lineTo": 100
      }
    },
    {
      "logId": "a5bfa10f-27e2-45ec-b9f4-c2c32f7c4c0e",
      "timestamp": 1700260617547,
      "type": "response",
      "subtype": "summary",
      "content": {
        "summary": "The average distance from the Earth to the moon is about 238,855 miles (384,400 kilometers)."
      }
    }*/