import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

class Config {
  private uri: string;

  constructor() {
    this.uri = process.env.DATABASE_URI as string;

    // Ensure required variables are present
    if (!this.uri) {
      throw new Error('DATABASE URI is required in .env file');
    }

    if (!process.env.PORT) {
      throw new Error('PORT is required in .env file');
    }
    if (!process.env.BCRYPT_SALT_ROUNDS) {
      throw new Error('BCRYPT SALT ROUNDS is required in .env file');
    }
    if (!process.env.NODE_ENV) {
      throw new Error('NODE ENV is required in .env file');
    }
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET is required in .env file');
    }
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is required in .env file');
    }
  }

  // MongoDB connection method
  public async connectDB() {
    try {
      await mongoose.connect(this.uri);
      console.log('Connected to MongoDB Successfully');
    } catch (error) {
      console.error(
        'Error connecting to MongoDB:',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  // Getter for the port from the environment variable
  public get port(): number {
    return Number(process.env.PORT);
  }
  public get slat(): number {
    return Number(process.env.BCRYPT_SALT_ROUNDS)
  }
  public get password(): string {
    return String(process.env.DEFAULT_PASS as string)
  }
  public get nodeEnv(): string {
    return String(process.env.NODE_ENV as string)
  }
  public get jwt(): string {
    return String(process.env.JWT_ACCESS_SECRET as string)
  }
  public get jwtRef(): string {
    return String(process.env.JWT_REFRESH_SECRET as string)
  }
}

export default new Config();
