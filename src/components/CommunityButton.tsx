import React from 'react';
import '../App.css'

interface CommunityButtonProps {
  onClick: () => void;
  communityName: string;
}

export const CommunityButton: React.FC<CommunityButtonProps> = ({ onClick, communityName }) => {
  return (
    <div className="community-button-container">
      <button onClick={onClick} className="community-button">
        {communityName || 'Search Community 🔎'}
      </button>
    </div>
  );
};

export default CommunityButton;
