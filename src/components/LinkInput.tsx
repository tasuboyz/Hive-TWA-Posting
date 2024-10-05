import React, { useState } from 'react';
import './Form css/LinkInput.css'; // Make sure to create a CSS file for styling

interface LinkInputProps {
  onClose: () => void;
  onSubmit: (text: string, link: string) => void;
}

const LinkInput: React.FC<LinkInputProps> = ({ onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = () => {
    onSubmit(text, link);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Insert Text and Link</h2>
        <input
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LinkInput;
