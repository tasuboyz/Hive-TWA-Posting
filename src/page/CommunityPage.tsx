import React, { useState, useEffect, useCallback } from 'react';
import './CommunityPage.css';
import '../App.css'
import { Telegram } from "@twa-dev/types";
import { Box, List, ListItem, ListItemText, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

interface Community {
  title: string;
  name: string;
}

function CommunityPage() {
  const [communityNames, setCommunityNames] = useState<Array<string>>([]);
  const [community, setCommunity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

const SearchCommunity = useCallback(async (): Promise<void> => {
  setLoading(true);
  const headers = { "accept": "application/json", "Content-Type": "application/json" };
  try {
      const response = await fetch(`https://imridd.eu.pythonanywhere.com/api/hive/communities?title=${community}&limit=20`, {
          method: 'GET',
          headers: headers,
      });
      if (!response.ok) {
          throw new Error('Error fetching communities');
      }
      const data = await response.json();
      const newCommunities = data.map((item: Community) => `${item.name},${item.title}`);
      setCommunityNames(newCommunities);
      setLoading(false);
  } catch (error) {
      window.Telegram.WebApp.showPopup({
          title: "Error",
          message: "An error occurred while fetching communities.",
          buttons: [{ type: 'ok' }]
      });
      console.error('Error fetching communities:', error);
      setLoading(false);
  }
}, [community]);

  useEffect(() => {
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.BackButton.onClick(() => {
      window.Telegram.WebApp.BackButton.hide();
      navigate('/Hive-TWA-Posting/post');
    });

      SearchCommunity();
  }, [SearchCommunity, navigate]);

  const handleCommunityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommunity(event.target.value);
    const filteredCommunities = communityNames.filter(name => 
      name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setCommunityNames(filteredCommunities);
  };

  const handleCommunitySelect = (selectedName: string, selectedId: string) => {
    console.log(`Selected community: ${selectedName}, ID: ${selectedId}`);
    setCommunity(selectedName);
    localStorage.setItem('hive_selectedCommunityId', selectedId);
    localStorage.setItem('hive_selectedCommunityName', selectedName);
    window.Telegram.WebApp.BackButton.hide();
    navigate('/Hive-TWA-Posting/post');
  };

  return (
    <div className="container-community">
      <div className="search-container">
        <TextField
          id='community-input' 
          label="Search Community"
          value={community}
          onChange={handleCommunityChange}
          fullWidth
          variant="outlined"
          className="community-search"
        />
      </div>
      <div className="list-container">
        <List id="list">
          <ListItem onClick={() => handleCommunitySelect("No community", "None")}>
            <ListItemText primary="No community" />
          </ListItem>
          {communityNames.map((item, index) => {
          const [id, name] = item.split(',');
          if (communityNames.length === index + 1) {
            return (
              <ListItem key={index} onClick={() => handleCommunitySelect(name, id)}>
                <ListItemText primary={name} />
              </ListItem>
            );
          } else {
            return (
              <ListItem key={index} onClick={() => handleCommunitySelect(name, id)}>
                <ListItemText primary={name} />
              </ListItem>
            );
          }
        })}       
        </List>
        {loading && <Box display="flex" justifyContent="center" my={2}><CircularProgress /></Box>}
      </div>
    </div>
  );
}

export default CommunityPage;