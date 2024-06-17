import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../../shared/services/recipes.service';
import { Recipe } from '../../shared/models/recipe';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private recipeservice: RecipesService, private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) { }
  slideIndex: number = 1;
  recipes: Recipe[] = [];
  slideGroups: any[][] = [];
  isLoaded: boolean = false;

  ngOnInit(): void {
    this.recipeservice.getAllRecipes().subscribe(x => {
      this.recipes = x;
      this.prepareSlides();
      this.showSlides(this.slideIndex);
      setTimeout(() => this.autoShowSlides(), 100);
      this.isLoaded = true;
    });
  }

  getRecipeDetails(id: string) {
    if (!this.authService.isLoggedIn) {
      this._snackBar.open('לצפיה במתכון עליך לבצע התחברות', 'התחברות', {
        verticalPosition: 'top',duration:5000,
      }).onAction().subscribe(() => {
        this.router.navigateByUrl('login');
      });
    }
    else{
      this.router.navigateByUrl(`recipeDetails/${id}`);
    }
  }

  prepareSlides() {
    for (let i = 0; i < this.recipes.length; i += 3) {
      this.slideGroups.push(this.recipes.slice(i, i + 3));
    }
  }

  plusSlides(n: number) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n: number) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n: number) {
    let i;
    let slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    if (slides.length === 0) return;

    if (n > slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }


    slides[this.slideIndex - 1].style.display = "block";

  }

  autoShowSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    if (slides.length === 0) return;

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    this.slideIndex++;
    if (this.slideIndex > slides.length) {
      this.slideIndex = 1;
    }
    slides[this.slideIndex - 1].style.display = "block";
    setTimeout(() => this.autoShowSlides(), 5000);
  }
}
