import { Component } from '@angular/core';
import { Recipe } from '../../shared/models/recipe';
import { RecipesService } from '../../shared/services/recipes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TimePipe } from '../../shared/pipes/time.pipe';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import {DifficultyDirective} from '../../shared/directives/difficulty.directive'
@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, TimePipe, NgClass,DifficultyDirective,CommonModule],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.scss'
})
export class AllRecipesComponent {
  recipeId: number = 0
  recipes: Recipe[] = [];

  showDetails(id:number) {
    this.recipeId=id;
    this.router.navigateByUrl(`recipeDetails/${this.recipeId}`);
  }


  constructor(private recipeService: RecipesService, private router: Router) { }

  ngOnInit() {
    this.recipeService.recipes.subscribe(data => {
      this.recipes = data
      console.log(this.recipes)
    });
  }

}
