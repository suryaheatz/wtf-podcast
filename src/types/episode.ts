export interface Episode {
  id: string;
  title: string;
  description: string;
  guest: string;
  duration: string;
  releaseDate: Date;
  thumbnail?: string;
}
