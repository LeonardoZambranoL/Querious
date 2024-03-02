import { Error } from "@/entities/Chat"
import { IconSquareX } from "@tabler/icons-react";
import classes from "./ErrorItem.module.css"

type ErrorItemProps = {
    error: Error
}

export default function ErrorItem({error} : ErrorItemProps) {

    return <div className={classes.errorWrapper}>
        <IconSquareX/>
        <p>Error: {error.message}</p>
    </div>;

}