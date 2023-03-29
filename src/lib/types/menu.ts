import type Plate from './plate';

export default interface Menu {
  id: string;
  name: string;
  price: number;
  size?: number;
  description?: string;
  expiration?: number;
  courses?: Plate[];
}