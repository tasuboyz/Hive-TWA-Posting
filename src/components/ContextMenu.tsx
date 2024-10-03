import React from 'react';
import './Form css/ContextMenu.css';

interface ContextMenuProps {
  options: string[];
  onSelect: (option: string) => void;
  style: { top: number; left: number; };
}

const ContextMenu: React.FC<ContextMenuProps> = ({ options, onSelect }) => {
    return (
        <div className="context-menu">
            {options.map((option, index) => (
                <div key={index} className="context-menu-item" onClick={() => onSelect(option)}>
                    {option}
                </div>
            ))}
        </div>
    );
};

export default ContextMenu;
