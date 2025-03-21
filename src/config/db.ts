import mongoose, { Connection } from "mongoose";

class Database {
    private static instance: Database | null = null;
    private mongoConnection: Connection | null = null;


    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    async connect(connectionString: string): Promise<void> {
        try {
            console.log("DB Connecting...");
            mongoose.set("debug", true);

            const db = await mongoose.connect(connectionString ,{  writeConcern: { w: "majority", j:true }, dbName:'companyinfo'  });

            this.mongoConnection = db.connection;
            console.log("DB Connected.");
            console.log("Connected DB:", mongoose.connection.db?.databaseName);
        } catch (err) {
            console.error("MongoDB Connection Error:", err);
            process.exit(1);
        }
    }

    getConnection(): Connection | null {
        return this.mongoConnection;
    }
}

export default Database;
