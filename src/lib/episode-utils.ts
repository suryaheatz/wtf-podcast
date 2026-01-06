export const getEpisodeNumberDisplay = (
  episodeNumber: number | null | undefined,
  title: string | null | undefined
): string => {
  if (episodeNumber) {
    return `EPISODE ${episodeNumber}`;
  }

  if (title) {
    const episodeMatch = title.match(/(?:ep(?:isode)?|#)\s*(\d+)/i);
    if (episodeMatch && episodeMatch[1]) {
      return `EPISODE ${episodeMatch[1]}`;
    }
  }

  return 'NEW EPISODE';
};
