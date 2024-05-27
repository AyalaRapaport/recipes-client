import { Difficulty } from "../difficulty";
import { Layer } from "./layer";
import { User } from "./user";

export class Recipe {
    constructor(public _id: number,
        public name: string,
        public description: number,
        public categories:string[],
        public preparationTime: number,
        public difficulty: Difficulty,
        public ingredients: string[],
        public preparationInstructions: string[],
        public addedBy: User|undefined,
        public image: string,
        public layers:Layer[]|undefined
    ) { }
}
