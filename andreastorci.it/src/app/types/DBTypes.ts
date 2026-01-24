import { ObjectId } from "mongodb"

interface CommonTable {
    _id: ObjectId
}

interface LogsTable extends CommonTable {
    alltime_visits: {
        visits: {
            total: number
            days: string[]
        },
        visits_country: Record<string, number>
    }
}

interface UserTable extends CommonTable {
    name: string,
    username: string,
    password: string
}

export { 
    type LogsTable,
    type UserTable  
}