import { MongoClient, ServerApiVersion, ObjectId, PushOperator, WithId } from "mongodb";
import {
    type LogsTable,
    type UserTable
} from "@ctypes/DBTypes";

const uri = process.env.MONGODB_URI;
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
    throw new Error("⚠️ Devi definire MONGODB_URI nelle variabili d'ambiente");
}

if (process.env.NODE_ENV === "development") {
    // In sviluppo usa una variabile globale per evitare più connessioni
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
    // In produzione basta una connessione
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

const _client = await clientPromise;
const db = _client.db(process.env.MONGODB_DB);

export { 
    ObjectId, 
    type WithId,
    type PushOperator,
    type LogsTable,
    type UserTable,
};
export default db;