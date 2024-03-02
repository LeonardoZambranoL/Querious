enum QueryType{
    QA,
    SEARCH,
    SUMMARY
}

type QueryItem = {
    typeEnum: QueryType
    type: string
    prompt: string
    icon: any
}

export { QueryType }
export type { QueryItem }