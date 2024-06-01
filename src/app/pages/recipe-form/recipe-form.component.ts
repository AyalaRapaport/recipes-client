import { CommonModule, FormatWidth } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ActivatedRoute } from '@angular/router';

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
  recipeId: string | null = null
  isUpdateMode: boolean = false

  constructor(private recipeService: RecipesService, private route: ActivatedRoute, private fb: FormBuilder, private categoryService: CategoriesService, private authService: AuthService) {

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
      ingredients: fb.array([this.createIngredient()]),
      layers: fb.array([this.createLayer()]),
      preparationInstructions: fb.array([this.createInstruction()])
    })
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.isUpdateMode = true;
      this.loadRecipeData();
    }
  }

  loadRecipeData() {
    this.recipeService.getRecipeById(this.recipeId).subscribe(recipe => {
      this.recipeForm.patchValue({
        name: recipe?.name,
        description: recipe?.description,
        difficulity: recipe?.difficulty,
        preparationTime: recipe?.preparationTime,
        preparationHours: Math.floor(recipe?.preparationTime ? recipe.preparationTime / 60 : 0),
        preparationMinutes: recipe?.preparationTime ? recipe.preparationTime % 60 : 0,
        isPrivate: recipe.isPrivate ? 'כן' : 'לא',
        image: recipe?.image[0],
        categories: recipe?.categories
      });

      const ingredients = this.recipeForm.get('ingredients') as FormArray;
      if (recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          ingredients.push(this.fb.group({ name: ingredient }));
        });
      }

      const preparationInstructions = this.recipeForm.get('preparationInstructions') as FormArray;
      while (preparationInstructions.length !== 0) {
        preparationInstructions.removeAt(0);
      }
      if (recipe.preparationInstructions) {
        recipe.preparationInstructions.forEach(instruction => {
          preparationInstructions.push(this.fb.group({ step: instruction }));
        });
      }
    });
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

  // get ingredients(): FormArray {
  //   return this.recipeForm.get('ingredients') as FormArray;
  // }

  get instructions(): FormArray {
    return this.recipeForm.get('preparationInstructions') as FormArray;
  }

  get layers(): FormArray {
    return this.recipeForm.get('layers') as FormArray
  }
  get newCategories(): FormArray {
    return this.recipeForm.get('newCategories') as FormArray;
  }

  getIngredientsArray(layer: AbstractControl): FormArray {
    return layer.get('ingredients') as FormArray;
  }

  // updateIngredients() {
  //   this.layers.controls.forEach((layer, index) => {
  //     this.layerIngredients[index] = this.getIngredientsArray(layer);
  //   });
  // }

  getIngredients(layer: AbstractControl): FormArray {
    return layer.get('ingredients') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ''
    });
  }

  createLayer(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()])
    })
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

  addLayer() {
    this.layers.push(this.createLayer());
  }

  removeLayer(index: number) {
    this.layers.removeAt(index);
  }

  // onIngredientInput(index: number) {
  //   const control = this.ingredients.at(index);
  //   if (control.value.name && index === this.ingredients.length - 1) {
  //     this.ingredients.push(this.createIngredient);
  //     console.log(this.ingredients);

  //   } else if (!control.value.name && index !== this.ingredients.length - 1) {
  //     this.ingredients.removeAt(index);
  //   }
  // }

  onIngredientInput(layerIndex: number, ingredientIndex: number) {
    const layersArray = this.layers.at(layerIndex).get('ingredients') as FormArray;
    const control = layersArray.at(ingredientIndex);

    if (control.value.name && ingredientIndex === layersArray.length - 1) {
      layersArray.push(this.createIngredient());
    } else if (!control.value.name && ingredientIndex !== layersArray.length - 1) {
      layersArray.removeAt(ingredientIndex);
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
    if (!this.isUpdateMode) {
      let recipe = this.recipeForm.value;
      const user = { _id: this.authService.currentUser?._id, name: this.authService.currentUser?.username }
      recipe.user = user;
      // this.recipeForm.patchValue({ preparationTime: totalPreparationTime });
      // const newRecipe = new Recipe('', recipe.name, recipe.description, recipe.categories,
      //   totalPreparationTime, recipe.difficulity, recipe.ingredients, recipe.preparationInstructions,
      //   user, recipe.image, recipe.isPrivate, undefined)
      // console.log(newRecipe);

      console.log(recipe);
      debugger
      this.recipeService.addRecipe(recipe);
    }
  }
  updateRecipe() {
    let recipe = this.recipeForm.value;
    const user = { _id: this.authService.currentUser?._id, name: this.authService.currentUser?.username }
    recipe.user = user;
    recipe._id = this.recipeId;
    console.log(recipe);
    this.recipeService.updateRecipe(recipe);
  }
}
