
import { AppSettings } from '../appsettings.js';
import React, {useState, useEffect} from 'react';
import './displayAlbumComponent.css';

interface DisplayAlbumComponentProps {
    id:string;
    token:string;
}

const DisplayAlbumComponent: React.FC<DisplayAlbumComponentProps> = ({ id, token }) => {
    const [listSongs, setListSongs] = useState<any[]>([]);

    useEffect(() => {
        // Fetch data from Spotify API using the access token
        const fetchData2 = async () => {
            
            const response2 = await fetch(AppSettings.ALBUM_URL + '/' + id + '/tracks', {
                headers: {
                    'Authorization': `Bearer ` + token,
                },
            });
            const data2 = await response2.json();
            setListSongs(data2.items);
        }
        if(token !== ''){
            fetchData2();
        }
    }, []); //empty array as second argument to avoid infinite loop.

    return (
        <div id="albumCover">
            <ul id="listTracksAlbC">
                { listSongs ? (
                    listSongs.map((track) => (
                        <li key={track.id}>
                            {track.artists[0].name} - {track.name}
                        </li>
                    )
                )) : (
                    <li>Aucune piste disponible</li>
                )}
            </ul>
        </div>
    )
};

export default DisplayAlbumComponent;