"use client"
import { IconBulb, IconQuestionMark } from "@tabler/icons-react";
import { Chat, Error, Query, Response } from "../../entities/Chat";
import classes from "./ChatItem.module.css"
import { Text, useMantineTheme } from "@mantine/core";
import RepsonseItem from "./response/ResponseItem";
import QueryItem from "./query/QueryItem";
import { motion } from "framer-motion";
import ErrorItem from "./ErrorItem";

type ChatItemProps = {
    chat: Chat
}

export default function ChatItem({chat} : ChatItemProps) {

    const theme = useMantineTheme();
    
    let content = <QueryItem query={chat as Query}/>

    if(chat.type == "response"){
        content = <RepsonseItem response={chat as Response}/>
    }

    if(chat.type == "error"){
        content = <ErrorItem error={chat as Error}/>
    }

    return (
        
        <div className={classes.chat}>
            {content}
        </div>
            
    );
  }