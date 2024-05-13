import { Component, Input } from '@angular/core';
import { Recipe } from '../../shared/models/recipe';
import { RecipesService } from '../../shared/services/recipes.service';
import { CommonModule } from '@angular/common';
import { CountIngredientsPipe } from '../../shared/pipes/count-ingredients.pipe';
import { TimePipe } from '../../shared/pipes/time.pipe';
import { Difficulty } from '../../shared/difficulty';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, CountIngredientsPipe, TimePipe],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent {
  [x: string]: any;
  recipe: Recipe | null = null;
  Difficulity = Difficulty
  constructor(private recipeService: RecipesService) { }

  ngOnInit() {
    this.recipeService.getRecipeById("663e0d81955ac075a7561af5").subscribe(data => {
      this.recipe = data;
      console.log(this.recipe)
    });
  }
}
