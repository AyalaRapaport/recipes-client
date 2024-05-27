import { Component } from '@angular/core';
import { Recipe } from '../../shared/models/recipe';
import { RecipesService } from '../../shared/services/recipes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TimePipe } from '../../shared/pipes/time.pipe';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { DifficultyDirective } from '../../shared/directives/difficulty.directive'
import { AuthService } from '../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, TimePipe, NgClass, DifficultyDirective, CommonModule, FormsModule, MatCheckboxModule, MatPaginatorModule, MatInputModule, MatIconModule,],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.scss'
})
export class AllRecipesComponent {

  constructor(private recipeService: RecipesService, private router: Router, private authService: AuthService) { }

  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = []

  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [6, 10, 16];
  pageEvent: PageEvent | undefined;
  length = 0

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  recipeId: number = 0
  preparationTime: number = 0;
  allComplete: boolean = false;

  ngOnInit() {
    this.recipeService.getAllRecipes().subscribe(data => {
      this.recipes = data
      // length =data.length;
      this.length = data.length;
      this.filteredRecipes = this.recipes.slice((this.pageIndex) * this.pageSize, (this.pageIndex + 1) * this.pageSize)
    });
  }
  
  task: Task = {
    name: 'סנן לפי',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'מתכונים שלי', completed: false, color: 'primary' },
      { name: 'Accent', completed: false, color: 'accent' },
      { name: 'Warn', completed: false, color: 'warn' },
    ],
  };

  searchRecipeByPreparationTime(time: number) {
    this.recipeService.getRecipesByPreparationTime(time).subscribe(data => {
      this.recipes = data;
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.filteredRecipes = this.recipes.slice((this.pageIndex) * this.pageSize, (this.pageIndex + 1) * this.pageSize)

  }

  // updateFilteredRecipes() {
  //   const start = this.pageIndex * this.pageSize;
  //   const end = start + this.pageSize;
  //   this.filteredRecipes = this.recipes.slice(start, end);
  // }

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    const myRecipesTask = this.task.subtasks?.find(t => t.name === 'מתכונים שלי');
    if (myRecipesTask?.completed) {
      this.filterMyRecipe();
    } else {
      // Optionally, fetch all recipes if "מתכונים שלי" is not selected
      this.recipeService.getAllRecipes().subscribe(data => {
        this.recipes = data;
      });
    }
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

  applyFilter(filterValue: any) {
    this.recipeService.getAllRecipes(filterValue.value).subscribe(data => {
      this.recipes = data
    });
  }

  clearSearch(search: any) {
    search.value = '';
    this.applyFilter('');
  }

  showDetails(id: number) {
    this.recipeId = id;
    this.router.navigateByUrl(`recipeDetails/${this.recipeId}`);
  }

  filterMyRecipe() {
    this.recipeService.getRecipesByUserId(this.authService.currentUser?._id).subscribe(data => { this.filteredRecipes = data }
    )
  }

}
