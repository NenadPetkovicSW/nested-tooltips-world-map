/**
 * Interface representing a geographic feature.
 */
export interface IFeature {
    /**
     * The type of the geographic feature (e.g., 'Feature').
     */
    type: string;

    /**
     * The geometry of the geographic feature (GeoJSON format).
     */
    geometry: any;

    /**
     * The unique identifier for the geographic feature.
     */
    id: string;

    /**
     * An array of neighboring feature IDs.
     */
    neighbors: string[];

    /**
     * The name of the geographic feature.
     */
    name: string;
}

export class Feature implements IFeature{
    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get geometry(): any {
        return this._geometry;
    }

    set geometry(value: any) {
        this._geometry = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get neighbors(): string[] {
        return this._neighbors;
    }

    set neighbors(value: string[]) {
        this._neighbors = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
    constructor(type: string, geometry: any, id: string, neighbors: string[], name: string) {
        this._type = type;
        this._geometry = geometry;
        this._id = id;
        this._neighbors = neighbors;
        this._name = name;
    }

    /**
     * The type of the geographic feature (e.g., 'Feature').
     */
    private _type: string;

    /**
     * The geometry of the geographic feature (GeoJSON format).
     */
    private _geometry: any;

    /**
     * The unique identifier for the geographic feature.
     */
    private _id: string;

    /**
     * An array of neighboring feature IDs.
     */
    private _neighbors: string[];

    /**
     * The name of the geographic feature.
     */
    private _name: string;
}
