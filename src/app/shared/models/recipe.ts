import { Difficulty } from "../difficulty";
import { Layer } from "./layer";

export class Recipe {
    constructor(public _id: number,
        public name: string,
        public ctegoryId: number,
        public preparationTime: number,
        public difficulty: Difficulty,
        public date: Date,
        public ingredients: string[],
        public preparationInstructions: string,
        public addedByUserId: number,
        public image: string,
        public categoryName:string,
        public layers:Layer[]
    ) { }
}
