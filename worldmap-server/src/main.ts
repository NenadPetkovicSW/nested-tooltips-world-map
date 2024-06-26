import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { FeaturesService } from './features/service/features.service';
import { AdditionalInfoService } from './additionalInfo/service/additionalInfo.service';

async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);
  // Enable Cross-Origin Resource Sharing (CORS)
  app.use(cors());

  // Get an instance of FeaturesService
  const featuresService = app.get(FeaturesService);
  // Import data if the collection is empty
  await featuresService.importDataIfEmpty();
  // Get an instance of AdditionalInfoService
  const additionalInfoService = app.get(AdditionalInfoService);
  // Import data if the collection is empty
  await additionalInfoService.importDataIfEmpty();
  
  // Start the application on port 3000
  await app.listen(3000);
}
bootstrap();
