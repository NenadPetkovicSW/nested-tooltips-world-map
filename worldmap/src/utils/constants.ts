import {IKeyWord} from "../types/KeyWord";

export const TOOLTIP_PADDING = 10;
export const TOOLTIP_TEXT_SIZE = 14;
export const TOOLTIP_FONT_WEIGHT = "bold";
export const TOOLTIP_FILL_COLOR = "black";
export const TOOLTIP_BACKGROUND_FILL = "white";
export const TOOLTIP_BACKGROUND_STROKE = "#666";
export const TOOLTIP_BACKGROUND_STROKE_WIDTH = 1;
export const TOOLTIP_BACKGROUND_OPACITY = 1;
export const TOOLTIP_BORDER_RADIUS = 5;
export const COUNTRY_FILL_COLOR = "#69b3a2";
export const COUNTRY_STROKE_COLOR = "#fff";
export const MOUSEMOVE_TOOLTIP_DELAY = 1000;
export const MOUSELEAVE_TOOLTIP_DELAY = 500;
export const WINDOW_SCALE_FACTOR = 5.2;

export const KEY_WORDS: IKeyWord[] = [
    {
        id: "name",
        name: "Name",
        description: "This is the name of the country",
        type: "KeyWord"
    },
    {
        id: "neighbors",
        name: "Neighbors",
        description: "Neighboring countries are those that share borders with another country",
        type: "KeyWord"
    },
    {
        id: "population",
        name: "Population",
        description: "Population refers to the number of people living in a country.",
        type: "KeyWord"
    },
    {
        id: "capital",
        name: "Capital",
        description: "Capital refers to the city where the government of a country is located.",
        type: "KeyWord"
    },
    {
        id: "area",
        name: "Area",
        description: "Land area is a country's total area.",
        type: "KeyWord"
    }
];