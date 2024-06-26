import {area} from "d3";

/**
 * Interface representing a geographic feature.
 */
export interface IAdditionalData {
    /**
     * The unique identifier for the geographic feature.
     */
    id: string;

    /**
     * The name of the geographic feature.
     */
    area: number;

    /**
     * The name of the geographic feature.
     */
    population: number;

    /**
     * The name of the geographic feature.
     */
    capital: string;
}

export class AdditionalData implements IAdditionalData{
    constructor(area: number, capital: string, id: string, population: number) {
        this._area = area;
        this._capital = capital;
        this._id = id;
        this._population = population;
    }

    get area(): number {
        return this._area;
    }

    set area(value: number) {
        this._area = value;
    }

    get capital(): string {
        return this._capital;
    }

    set capital(value: string) {
        this._capital = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get population(): number {
        return this._population;
    }

    set population(value: number) {
        this._population = value;
    }

    private _area: number;
    private _capital: string;
    private _id: string;
    private _population: number;

}
