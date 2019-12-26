const Artist = require('../models/artist.model');

function convertArtistIdArraysToArtistArrays(concerts) {
  return new Promise(resolve => {
    const _concerts = [];
    let concertAmount = concerts.length;

    for (const concert of concerts) {
      const artistIds = concert.artists;
      let counter = artistIds.length - 1;
      const artists = [];

      if (artistIds.length === 0) {
        concertAmount--;
      } else {
        for (const id of artistIds) {
          Artist.findById(id)
            .then(artist => {
              artists.push(artist);
              counter--;

              if (counter <= 0) {
                concert.artists = artists;
                _concerts.push(concert);
                console.log(_concerts.length);

                if (_concerts.length === concertAmount  ) {
                  resolve(_concerts);
                }
              }
            })
        }
      }
    }
  });
}

function convertArtistArraysToArtistIdArrays(concerts) {
  return new Promise(resolve => {
    const _concerts = [];

    for (const concert in concerts) {
      const artists = concert.artists;
      const artistIds = [];

      for (const artist of artists) {
        artistIds.push(artist);
      }

      concert.artists = artistIds;
      _concerts.push(concert);
    }

    resolve(_concerts);
  })
}

module.exports = {
  convertArtistIdArraysToArtistArrays,
  convertArtistArraysToArtistIdArrays
};
