import { Controller, Get } from '@nestjs/common';
import { MongoDBService } from './mongodb/mongodb.service';

@Controller()
export class AppController {
  constructor(private readonly mongoDBService: MongoDBService) {}

  @Get('test-mongo')
  async testMongo() {
    const db = this.mongoDBService.getDatabase();
    const collections = await db.listCollections().toArray();
    return { collections };
  }
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
