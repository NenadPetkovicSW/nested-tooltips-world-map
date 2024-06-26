import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeaturesModule } from './features/module/features.module';
import {AdditionalInfoModule} from "./additionalInfo/module/additionalInfo.module";

@Module({
  imports: [
    // Connect to MongoDB using Mongoose
    MongooseModule.forRoot('mongodb://localhost:27017/worldmap'),
    // Import features module
    FeaturesModule,
    AdditionalInfoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
