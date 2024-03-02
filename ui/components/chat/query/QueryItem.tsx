import { Query, QueryContent } from "@/entities/Chat";
import { IconListSearch, IconQuestionMark, IconSearch, IconStackFront } from "@tabler/icons-react";
import classes from "./QueryItem.module.css"

interface QueryItemProps{
    query: Query
}

export default function QueryItem({query} : QueryItemProps) {

    let icon = null;
    let content = null;
    const c = query.content as QueryContent;

    switch (query.subtype) {
        case "qa":
            content = <p>{c.question}</p>
            icon = <IconQuestionMark/>;
            break;
        case "summary":
            content = <p>{c.prompt}</p>
            icon = <IconStackFront/>;
            break;
        case "search":
            content = <p>{c.prompt}</p>
            icon = <IconListSearch/>;
            break;
        default:
            break;
    }

    return (
    <div className={classes.highlighted}>
         <div className={classes.queryWrapper}>
            { icon }
            { content }
        </div>
    </div>);
   
        

}