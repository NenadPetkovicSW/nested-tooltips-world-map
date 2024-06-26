export interface IKeyWord {
    id: string;
    name: string;
    description: string;
    type: string;
}

export class KeyWord implements IKeyWord {
    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }
    private _id: string;
    private _name: string;
    private _description: string;
    private _type: string;

    constructor(id: string, name: string, description: string, type: string) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._type = type;
    }


    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}
