import React from 'react';
import './CommunityPage.css';
import '../App.css'
import { Telegram } from "@twa-dev/types";
import { Box, List, ListItem, ListItemText, Container, TextField } from '@mui/material';
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

function PostingPage() {
  const [communityNames, setCommunityNames] = React.useState<Array<string>>([]);
  const [community, setCommunity] = React.useState<string>('');
  const navigate = useNavigate();

  const SearchCommunity = React.useCallback(async (): Promise<void> => {
    const headers = {
        "accept": "application/json",
        "Content-Type": "application/json"
    };

    try {
        const response = await fetch(`https://imridd.eu.pythonanywhere.com/api/hive/communities?title=${community}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Errore durante l\'invio del messaggio');
        }
        const data = await response.json(); 
        const Communities = data.map((item: Community) => {
          return `${item.name},${item.title}`;
        });
        setCommunityNames(Communities);
    } catch (error) {
        window.Telegram.WebApp.showPopup({
            title: "Errore",
            message: "Si è verificato un errore durante l'invio del messaggio.",
            buttons: [{ type: 'ok' }]
        });
        console.error('Errore durante l\'invio del messaggio:', error);
    }
  }, [community]);

  React.useEffect(() => {
    window.Telegram.WebApp.BackButton.show();

    window.Telegram.WebApp.BackButton.onClick(() => {
      window.Telegram.WebApp.BackButton.hide();
      navigate('/Hive-TWA-Posting/post');
    });

    SearchCommunity();
    scrollList();
  }, [navigate, SearchCommunity]);

  const scrollList = () => {
    const listElement = document.getElementById('list');
    if (listElement) {
      listElement.scrollBy(0, 100); // Scorre di 100px
    }
  };

  const handleCommunityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommunity(event.target.value);
  };

  // const handleCommunitySelect = (selectedName: string) => {
  //   setCommunity(selectedName);
  // };

  const handleCommunitySelect = (selectedName: string, selectedId: string) => {
    if (selectedName === "No community") {
        selectedId = "None";
    }
    setCommunity(selectedName);
    localStorage.setItem('hive_selectedCommunityId', selectedId);
    localStorage.setItem('hive_selectedCommunityName', selectedName);
    window.Telegram.WebApp.BackButton.hide();
    navigate('/Hive-TWA-Posting/post');
  };

  return (
    <div className="container-community">
    <Container>
      <Box className="container-community" sx={{ padding: 2 }}>
        <TextField
          id = 'community-input' 
          label="Search Community"
          value={community}
          onChange={handleCommunityChange}
          fullWidth
          variant="outlined"
          className="community-search"
        />
        <Box id="list" sx={{ height: '400px', overflowY: 'scroll', marginTop: 2, width: '100%'}}>
            <List>
              <ListItem>
                <ListItemText primary="No community" />
              </ListItem>
              {communityNames.map((item, index) => {
                const [id, name] = item.split(',');
                return (
                  <ListItem key={index} onClick={() => handleCommunitySelect(name, id)}>
                    <ListItemText primary={name} />
                  </ListItem>
                );
              })}           
          </List>
        </Box>
      </Box>
    </Container>
    </div>
  );
}

export default PostingPage;
