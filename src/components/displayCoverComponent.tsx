import React from 'react';
import './displayCoverComponent.css';

interface displayCoverComponentProps {
    urlImage: string;
    width: string;
    height: string;
};

const displayCoverComponent: React.FC<displayCoverComponentProps> = ({ urlImage, width, height }) => {
    return (
        <div id="divCover">
            <img src={urlImage} width={width} height={height}/>
        </div>
    );
};

export default displayCoverComponent;