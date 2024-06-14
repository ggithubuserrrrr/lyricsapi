const express = require('express');
const Genius = require('genius-lyrics');
const cors = require('cors');

const app = express();
const Client = new Genius.Client("OX3_lEgux3wOyo2-uw5porXhiGCvc9hHV_O7-_fQoTV2bkxuF955-CH65ndZFQqD"); // Use your Genius API token here

// Middleware
app.use(cors());

// /search endpoint to get lyrics
app.get('/search', async (req, res) => {
  const searchTerm = req.query.q;

  try {
    // Search for songs
    const searches = await Client.songs.search(searchTerm);

    // Pick the first song
    const firstSong = searches[0];

    if (!firstSong) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Fetch the lyrics directly
    const lyrics = await firstSong.lyrics();

    // Extract relevant information with safety checks
    const title = firstSong.title || 'Unknown Title';
    const artist = firstSong.artist ? firstSong.artist.name : 'Unknown Artist';
    const album = firstSong.album ? firstSong.album.name : 'Unknown Album';
    const url = firstSong.url || 'No URL available'; // This URL usually refers to the song page on Genius
    const image = firstSong.image || 'No Image available';

    res.json({
      title,
      artist,
      album,
      lyrics,
      url,
      image,
    });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
