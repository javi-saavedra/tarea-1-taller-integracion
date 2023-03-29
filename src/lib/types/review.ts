export default interface Review {
  id?: string;
  entity_id?: string;
  username?: string;
  rating: number;
  content: string;
  date?: string;
  password?: string;
  email?: string;
}