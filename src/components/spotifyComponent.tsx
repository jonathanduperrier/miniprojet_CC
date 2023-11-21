// src/MyComponent.tsx
import { AppSettings } from '../appsettings.js';
import React, {useState, useEffect} from 'react';
import './spotifyComponent.css'
import IsLoadingComponent from './isLoadingComponent';
import DisplayCoverComponent from './displayCoverComponent';
import DisplayAlbumComponent from './displayAlbumComponent';

interface SpotifyComponentProps {
  name: string;
}

const SpotifyComponent: React.FC<SpotifyComponentProps> = ({ name }) => {

  const [tracks, setTracks] = useState<any[]>([]);
  const [firstTract, setFirstTrack] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [, forceUpdate] = useState<boolean>();
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

  const reloadApp = () => {
    window.location.href = AppSettings.APP_DEFAULT_URL;
  }

  const removeLikedTrack = (id:any) => {
    if(window.confirm(`Souhaitez-vous vraiment supprimmer ce titre de la liste de vos morceaux préférés ?`)) {
      let objTracks = tracks;
      for(let i=0; i < objTracks.length; i++){
        if(objTracks[i].track.id === id){
          objTracks[i].track.tr_state = 0;
        }
      }
      setTracks(objTracks);
      handleForceUpdate();
    }
  }

  const addLikedTrack = (id:any) => {
    let objTracks = tracks;
    for(let i=0; i < objTracks.length; i++){
      if(objTracks[i].track.id === id){
        objTracks[i].track.tr_state = 1;
      }
    }
    setTracks(objTracks);
    handleForceUpdate();
  }

  const addStateTrack = (data:any) => {
    for(let i=0; i < data.length; i++ ){
      data[i].track.tr_state = 1;
    }
  }

  const handleForceUpdate = () => {
    forceUpdate((prev) => !prev);
  };

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
      
      if(accessToken){
        setToken(accessToken);
        const response = await fetch(AppSettings.TRACKS_URL, {
          headers: {
            'Authorization': `Bearer ` + accessToken,
          },
        });
        const data = await response.json();
        console.log("tracks : ");
        console.log(data.items);
        addStateTrack(data.items);
        setTracks(data.items);
        setFirstTrack(data.items[0]);
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
      <div id="divTracks">
        <ul id="listTracks">
          {tracks ? (
            tracks.map((track) => (
              <li key={track.track.id}>
                <div className='txtTrack'>
                  {track.track.artists[0].name} - {track.track.name}
                </div>
                <div className='btnTrack'>
                  {
                    (track.track.tr_state == 1) ? (
                      <a className='std-btn red btn-list-track' onClick={removeLikedTrack.bind(this, track.track.id)}>Supprimer</a>
                    ) : (
                      <a className='std-btn btn-list-track' onClick={addLikedTrack.bind(this, track.track.id)}>Ajouter</a>
                    )
                  }
                </div>
              </li>
            ))
          ) : (
            <li>Aucune piste disponible</li>
          )}
        </ul>
        <div id="coverFirstTrack">
          {(firstTract) ? 
            <React.Fragment>
              {<DisplayCoverComponent urlImage={firstTract.track.album.images[1].url} width='350' height='350' />}
              
              {<DisplayAlbumComponent id={firstTract.track.album.id} token={token} />}
            </React.Fragment>
          : null}
        </div>
      </div>
    </div>
  );
};

export default SpotifyComponent;
