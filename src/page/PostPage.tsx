import React from 'react';
import '../App.css'
import { Telegram } from "@twa-dev/types";
import { CommunityButton } from '../components/CommunityButton';
import { useNavigate } from 'react-router-dom';
import './PostPage.css'
import FileInput from '../components/FileInput';
import { postAPI } from './api/postAPI';
import LogoffButton from '../components/LogoffButton'

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

  React.useEffect(() => {
    const savedCommunityId = localStorage.getItem('hive_selectedCommunityId');
    const savedCommunityName = localStorage.getItem('hive_selectedCommunityName');
    
    const urlParams = new URLSearchParams(window.location.search);
    //const username = urlParams.get('username');
    //const wif = urlParams.get('wif');

    sessionStorage.setItem('username', urlParams.get('username'));
    sessionStorage.setItem('wif', urlParams.get('wif'));

    const username = sessionStorage.getItem('username');
    const wif = sessionStorage.getItem('wif');

    setWif(wif)
    setUsername(username)

    if (savedCommunityId) {
      setCommunityId(savedCommunityId);
    }
    if (savedCommunityName) {
      setCommunityName(savedCommunityName);
    }
  }, []);

  const inviaMessaggio = (): void => {
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
      <input
        type="text"
        placeholder="Title"
        className="input-title"
        value={titolo}
        onChange={(e) => setTitolo(e.target.value)}
      />
      {/* Casella di input per la descrizione */}
      <textarea
        placeholder="body of post"
        className="input-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        // onFocus={() => setShowFormatOptions(true)}
        // onBlur={() => setShowFormatOptions(false)}
        maxLength={15000}
      />
      {/* {showFormatOptions && (
          <div className="format-options">
            <button onClick={() => formatSelectedText('bold')}>Bold</button>
            <button onClick={() => formatSelectedText('italic')}>Italic</button>
            <button onClick={() => formatSelectedText('code')}>Code</button>
          </div>
      )} */}
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
      <div><LogoffButton /></div>
      {/* Bottone di invio post */}
      <button className="button" onClick={inviaMessaggio}>Send Post</button>
    </div>
    </>
  )
}

export default PostPage
