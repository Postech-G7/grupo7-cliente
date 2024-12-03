import mysql from 'mysql2/promise';

export class Repository {
  private connection!: mysql.Connection;
  private connectionPromise: Promise<void> | null = null;

  constructor(config: mysql.ConnectionOptions) {
    this.connectionPromise = this.initConnection(config);
  }

  private async initConnection(config: mysql.ConnectionOptions) {
    try {
      this.connection = await mysql.createConnection(config);
      console.log('Database connection established');
    } catch (error) {
      console.error('Error initializing database connection:', error);
      throw new Error('Database connection initialization failed');
    }
  }

  protected async query(sql: string, params: any[] = []) {
    if (this.connectionPromise) {
      await this.connectionPromise;
      this.connectionPromise = null; // Clear the promise after the connection is established
    }

    if (!this.connection) {
      throw new Error('Database connection is not initialized');
    }

    const [results] = await this.connection.execute(sql, params);
    return results;
  }
}