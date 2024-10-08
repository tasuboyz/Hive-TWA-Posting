import React from 'react';
import './Form css/FileInput.css';

interface FileInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onChange }) => {
  const fileInputRef = React.createRef<HTMLInputElement>();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-input-container">
      <button id="dropZone" onClick={handleClick}>
        Load Image 🖼
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event)}
        className="hidden-file-input"
      />
    </div>
  );
};

export default FileInput;
