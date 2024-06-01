import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../../shared/models/recipe';
import { RecipesService } from '../../shared/services/recipes.service';
import { CommonModule } from '@angular/common';
import { CountIngredientsPipe } from '../../shared/pipes/count-ingredients.pipe';
import { TimePipe } from '../../shared/pipes/time.pipe';
import { Difficulty } from '../../shared/difficulty';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, CountIngredientsPipe, TimePipe],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent implements OnInit {

  recipe: Recipe | null = null;
  Difficulity = Difficulty
  currentIndex: number = 0;
  isOwner: boolean | undefined = false
  recipeId: string | null = null

  constructor(private recipeService: RecipesService, private router: Router, private route: ActivatedRoute, private authService: AuthService, private _snackBar: MatSnackBar) { }

  images: string[] = [
    'https://material.angular.io/assets/img/examples/shiba2.jpg',
    'https://foody.co.il/app/themes/Foody/resources/images/icons/clock@2x.png?ver=1.2',
    'https://material.angular.io/assets/img/examples/shiba2.jpg',

  ];
  ngOnInit() {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.recipeService.getRecipeById(this.recipeId).subscribe(data => {
        this.recipe = data;
        console.log(this.recipe);

        this.updateIsOwner();
      });
    }

  }

  updateIsOwner() {
    this.isOwner = this.authService.currentUser && (this.authService.currentUser._id === this.recipe?.addedBy?._id);
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  showPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  updateRecipe() {
    this.router.navigateByUrl(`recipe-form/${this.recipeId}`);
  }

  deleteRecipe() {
    const snackBarRef = this._snackBar.open('האם למחוק את המתכון', 'כן', { duration: 3000 });
    snackBarRef.onAction().subscribe(() => {
      this.recipeService.deleteRecipe(this.recipeId).subscribe(
        () => {
          this._snackBar.open('המתכון נמחק בהצלחה!', 'סגור', { duration: 4000 });
          this.router.navigateByUrl(`allrecipes`);
        },
        error => {
          console.error('Error deleting recipe:', error);
        }
      );
    });
  }

}
