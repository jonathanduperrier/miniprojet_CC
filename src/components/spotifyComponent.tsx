// src/MyComponent.tsx
import React, {useState, useEffect} from 'react';

interface SpotifyComponentProps {
  name: string;
}

const SpotifyComponent: React.FC<SpotifyComponentProps> = ({ name }) => {

  const [tracks, setTracks] = useState<any[]>([]);
  const TOKEN_URL = 'https://accounts.spotify.com/api/token';
  const AUTHORIZATION_URL = 'https://accounts.spotify.com/authorize';
  const BASE_URL = 'https://api.spotify.com/v1/';
  const TRACKS_URL = 'https://api.spotify.com/v1/me/tracks';

  const CLIENT_ID = 'fade5aabb1904619864c4c7276102d48';
  const CLIENT_SECRET = 'be6740f27597409287902cdaa775434b';
  const APP_DEFAULT_URL = 'http://localhost:3000/';
  const REDIRECT_URI = 'http://localhost:3000/callback';

  const initiateSpotifyAuthorization = () => {
    // Replace these values with your actual client ID, redirect URI, and scope
    const SCOPE = 'user-library-read';
  
    // Construct the Spotify authorization URL
    const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=code`;
  
    // Redirect the user to the Spotify authorization URL
    window.location.href = authorizationUrl;
  };
  if(window.location.href === APP_DEFAULT_URL){
    initiateSpotifyAuthorization();
  }

  useEffect(() => {
    // Fetch data from Spotify API using the access token
    const fetchData = async () => {  

      const responseToken = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': 'null',
        'redirect_uri': 'http://localhost:3000/callback',
      }),
    });

    const dataToken = await responseToken.json();
    const accessToken = dataToken.access_token;


      const response = await fetch(TRACKS_URL, {
        headers: {
          'Authorization': `Bearer ` + accessToken,
        },
      });

      const data = await response.json();
      setTracks(data.items);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <h1>Display your Spotify profile data</h1>

      <section id="profile">
      <h2>Logged in as <span id="displayName"></span></h2>
      <span id="avatar"></span>
      <ul>
          <li>User ID: <span id="id"></span></li>
          <li>Email: <span id="email"></span></li>
          <li>Spotify URI: <a id="uri" href="#"></a></li>
          <li>Link: <a id="url" href="#"></a></li>
          <li>Profile Image: <span id="imgUrl"></span></li>
      </ul>
      </section>

    </div>
  );
};

export default SpotifyComponent;