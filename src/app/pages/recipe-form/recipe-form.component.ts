import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoriesService } from '../../shared/services/categories.service';
import { Category } from '../../shared/models/category';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatFormFieldModule,MatButtonModule],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss'
})
export class RecipeFormComponent {
  recipeForm!: FormGroup;
  categoryList: Category[] = [];
  selectedCategories: string[] = [];
  constructor(private fb: FormBuilder, private categoryService: CategoriesService) {

    categoryService.getCategories().subscribe(x => this.categoryList = x);

    this.recipeForm = fb.group({
      recipeName: fb.control('', [Validators.required, Validators.minLength(2)]),
      categories: fb.array([])
    })
  }
  addRecipe() {
console.log(this.recipeForm);
console.log(this.selectedCategories);


  }
}
