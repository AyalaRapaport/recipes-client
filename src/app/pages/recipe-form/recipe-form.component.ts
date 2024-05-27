import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoriesService } from '../../shared/services/categories.service';
import { Category } from '../../shared/models/category';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../shared/models/recipe';
import { AuthService } from '../../shared/services/auth.service';
import { RecipesService } from '../../shared/services/recipes.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [FormsModule, CommonModule, MatRadioModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatButtonModule, MatExpansionModule, MatIconModule, MatDatepickerModule],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss'
})
export class RecipeFormComponent {
  recipeForm!: FormGroup;
  categoryList: Category[] = [];
  difficulity: string[] = ["קל", "בינוני", "קשה", "מאתגר", "מאתגר ביותר"]
  showNewCategoryInput = false;
  // newCategoryName: string = '';
  isNewCategoryChecked = false;
  newCategoryName = '';

  constructor(private recipeService: RecipesService, private fb: FormBuilder, private categoryService: CategoriesService, private authService: AuthService) {

    categoryService.getCategories().subscribe(x => this.categoryList = x);

    this.recipeForm = fb.group({
      name: fb.control('', [Validators.required, Validators.minLength(2)]),
      description: fb.control('', [Validators.required, Validators.minLength(2)]),
      difficulity: fb.control('', [Validators.required, Validators.min(1), Validators.max(5)]),
      preparationTime: fb.control('', [Validators.required, Validators.min(1)]),
      preparationHours: fb.control(0, [Validators.required, Validators.min(0)]),
      preparationMinutes: fb.control(0, [Validators.required, Validators.min(0)]),
      isPrivate: fb.control(''),
      image: fb.control(''),
      categories: fb.control([]),
      newCategories: fb.array([this.createCategory()]),
      // newCategories: this.fb.array([this.fb.control('')]),
      ingredients: fb.array([this.createIngredient()]),
      preparationInstructions: fb.array([this.createInstruction()])
    })
  }

  updateCategories(selectedCategories: string[]): void {
    const categoriesArray = this.recipeForm.get('categories') as FormArray;
    categoriesArray.clear();
    selectedCategories.forEach(category => categoriesArray.push(this.fb.control(category)));
  }

  onCategoryChange(event: MatSelectChange) {
    if (event.value.includes('אחר')) {
      this.showNewCategoryInput = true;
    } else {
      this.showNewCategoryInput = false;
    }
  }

  addNewCategory() {
    const newC = this.newCategories;
    let currentCategories = this.recipeForm.get('categories')?.value || [];

    for (let i = 0; i < newC.length - 1; i++) {
      const newCategoryName = newC.at(i).value.name;
      currentCategories.push(newCategoryName);
      this.categoryList.push({
        name: newCategoryName,
        recipes: []
      });
    }
  
    currentCategories.push(this.newCategoryName);
    this.recipeForm.get('categories')?.setValue(currentCategories);
    this.showNewCategoryInput = false;
    // Remove the 'אחר' option if it's selected
    const otherIndex = currentCategories.indexOf('אחר');
    if (otherIndex > -1) {
      currentCategories.splice(otherIndex, 1);
    }  
    currentCategories.pop();
    // Set the updated categories array to the categories form control
    this.recipeForm.get('categories')?.setValue(currentCategories);
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('preparationInstructions') as FormArray;
  }

  get newCategories(): FormArray {
    return this.recipeForm.get('newCategories') as FormArray;
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

  createCategory(): FormGroup {
    return this.fb.group({
      name: ''
    });
  }

  

  onIngredientInput(index: number) {
    const control = this.ingredients.at(index);
    if (control.value.name.trim().length === 0 && index !== this.ingredients.length - 1) {
      this.ingredients.removeAt(index);
    } else if (control.value.name.trim().length > 0 && index === this.ingredients.length - 1) {
      this.ingredients.push(this.createIngredient());
    }
  }

  onInstructionInput(index: number) {
    const control = this.instructions.at(index);
    if (control.value.step && index === this.instructions.length - 1) {
      this.instructions.push(this.createInstruction());
    } else if (!control.value.step && index !== this.instructions.length - 1) {
      this.instructions.removeAt(index);
    }
  }

  onCategoriesInput(index: number) {
    const control = this.newCategories.at(index);
    if (control.value && index === this.newCategories.length - 1) {
      this.newCategories.push(this.createCategory())
    } else if (!control.value.name && index !== this.newCategories.length - 1) {
      this.newCategories.removeAt(index);
    }
  }

  addRecipe() {
    const hours = this.recipeForm.get('preparationHours')?.value;
    const minutes = this.recipeForm.get('preparationMinutes')?.value;
    const totalPreparationTime = (hours * 60) + minutes;
    const recipe = this.recipeForm.value;
    const user = { _id: this.authService.currentUser?._id, name: this.authService.currentUser?.username }
    this.recipeForm.patchValue({ preparationTime: totalPreparationTime });
    console.log(this.recipeForm);
    console.log(this.recipeForm.status == 'INVALID');
    console.log(this.recipeForm.status);
    const newRecipe = new Recipe(0, recipe.name, recipe.description, recipe.categories,
      totalPreparationTime, recipe.difficulity, recipe.ingredients, recipe.preparationInstructions,
      user, recipe.image, undefined)
    console.log(newRecipe);

    this.recipeService.addRecipe(newRecipe);
  }
}
