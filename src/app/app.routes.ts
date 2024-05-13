import { Routes } from '@angular/router';

export const routes: Routes = [
     { path: 'login', loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent), pathMatch: 'full' },
     { path: 'allrecipes', loadComponent: () => import('./pages/all-recipes/all-recipes.component').then(c => c.AllRecipesComponent) },
     { path: 'register', loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent) },
     { path: 'recipeDetails', loadComponent: () => import('./pages/recipe-details/recipe-details.component').then(c => c.RecipeDetailsComponent) },

];
