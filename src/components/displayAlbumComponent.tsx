
import { AppSettings } from '../appsettings.js';
import React, {useState, useEffect} from 'react';
import './displayAlbumComponent.css';

interface DisplayAlbumComponentProps {
    id:string;
}

const DisplayAlbumComponent: React.FC<DisplayAlbumComponentProps> = ({ id }) => {
    return (
        <div id="albumCover">
            display album {id}
        </div>
    )
};

export default DisplayAlbumComponent;