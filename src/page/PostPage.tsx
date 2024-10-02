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
  <div className="page-container">
    {isLoading && (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )}
    <form className="form-container" onSubmit={(e) => e.preventDefault()}>
      <div className="input-container">
        <CommunityButton onClick={handleButtonClick} communityName={communityName || ''} />
      </div>
      <div className="input-container">
        <label htmlFor="title" className="input-label">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter title"
          className="input-title"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="description" className="input-label">Body</label>
        <textarea
          id="description"
          placeholder="Enter post body"
          className="input-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={15000}
        />
      </div>
      <div className="input-container">
        <label htmlFor="tags" className="input-label">Tags</label>
        <input
          id="tags"
          type="text"
          placeholder="Enter tags (e.g., steem steemit steemexclusive)"
          className="input-tag"
          value={tag}
          onChange={(e) => {
            const inputWords = e.target.value.split(' ');
            if (inputWords.length <= 7) {
              setTag(e.target.value);
            }
          }}
        />
      </div>
      <div className="input-container">
        <label htmlFor="datetime" className="input-label">Date and Time</label>
        <input 
          id="datetime"
          type="datetime-local" 
          className="input-datetime" 
          value={dateTime} 
          onChange={(e) => setDateTime(e.target.value)} 
        />
      </div>
      <div className="input-container">
        <FileInput onChange={handleFileChange} />
      </div>
      <div className="button-logoff-container">
        <LogoffButton />
      </div>
      <div className="posting-button-container">        
        <button className="posting-button" onClick={inviaMessaggio}>Send Post</button>
      </div>
    </form>
  </div>
);
}

export default PostPage
