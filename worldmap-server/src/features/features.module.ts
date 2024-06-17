import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { FeatureSchema } from './feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Feature', schema: FeatureSchema }])
  ],
  providers: [FeaturesService],
  controllers: [FeaturesController]
})
export class FeaturesModule {}
