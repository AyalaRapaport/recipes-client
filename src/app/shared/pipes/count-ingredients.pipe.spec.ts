import { CountIngredientsPipe } from './count-ingredients.pipe';

describe('CountIngredientsPipe', () => {
  it('create an instance', () => {
    const pipe = new CountIngredientsPipe();
    expect(pipe).toBeTruthy();
  });
});
