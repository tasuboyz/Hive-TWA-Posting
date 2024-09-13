import React, { ChangeEvent } from 'react';
import './Form css/CommunityInput.css';

interface Community {
  id: string;
  name: string;
}

interface CommunityInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  communities: Community[];
  onSelect: (community: Community) => void;
}

export const CommunityInput: React.FC<CommunityInputProps> = ({ value, onChange }) => {

  return (
    <div className="community-input-container">
      <input 
        type="text" 
        placeholder="Search community..." 
        value={value} 
        onChange={onChange}
        className="community-search"
      />
    </div>
  );
};

export default CommunityInput;
