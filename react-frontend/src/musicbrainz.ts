import { MusicBrainzApi } from 'musicbrainz-api';

const mbApi = new MusicBrainzApi({
  appName: 'braintest-music',
  appVersion: '0.1.0',
  appContactInfo: 'braintest@example.com',
});

export const getRecordingsByGenre = async (genre: string, limit: number) => {
  try {
    const response = await mbApi.search('recording', { query: `tag:${genre}` }, limit, 0);
    // Add a placeholder URL to each recording
    const recordingsWithUrls = response.recordings.map((recording, index) => ({
      ...recording,
      // Cycle through the 16 available placeholder songs
      url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(index % 16) + 1}.mp3`
    }));
    return recordingsWithUrls;
  } catch (error) {
    console.error(`Error fetching recordings for genre ${genre}:`, error);
    return [];
  }
};
