import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatSelectModule,MatInputModule,MatFormFieldModule],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss'
})
export class RecipeFormComponent {
  recipeForm!: FormGroup; 
  constructor(private fb:FormBuilder){

  this.recipeForm=fb.group({
    recipeName:fb.control('',[Validators.required,Validators.minLength(2)]),

  })
}
  addRecipe(){

  }
}
