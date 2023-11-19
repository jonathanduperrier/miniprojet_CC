// src/MyComponent.tsx
import { AppSettings } from '../appsettings.js';
import React, {useState, useEffect} from 'react';
import './spotifyComponent.css'
import IsLoadingComponent from './isLoadingComponent';

interface SpotifyComponentProps {
  name: string;
}

const SpotifyComponent: React.FC<SpotifyComponentProps> = ({ name }) => {

  const [tracks, setTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let authorization_code:any = 'code';

  const initiateSpotifyAuthorization = () => {
    // Replace these values with your actual client ID, redirect URI, and scope
    const SCOPE = 'user-library-read';
    // Construct the Spotify authorization URL
    const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${AppSettings.CLIENT_ID}&redirect_uri=${AppSettings.REDIRECT_URI}&scope=${SCOPE}&response_type=code`;
    // Redirect the user to the Spotify authorization URL
    window.location.href = authorizationUrl;
  };
  if(window.location.href === AppSettings.APP_DEFAULT_URL){
    initiateSpotifyAuthorization();
  } else {
    let queryParameters = new URLSearchParams(window.location.search);
    authorization_code = queryParameters.get("code");
  }

  function reloadApp() {
    window.location.href = AppSettings.APP_DEFAULT_URL;
  }

  useEffect(() => {
    // Fetch data from Spotify API using the access token
    const fetchData = async () => {
      const responseToken = await fetch(AppSettings.TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(AppSettings.CLIENT_ID + ':' + AppSettings.CLIENT_SECRET),
        },
        body: new URLSearchParams({
          'grant_type': 'authorization_code',
          'code': authorization_code,
          'redirect_uri': 'http://localhost:3000/callback',
        }),
      });
      const dataToken = await responseToken.json();
      const accessToken = dataToken.access_token;
      
      if(accessToken !== undefined){
        const response = await fetch(AppSettings.TRACKS_URL, {
          headers: {
            'Authorization': `Bearer ` + accessToken,
          },
        });
        const data = await response.json();
        setTracks(data.items);
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    fetchData();
  }, []);

  return (
    <div>
      <h1>Bonjour, {name}!</h1>
      <a className='std-btn' onClick={reloadApp}>Recharger la liste</a>
      <br />
      {isLoading && <IsLoadingComponent loadingMsg="Les titres des musiques sont en cours de chargement"/>}
      {(tracks && !isLoading) ? (
          <h1>Les {tracks.length.toString()} musiques Spotify ont été chargées</h1>
        ) : null
      }
      <ul id="listTracts">
        {tracks ? (
          tracks.map((track) => (
            <li key={track.track.id}>{track.track.artists[0].name} - {track.track.name}</li>
          ))
        ) : (
          <li>Aucune piste disponible</li>
        )}
      </ul>
    </div>
  );
};

export default SpotifyComponent;
