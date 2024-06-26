import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeaturesService } from '../service/features.service';
import { FeaturesController } from '../controller/features.controller';
import { FeatureSchema } from '../schema/feature.schema';

@Module({
  imports: [
    // Import MongooseModule with a specific 'Feature' schema
    MongooseModule.forFeature([{ name: 'Feature', schema: FeatureSchema }])
  ],
  providers: [
    // Declare AdditionalInfoService as a provider
    FeaturesService
  ],
  controllers: [
    // Declare AdditionalInfoController as a controller
    FeaturesController
  ]
})
export class FeaturesModule {}
