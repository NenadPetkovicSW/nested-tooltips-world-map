import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdditionalInfoService } from '../service/additionalInfo.service';
import { AdditionalInfoController } from '../controller/additionalInfo.controller';
import {AdditionalInfoSchema} from "../schema/additionalInfo.schema";

@Module({
  imports: [
    // Import MongooseModule with a specific 'Feature' schema
    MongooseModule.forFeature([{ name: 'AdditionalInfo', schema: AdditionalInfoSchema }])
  ],
  providers: [
    // Declare AdditionalInfoService as a provider
    AdditionalInfoService
  ],
  controllers: [
    // Declare AdditionalInfoController as a controller
    AdditionalInfoController
  ]
})
export class AdditionalInfoModule {}
