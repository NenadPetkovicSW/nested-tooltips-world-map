import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/worldmap'),
    FeaturesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
