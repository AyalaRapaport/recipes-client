import { Pipe, PipeTransform } from '@angular/core';
import { Layer } from '../models/layer';
import { count } from 'rxjs';

@Pipe({
  name: 'countIngredients',
  standalone: true
})
export class CountIngredientsPipe implements PipeTransform {

  transform(layers: Layer[]|undefined): number {
    let count:number=0;
    layers?.forEach(l => {
      count+= l.ingredients.length
    });
    return count;
  }

}
