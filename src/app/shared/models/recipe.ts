import { Difficulty } from "../difficulty";
import { Layer } from "./layer";
import { User } from "./user";

export class Recipe {
    constructor(
        public _id: string,
        public name: string,
        public description: number,
        public categories: string[],
        public preparationTime: number,
        public difficulty: Difficulty,
        public ingredients: string[],
        public preparationInstructions: string[],
        public addedBy: User | undefined,
        public image: string,
        public isPrivate:boolean,
        public layers: Layer[] | undefined,
    ) { }
}
