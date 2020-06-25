require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(path.join(__dirname, 'views/partials'))

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});



spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
     spotifyApi.setAccessToken(data.body["access_token"])
        
    })
    
  .catch((error) => 
    console.log("Something went wrong when retrieving an access token", error)
);
  
// Our routes go here:
app.get('/', (req, res) => res.render('index'))
app.get('/artist-search', (req, res) => {
    console.log(req.query.from)
    spotifyApi
        .searchArtists(req.query.from)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('artist-search-results', {
                artist: data.body.artists.items
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})
app.get('/albums/:artistId', (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
        .then(album => res.render('albums', album.body))
        .catch(err => console.log('The error while searching artists occurred: ', err))
})
app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));

