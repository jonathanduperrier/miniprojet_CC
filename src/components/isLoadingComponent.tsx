import React from 'react';
import './isLoadingComponent.css';

interface isLoadingComponentProps {
    loadingMsg: string;
};

const isLoadingComponent: React.FC<isLoadingComponentProps> = ({ loadingMsg }) => {
    return (
        <p className="isLoading">{loadingMsg}</p>
    );
};


export default isLoadingComponent;
