import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoriesService } from '../../shared/services/categories.service';
import { Category } from '../../shared/models/category';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [FormsModule,CommonModule, MatRadioModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatButtonModule, MatExpansionModule, MatIconModule, MatDatepickerModule],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss'
})
export class RecipeFormComponent {
  labelPosition: 'כן' | 'לא' = 'לא';
  recipeForm!: FormGroup;
  categoryList: Category[] = [];
  selectedCategories: string[] = [];
  constructor(private fb: FormBuilder, private categoryService: CategoriesService) {

    categoryService.getCategories().subscribe(x => this.categoryList = x);

    this.recipeForm = fb.group({
      recipeName: fb.control('', [Validators.required, Validators.minLength(2)]),
      description: fb.control('', [Validators.required, Validators.minLength(2)]),
      difficulity: fb.control('', [Validators.required, Validators.min(1), Validators.max(5)]),
      preparationTime: fb.control('', [Validators.required, Validators.min(1)]),
      isPrivate: fb.control('', [Validators.nullValidator]),
      categories: fb.array([]),
      ingredients: this.fb.array([this.createIngredient()]),
      instructions: this.fb.array([this.createInstruction()])
    })
  }
  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ''
    });
  }

  createInstruction(): FormGroup {
    return this.fb.group({
      step: ''
    });
  }

  onIngredientInput(index: number): void {
    const control = this.ingredients.at(index);
    if (control.value.name && index === this.ingredients.length - 1) {
      this.ingredients.push(this.createIngredient());
    } else if (!control.value.name && index !== this.ingredients.length - 1) {
      this.ingredients.removeAt(index);
    }
  }

  onInstructionInput(index: number): void {
    const control = this.instructions.at(index);
    if (control.value.step && index === this.instructions.length - 1) {
      this.instructions.push(this.createInstruction());
    } else if (!control.value.step && index !== this.instructions.length - 1) {
      this.instructions.removeAt(index);
    }
  }

  addRecipe() {
    console.log(this.recipeForm);
    console.log(this.selectedCategories);
  }
}
