import * as mongoDB from "mongodb";

export class Repository {
  url: string;
  database!: string;
  collection!: string;

  constructor(url: string) {
    this.url = url;
  }

  protected async getCollection(
    database: string,
    collection: string
  ): Promise<mongoDB.Collection> {
    try {
      const client: mongoDB.MongoClient = new mongoDB.MongoClient(this.url);
      await client.connect();
      const db: mongoDB.Db = client.db(database);
      return db.collection(collection);
    } catch (error) {
      throw error;
    }
  }

  protected toObjectId(id: string): mongoDB.ObjectId {
    return new mongoDB.ObjectId(id);
  }
}
