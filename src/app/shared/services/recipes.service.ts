import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private _recipes: Recipe[] = []
  url: string = "http://localhost:5000/recipes/"

  constructor(private http: HttpClient) { }

  getAllRecipes(search: string = '', page: number = 0, perPage: number = 0): Observable<Recipe[]> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    return this.http.get<Recipe[]>(this.url, { params })
  }

  getRecipeById(id: number | undefined): Observable<Recipe> {
    return this.http.get<Recipe>(this.url + id);
  }

  getRecipesByUserId(id: number | undefined): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.url + 'recipeByUserId/' + id);
  }


}
