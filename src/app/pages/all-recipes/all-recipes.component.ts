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
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { Category } from '../../shared/models/category';
import { CategoriesService } from '../../shared/services/categories.service';
import { Difficulty } from '../../shared/difficulty';
import { BehaviorSubject, Subject, forkJoin } from 'rxjs';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [NgxSpinnerModule, MatButtonModule, MatCardModule, TimePipe, NgClass, DifficultyDirective, CommonModule, FormsModule, MatCheckboxModule, MatPaginatorModule, MatInputModule, MatIconModule,],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.scss'
})
export class AllRecipesComponent {

  constructor(private recipeService: RecipesService, private categoryService: CategoriesService, private spinner: NgxSpinnerService, private router: Router, private authService: AuthService) { }
  private recipeSubject = new BehaviorSubject<Recipe[]>([])
  recipe$ = this.recipeSubject.asObservable()
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] | any[] = []
  categories: Category[] = []
  isLoading: boolean = true;
  task!: Task
  isFiltered: boolean = true
  selectedCategories: string[] = []
  selectedDifficulties: string[] = []
  isFilterMyRecipes: boolean = false;
  myPrivateRecipes: Recipe[] = []
  filterBySearch: boolean = false;
  searchValue: string = ''
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [6, 10, 16];
  pageEvent: PageEvent | undefined;
  length = 0

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  recipeId: string = ''
  preparationTime: number = 0;
  allComplete: boolean = false;

  ngOnInit() {
    this.spinner.show();

    const difficultyLevels: string[] = Object.values(Difficulty)
      .map(value => typeof value === 'string' ? value : undefined)
      .filter(value => value !== undefined) as string[];

    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.task = {
        name: 'סנן לפי', completed: false, color: 'primary', subtasks: [
          { name: 'מתכונים שלי', completed: false, color: 'primary' },
          {
            name: 'קטגוריות', completed: false, color: 'primary', subtasks: this.categories.map(category => ({
              name: category.name, completed: false, color: 'primary'
            }))
          },
          {
            name: 'רמת קושי', completed: false, color: 'primary', subtasks: difficultyLevels.map(diff => ({
              name: diff, completed: false, color: 'primary'
            }))
          }
        ]
      };

      //   this.recipeService.getAllRecipes().subscribe(data => {
      //     this.recipes = data;
      //     this.recipeSubject.next(data)
      //     this.length = data.length;
      //     this.filterRecipes();
      //     this.isLoading = false;
      //   });
      forkJoin([
        this.recipeService.getAllRecipes(),
        this.authService.currentUser ? this.recipeService.getPrivateRecipesByUserId(this.authService.currentUser._id) : []
      ]).subscribe(([publicRecipes, privateRecipes]) => {
        this.recipes = [...publicRecipes, ...privateRecipes];
        this.recipeSubject.next(this.recipes);
        this.length = this.recipes.length;
        this.filterRecipes();
        this.isLoading = false;
      });
    });
    //});
  }

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
    this.filterRecipes();
  }

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);

    const myRecipesTask = this.task.subtasks?.find(t => t.name === 'מתכונים שלי');
    this.isFilterMyRecipes = !!myRecipesTask?.completed;

    const categoriesTask = this.task.subtasks?.find(t => t.name === 'קטגוריות');
    this.selectedCategories = categoriesTask?.subtasks?.filter(sub => sub.completed).map(sub => sub.name) || [];

    const difficultiesTask = this.task.subtasks?.find(t => t.name === 'רמת קושי');
    this.selectedDifficulties = difficultiesTask?.subtasks?.filter(sub => sub.completed).map(sub => sub.name) || [];

    this.filterRecipes();
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
    this.filterBySearch = true;
    this.searchValue = filterValue.value ? filterValue.value.toLowerCase() : filterValue;
    this.pageIndex = 0;
    this.filterRecipes();
  }

  clearSearch(search: any) {
    search.value = '';
    this.applyFilter('');
  }

  showDetails(id: string) {
    this.recipeId = id;
    this.router.navigateByUrl(`recipeDetails/${this.recipeId}`);
  }

  // getMyRecipes() {
  //   this.recipeService.getPrivateRecipesByUserId(this.authService.currentUser?._id).subscribe(data => {
  //     console.log(data);
  //     this.myPrivateRecipes = data
  //   }
  //   )
  // }

  filterByDifficulty(list: string[]) {
    this.filteredRecipes = this.recipes.filter(recipe =>
      list.includes(Difficulty[recipe.difficulty])
    )
  }

  //   filterRecipes() {
  //     let filtered = [...this.recipes];
  //     if (this.filterBySearch) {
  //       filtered = filtered.filter(recipe => recipe.name.toLowerCase().includes(this.searchValue))
  //     }
  //     if (this.isFilterMyRecipes) {
  //      // this.isFiltered = false
  //       filtered = filtered.filter(recipe => recipe.addedBy?._id === this.authService.currentUser?._id);
  //       this.recipeService.getPrivateRecipesByUserId(this.authService.currentUser?._id).subscribe(data => {
  //         // console.log(data);
  //         // this.myPrivateRecipes = data
  //         if (data.length > 0) {
  //           debugger
  //           filtered.push(...data);
  //          // this.isFiltered = true
  //         }
  //       }
  //       )
  //     }
  //     if (this.selectedCategories.length > 0) {
  //       filtered = filtered.filter(recipe =>
  //         recipe.categories.some(category => this.selectedCategories.includes(category))
  //       );
  //     }

  //     if (this.selectedDifficulties.length > 0) {
  //       filtered = filtered.filter(recipe =>
  //         this.selectedDifficulties.includes(Difficulty[recipe.difficulty])
  //       );
  //     }
  // debugger
  //     this.filteredRecipes = filtered.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  //     this.length = filtered.length;
  //   }
  filterRecipes() {
    let filtered = [...this.recipes];
    if (this.filterBySearch) {
      filtered = filtered.filter(recipe => recipe.name.toLowerCase().includes(this.searchValue))
    }
    if (this.isFilterMyRecipes) {
      filtered = filtered.filter(recipe => recipe.addedBy?._id === this.authService.currentUser?._id);
      this.recipeService.getPrivateRecipesByUserId(this.authService.currentUser?._id).subscribe(data => {
        if (data.length > 0) {
          filtered.push(...data);
        }
      });
    }
    this.applyAllFilters(filtered);
  }

  applyAllFilters(filtered: Recipe[]) {
    if (this.filterBySearch) {
      filtered = filtered.filter(recipe => recipe.name.toLowerCase().includes(this.searchValue));
    }

    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(recipe =>
        recipe.categories.some(category => this.selectedCategories.includes(category))
      );
    }

    if (this.selectedDifficulties.length > 0) {
      filtered = filtered.filter(recipe =>
        this.selectedDifficulties.includes(Difficulty[recipe.difficulty])
      );
    }

    this.updateFilteredRecipes(filtered);
  }

  updateFilteredRecipes(filtered: Recipe[]) {
    this.filteredRecipes = filtered.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
    this.length = filtered.length;
  }

}
