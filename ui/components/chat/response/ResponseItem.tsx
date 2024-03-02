import { Response, ResponseContent } from "@/entities/Chat";
import { IconAdjustments, IconBulb, IconInfoSmall, IconInfoSquare, IconInfoSquareRounded } from "@tabler/icons-react";
import classes from "./ResponseItem.module.css"
import SearchResponse from "./search/SearchResponse";
import { ActionIcon, Button, Popover, Text } from "@mantine/core";

interface ResponseItemProps{
    response: Response
}

export default function RepsonseItem({response} : ResponseItemProps) {

    let content = null;

    const r = response.content as ResponseContent;

    console.log(r)
    switch (response.subtype) {
        
        case "qa":
            content = 
            <div>
                <Text>{r.answer} </Text>
                <Popover width={200} position="top-start" shadow="md">
                    <Popover.Target>
                        <Button variant="transparent" size="compact-md" fw={400} p={0} fz={14}>view source</Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                    <Text size="xs">
                        {
                            r.lines
                            ?.sort((a, b) => a.lineId - b.lineId)
                            .map((line, index) => (
                                <span key={index}>
                                    {index > 0 ? `, line: ${line.lineId}` : ` line: ${line.lineId}`}
                                </span>
                            ))
                        }
                    </Text>
                    </Popover.Dropdown>
                </Popover>
            </div>
            break;
        case "summary":
            content = <p>{r.summary}</p>
            break;
        case "search":
            content = <SearchResponse response={response} key={response.timestamp}/>;
            break;
        default:
            break;
    }

    return (
         <div className={classes.responseWrapper}>
            <div>
            <IconBulb width={24}/>
            </div>
            { content }
        </div>);

}