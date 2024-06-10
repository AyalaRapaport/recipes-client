import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categoryURL = `${environment.apiURL}/categories/`;
  categories: Category[] = []
  constructor(private http: HttpClient) { }

  // getCategories() {
  //   this.http.get<Category[]>(this.url)
  //     .subscribe(x => this.categories = x)
  // }
  getCategories() {
    
    return this.http.get<Category[]>(this.categoryURL)
  }
}
