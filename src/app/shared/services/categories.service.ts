import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  url: string = "http://localhost:5000/categories/"
  categories: Category[] = []
  constructor(private http: HttpClient) { }

  // getCategories() {
  //   this.http.get<Category[]>(this.url)
  //     .subscribe(x => this.categories = x)
  // }
  getCategories() {
    return this.http.get<Category[]>(this.url)
  }
}
