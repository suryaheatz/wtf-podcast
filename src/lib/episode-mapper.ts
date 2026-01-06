import type { Database } from '../types/database';
import type { Episode } from '../types/episode';

type DbEpisode = Database['public']['Tables']['episodes']['Row'];

export function mapDatabaseEpisodeToEpisode(dbEpisode: DbEpisode): Episode {
  const hours = Math.floor(dbEpisode.duration_minutes / 60);
  const minutes = dbEpisode.duration_minutes % 60;

  let duration = '';
  if (hours > 0) {
    duration = `${hours}h ${minutes}m`;
  } else {
    duration = `${minutes}m`;
  }

  return {
    id: dbEpisode.id,
    title: dbEpisode.title,
    description: dbEpisode.description || '',
    guest: dbEpisode.guest_name || 'Unknown Guest',
    duration: duration,
    releaseDate: new Date(dbEpisode.release_date),
    thumbnail: dbEpisode.thumbnail_url || undefined,
  };
}

export function mapDatabaseEpisodesToEpisodes(dbEpisodes: DbEpisode[]): Episode[] {
  return dbEpisodes.map(mapDatabaseEpisodeToEpisode);
}
