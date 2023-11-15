// src/MyComponent.tsx
import React from 'react';

interface SpotifyComponentProps {
  name: string;
}

const SpotifyComponent: React.FC<SpotifyComponentProps> = ({ name }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default SpotifyComponent;
