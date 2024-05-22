import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private _recipes: Recipe[] = []
  private recipeURL = `${environment.apiURL}/recipes/`;

  constructor(private http: HttpClient) { }

  getAllRecipes(search: string = '', page: number = 0, perPage: number = 0): Observable<Recipe[]> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    return this.http.get<Recipe[]>(this.recipeURL, { params })
  }

  getRecipeById(id: string | undefined): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.recipeURL}/` + id);
  }

  getRecipesByUserId(id: number | undefined): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipeURL + 'recipeByUserId/' + id);
  }

  getRecipesByPreparationTime(preparationTime: number | undefined): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipeURL + 'recipeByPreparationTime/' + preparationTime);
  }

  


}
