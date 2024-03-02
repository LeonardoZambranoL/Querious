import { Response } from "@/entities/Chat"
import classes from "./SearchResponse.module.css"

interface SearchResponseProps{
    response: Response
}

export default function SearchResponse({response} : SearchResponseProps) {
    console.log(response.content.lines)
    return <div>
        {
            response.content.lines?.map((line) => {
                return <div className={classes.line}>
                    <p>
                        <b>{line.lineId}</b>{" | " + line.content}
                    </p>
                    
                </div>
            })
        }
    </div>
}