import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { isManagerGuard } from './shared/guards/isManager.guard copy';

export const routes: Routes = [
     { path: 'login', loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent), pathMatch: 'full' },
     { path: 'allrecipes', canActivate: [authGuard], loadComponent: () => import('./pages/all-recipes/all-recipes.component').then(c => c.AllRecipesComponent) },
     { path: 'register', loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent) },
     { path: 'recipe-form/:id',canActivate: [authGuard], loadComponent: () => import('./pages/recipe-form/recipe-form.component').then(c => c.RecipeFormComponent) },
     { path: 'recipe-form',canActivate: [authGuard], loadComponent: () => import('./pages/recipe-form/recipe-form.component').then(c => c.RecipeFormComponent) },
     { path: 'recipeDetails/:id',canActivate: [authGuard], loadComponent: () => import('./pages/recipe-details/recipe-details.component').then(c => c.RecipeDetailsComponent) },
     { path: 'allusers', canActivate: [isManagerGuard], loadComponent: () => import('./pages/all-users/all-users.component').then(c => c.AllUsersComponent) },

];
