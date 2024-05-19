import { Recipe } from "./recipe";

export class Category {
    constructor(public name:string,public recipes:Recipe[]){}
}
