import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { FeaturesService } from '../service/features.service';
import { Feature } from "../schema/feature.schema";

@Controller('features')
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}

    /**
     * Endpoint to import data from a JSON file into the 'Feature' collection.
     * @returns {Promise<{ message: string }>} Promise that resolves to an object with success message.
     */
    @Post('import')
    async importData(): Promise<{ message: string }> {
        await this.featuresService.importData();
        return { message: 'Data imported successfully' };
    }

    /**
     * Retrieves a feature by its ID.
     * @param {string} id - The ID of the feature to retrieve.
     * @returns {Promise<Feature>} Promise that resolves to the retrieved Feature object.
     */
    @Get(':id')
    async getFeatureById(@Param('id') id: string): Promise<Feature> {
        return this.featuresService.getFeatureById(id);
    }

    /**
     * Retrieves all features from the 'Feature' collection.
     * @returns {Promise<Feature[]>} Promise that resolves to an array of all Feature objects.
     */
    @Get()
    async getAllFeatures(): Promise<Feature[]> {
        return this.featuresService.getAllFeatures();
    }

    /**
     * Retrieves multiple features by their IDs.
     * @param {string[]} ids - Array of IDs of the features to retrieve.
     * @returns {Promise<Feature[]>} Promise that resolves to an array of Feature objects.
     */
    @Post('multiple')
    async getMultipleFeatures(@Body() ids: string[]): Promise<Feature[]> {
        return this.featuresService.getMultipleFeatures(ids);
    }

}