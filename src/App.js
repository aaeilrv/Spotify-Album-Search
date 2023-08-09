import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function App() {

  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + process.env.REACT_APP_CLIENT_ID + '&client_secret=' + process.env.REACT_APP_CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data=> setAccessToken(data.access_token))
  }, [])

  // Search
  async function search() {
    console.log("Search for " + searchInput)

    //use the Search to get the artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })

    console.log("Artist ID: " + artistID)

    //Make request with artistID to get albums
    // eslint-disable-next-line
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      });

    console.log(albums)
  }

  return (
    <div className="App">
      <Container className='mt-3'>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for artist"
            type="input"
            onKeyDown={event => {
              if (event.key === 'Enter') {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={() => {search()}}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mx-2 row row-cols-4 row-gap-5'>
          {albums.map((album, index) => {
            return (
            <a href={album.external_urls.spotify} class="link-underline link-underline-opacity-0">
            <Card>
              <Card.Img src={album.images[0].url}></Card.Img>
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
              </Card.Body>
            </Card>
            </a>
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
