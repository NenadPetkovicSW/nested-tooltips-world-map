import {KEY_WORDS} from "./constants";

export const getKeyWord = (id: string) => {
    return KEY_WORDS.find(value => value.id === id)
};