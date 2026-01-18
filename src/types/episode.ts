export interface Episode {
  id: string;
  episodeNumber?: number;
  title: string;
  description: string;
  guest: string;
  duration: string;
  releaseDate: Date;
  thumbnail?: string;
}
