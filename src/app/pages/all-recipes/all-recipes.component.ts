import { Component } from '@angular/core';
import { Recipe } from '../../shared/models/recipe';
import { RecipesService } from '../../shared/services/recipes.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { TimePipe } from '../../shared/pipes/time.pipe';
import { NgClass } from '@angular/common';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,TimePipe,NgClass],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.scss'
})
export class AllRecipesComponent {
showDetails() {  
  this.router.navigateByUrl('recipeDetails')
}

recipes:Recipe[]=[];

constructor(private recipeService:RecipesService,private router:Router){}

ngOnInit(){
  this.recipeService.recipes.subscribe(data=>{this.recipes=data
  console.log(this.recipes)});
}

}
