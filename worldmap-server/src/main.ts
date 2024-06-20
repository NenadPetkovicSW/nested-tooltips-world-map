import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);
  // Enable Cross-Origin Resource Sharing (CORS)
  app.use(cors());
  // Start the application on port 3000
  await app.listen(3000);
}
bootstrap();
