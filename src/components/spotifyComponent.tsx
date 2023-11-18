// src/MyComponent.tsx
import React, {useState, useEffect} from 'react';

interface SpotifyComponentProps {
  name: string;
}

const SpotifyComponent: React.FC<SpotifyComponentProps> = ({ name }) => {

  const [tracks, setTracks] = useState<any[]>([]);
  const TOKEN_URL = 'https://accounts.spotify.com/api/token';
  const TRACKS_URL = 'https://api.spotify.com/v1/me/tracks';
  const CLIENT_ID = 'fade5aabb1904619864c4c7276102d48';
  const CLIENT_SECRET = 'be6740f27597409287902cdaa775434b';
  const APP_DEFAULT_URL = 'http://localhost:3000/';
  const REDIRECT_URI = 'http://localhost:3000/callback';
  let authorization_code:any = 'code';

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
  } else {
    let queryParameters = new URLSearchParams(window.location.search);
    authorization_code = queryParameters.get("code");
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
          'code': authorization_code,
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
      console.log(data.items);
      setTracks(data.items);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <h1>My Spotify Tracks</h1>
      <ul>
        {tracks ? (
          tracks.map((track) => (
            <li key={track.track.id}>{track.track.artists[0].name} - {track.track.name}</li>
          ))
        ) : (
          <li>No tracks available</li>
        )}
      </ul>
    </div>
  );
};

export default SpotifyComponent;
