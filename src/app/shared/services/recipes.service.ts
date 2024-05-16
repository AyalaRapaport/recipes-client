import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private _recipes: Recipe[] = []
  url: string = "http://localhost:5000/recipes/"

  constructor(private http: HttpClient) { }

  get recipes() {
    console.log(this.url + "recipes");

    return this.http.get<Recipe[]>(this.url)
  }

  getRecipeById(id: string): Observable<Recipe> {    
    return this.http.get<Recipe>(this.url + id);
  }
  

}
