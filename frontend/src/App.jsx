import React, { useState, useEffect } from 'react';
import Home from './Home';
import Table from './Table';
import { socket } from './socket';
import PostGame from './PostGame';
import Loading from './Loading';
import { CookiesProvider, useCookies } from 'react-cookie';
import axios from 'axios';
import PlaySound from './components/PlaySound.jsx';

function App() {
  const [defaultName, setDefaultName] = useState('');
  const [cookies, setCookie] = useCookies(['name']);
  const [view, setView] = useState('home');

  //Emits player name form info to server
  const handleSubmission = (name) => {
    socket.emit('join', { 'name': name, 'cookie_uuid': cookies.cookie_uuid });
  };
  const handleViewChange = (view) => {
    setView(view);
  };
  const currentView = () => {
    switch (view) {
      case 'home':
        return <Home { ...{ handleSubmission, defaultName, handleViewChange } } />;
      case 'table':
        return <Table { ...{ handleViewChange } } />;
      case 'postGame':
        return <PostGame { ...{ handleViewChange } } />;
      case 'loading':
        return <Loading  { ...{ handleViewChange } } />;
      default:
        return <Home { ...{ handleSubmission, defaultName, handleViewChange } } />;
    }
  };

  useEffect(() => {
    socket.on('joinReply', (response) => setCookie('name', response.name, { path: '/' }));
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      socket.off('joinReply', (response) => setCookie('name', response.name, { path: '/' }));
      socket.off("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/', { withCredentials: true })
      .then((response) => {
        console.log('RESPONSE FROM AXIOS', response);
        const { name, cookie_uuid } = response.data;
        setCookie('cookie_uuid', cookie_uuid, { path: '/' });
        setCookie('name', name, { path: '/' });
        setDefaultName(name);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <div className="App">
       <PlaySound />
      {currentView()}
    </div>
  );
}

export default App;
