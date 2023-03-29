import type Ingredient from './ingredient';

export default interface Plate {
  id: string;
  name: string;
  category: string;
  img_url: string;
  description?: string;
  ingredients?: Ingredient[];
}