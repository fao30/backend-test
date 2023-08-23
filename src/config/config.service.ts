import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get secretKey(): string {
    return process.env.JWT_SECRET;
  }

  get databaseUrl(): string {
    return process.env.DATABASE_URL;
  }
}
