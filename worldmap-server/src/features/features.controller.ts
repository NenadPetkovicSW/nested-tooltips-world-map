import {Controller, Get, Param, Post} from '@nestjs/common';
import { FeaturesService } from './features.service';
import {Feature} from "./feature.schema";

@Controller('features')
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}

    @Post('import')
    async importData() {
        await this.featuresService.importData();
        return { message: 'Data imported successfully' };
    }

    @Get(':id')
    async getFeatureById(@Param('id') id: string): Promise<Feature> {
        return this.featuresService.getFeatureById(id);
    }

    @Get()
    async getAllFeatures(): Promise<Feature[]> {
        return this.featuresService.getAllFeatures();
    }
}
