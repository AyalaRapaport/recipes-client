import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private _recipes: Recipe[] = []
  private recipeURL = `${environment.apiURL}/recipes/`;

  constructor(private http: HttpClient, private userService: UsersService, private router: Router, private _snackBar: MatSnackBar) { }

  getAllRecipes(search: string = '', page: number = 0, perPage: number = 0): Observable<Recipe[]> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    return this.http.get<Recipe[]>(this.recipeURL, { params })
  }

  getRecipeById(id: string | null): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.recipeURL}/` + id);
  }

  getPrivateRecipesByUserId(id: number | undefined): Observable<Recipe[]> {
    console.log(this.recipeURL + 'recipeByUserId/' + id);
    
    return this.http.get<Recipe[]>(this.recipeURL + 'recipeByUserId/' + id);
  }

  getRecipesByPreparationTime(preparationTime: number | undefined): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipeURL + 'recipeByPreparationTime/' + preparationTime);
  }

  // getImage(imageName: string) {
  //   return this.http.get(`${this.recipeURL}/image/${imageName}`, { responseType: 'blob' });
  // }

  addRecipe(r: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.userService.token}`);
    console.log("Attempting to add recipe:", r);
    return this.http.post<Recipe>(
      `${this.recipeURL}`,
      r,
      { headers }
    ).subscribe(response => {
      this._snackBar.open('המתכון נוסף בהצלחה!', 'סגור', { verticalPosition: 'top', duration: 4000 });
      this.router.navigateByUrl('allrecipes');
      console.log("Server response:", response);
    }, error => {
      this._snackBar.open('אופס המתכון לא נוסף נסה שנית', 'סגור', { verticalPosition: 'top', });
      console.error("Error occurred:", error);
    });
  }

  updateRecipe(r: any, id: string | null) {
    return this.http.put<Recipe>(`${this.recipeURL}/${id}`, r).subscribe(
      response => {
        debugger
        if (!response._id) {
          this._snackBar.open('אופס המתכון לא התעדכן נסה שנית', 'סגור', { verticalPosition: 'top', });
        }
        else {
          this._snackBar.open('המתכון התעדכן בהצלחה!', 'סגור', { verticalPosition: 'top', duration: 4000 });
          this.router.navigateByUrl('allrecipes');
          console.log("Server response:", response);
        }
      }, error => {
        debugger
        this._snackBar.open('אופס המתכון לא התעדכן נסה שנית', 'סגור', { verticalPosition: 'top', });
        console.error("Error occurred:", error);
      });
  }

  deleteRecipe(id: string | null): Observable<Recipe> {
    return this.http.delete<Recipe>(this.recipeURL + id)
  }

}
