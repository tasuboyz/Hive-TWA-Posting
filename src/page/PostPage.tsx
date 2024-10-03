import React from 'react';
import '../App.css'
import { Telegram } from "@twa-dev/types";
import { CommunityButton } from '../components/CommunityButton';
import { useNavigate } from 'react-router-dom';
import './PostPage.css'
import FileInput from '../components/FileInput';
import { postAPI } from './api/postAPI';
import LogoffButton from '../components/LogoffButton'
import ContextMenu from '../components/ContextMenu';

declare global {
  interface Window {
    Telegram: Telegram;
  }
}
interface Upload {  
  image_base64: string;
  username: string;
  wif:string;
}

function PostPage() {
  const [titolo, setTitolo] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [tag, setTag] = React.useState('hive');
  const [dateTime, setDateTime] = React.useState('');
  const [communityId, setCommunityId] = React.useState<string | null>(null);
  const [communityName, setCommunityName] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);
  const [wif, setWif] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const [contextMenuVisible, setContextMenuVisible] = React.useState(false);
  const [contextMenuPosition, setContextMenuPosition] = React.useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = React.useState<string | null>(null);

  React.useEffect(() => {
    const savedCommunityId = localStorage.getItem('hive_selectedCommunityId');
    const savedCommunityName = localStorage.getItem('hive_selectedCommunityName');
    
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const wif = urlParams.get('wif');

    if (username) {
      sessionStorage.setItem('username', username);
      setUsername(username);
    }

    if (wif) {
      sessionStorage.setItem('wif', wif);
      setWif(wif);
    }

    const savedUsername = sessionStorage.getItem('username');
    const savedWif = sessionStorage.getItem('wif');

    if (savedUsername) {
      setUsername(savedUsername);
    }

    if (savedWif) {
      setWif(savedWif);
    }

    if (savedCommunityId) {
      setCommunityId(savedCommunityId);
    }
    if (savedCommunityName) {
      setCommunityName(savedCommunityName);
    }
  }, []);

  const inviaMessaggio = (): void => {
    //if (!titolo || !description || !tag) {
    //  setErrorMessage('Tutti i campi sono obbligatori');
    //  return;
    //}
    const post = {
        title: titolo,
        description: description,
        tag: tag,
        dateTime: dateTime,
        communityId: communityId
    }
    localStorage.removeItem('hive_title');
    localStorage.removeItem('hive_description');
    window.Telegram.WebApp.sendData(JSON.stringify(post));
  };

React.useEffect(() => {
  const savedTags = localStorage.getItem('hive_tags');
  if (savedTags) {
    setTag(savedTags);
  }
  const savedTitle = localStorage.getItem('hive_title');
  if (savedTitle) {
      setTitolo(savedTitle);
  }
  const savedDescription = localStorage.getItem('hive_description');
  if (savedDescription) {
      setDescription(savedDescription);
  }
  const savedDateTime = localStorage.getItem('dateTime');
    if (savedDateTime) {
      setDateTime(savedDateTime);
  }
}, []);
  
React.useEffect(() => {
    localStorage.setItem('hive_title', titolo);
}, [titolo]);

React.useEffect(() => {
    localStorage.setItem('hive_description', description);
}, [description]);
  
React.useEffect(() => {
  localStorage.setItem('hive_tags', tag);
}, [tag]);

const handleButtonClick = async () => {
  try {
    navigate('/Hive-TWA-Posting/community-page');
    return
  } catch (error) {
    console.error('Error fetching list:', error);
  }
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleSubmit({ image_url: base64String });
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async (data: { image_url: string }) => {  
  if (!username) {
    console.error('username is null');
    return;
  }
  if (!wif) {
    console.error('wif is null');
    return;
  }
  const upload: Upload = {
    image_base64: data.image_url,
    username: username,
    wif: wif
  };

  try 
  {
    setIsLoading(true);
    const response = await postAPI.UploadImage(upload);
    if (response.error) {
      alert(response.error);
      throw new Error(response.error);
    }
    const image_url = response.data.image_url; 
    const markdownImage = `![Image](${image_url})`;
    setDescription(prevDescription => prevDescription + '\n' + markdownImage);
  } 
  catch (error) {
    console.error('Errore durante l\'invio dell\'immagine:', error);
  }
  finally {
    setIsLoading(false); // End loading
  }
};

const handleMouseUp = (event: React.MouseEvent) => {
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
      setContextMenuPosition({ top: event.clientY, left: event.clientX });
      setContextMenuVisible(true);
  } else {
      setContextMenuVisible(false);
  }
};

const handleSelectOption = (option: string) => {
  if (selectedText) { // Controlla che selectedText non sia null
    let formattedText;
    switch (option) {
      case "Bold":
        formattedText = `**${selectedText}**`;
        break;
      case "Italic":
        formattedText = `*${selectedText}*`;
        break;
      case "Underline":
        formattedText = `<u>${selectedText}</u>`;
        break;
      case "Strikethrough":
        formattedText = `~~${selectedText}~~`;
        break;
      case "Quote":
        formattedText = `> ${selectedText}`;
        break;
      case "Script":
        formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
        break;
      case "Table":
        formattedText = `|column1|column2|column3|\n|-|-|-|\n|${selectedText}|content2|content3|`;
        break;
      case "Spoiler":
        formattedText = `>! [Hidden Spoiler Text] ${selectedText}\n> Optionally with more lines`;
        break;
      default:
        console.log(`Selected option: ${option} for text: ${selectedText}`);
        return;
    }
    setDescription(prevDescription => prevDescription.replace(selectedText, formattedText));
  } else {
    console.log("No text selected");
  }
  
  setContextMenuVisible(false);
};

  return (
    <>
      <div className="container">
      {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
      <CommunityButton onClick={handleButtonClick} communityName={communityName || ''} />
      {/* Casella di input per il titolo */}
      <textarea
        placeholder="body of post"
        className="input-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onMouseUp={handleMouseUp}
        maxLength={15000}
        style={{ width: 'calc(100% - 20px)' }}
        //style={{ width: '100%' }} // Assicura che l'input si allarghi al 100%
      />
      {contextMenuVisible && (
        <ContextMenu
          options={['Bold', 'Italic', 'Underline', 'Quote', 'Script', 'Strikethrough' , 'Table', 'Spoiler' ,'Create link']}
          onSelect={handleSelectOption}
          position={contextMenuPosition}
        />
      )}
      {/* Casella di input per i tag */}
      <input
        type="text"
        placeholder="Tag exaple: steem steemit steemexclusive"
        className="input-tag"
        value={tag}
        onChange={(e) => {
          const inputWords = e.target.value.split(' ');
          if (inputWords.length <= 7) {
            setTag(e.target.value);
          }
        }}
      />
      <input 
        type="datetime-local" 
        className="input-datetime" 
        value={dateTime} 
        onChange={(e) => setDateTime(e.target.value)} 
      />
      <FileInput onChange={handleFileChange} />
      <div className="button-logoff-container"> <LogoffButton /></div>
      {/* Bottone di invio post */}
      <button className="posting-button" onClick={inviaMessaggio}>Send Post</button>
    </div>
    </>
  )
}

export default PostPage