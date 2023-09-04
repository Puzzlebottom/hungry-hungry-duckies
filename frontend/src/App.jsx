import React, { useState, useEffect } from 'react';
import Home from './Home';
import Table from './Table';
import { socket } from './socket';
import PostGame from './PostGame';
import Loading from './Loading';
import { CookiesProvider, useCookies } from 'react-cookie';
import axios from 'axios';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [munch, setMunch] = useState(false);
  const [ready, setReady] = useState(false);
  const [home, setHome] = useState(false);
  const [join, setJoin] = useState(false); //????????
  const [defaultName, setDefaultName] = useState('');
  const [cookies, setCookie] = useCookies(['name']);

  //Emits form info to server
  const handleSubmission = (name) => {
    console.log('HANDLE SUBMIT', name);
    console.log('COOKIE before', cookies);
    socket.emit('join', { 'name': name, 'cookie_uuid': cookies.cookie_uuid });
  };
  useEffect(() => {

    socket.on('joinReply', (response) => setCookie('name', response.name, { path: '/' }));
    socket.on('home', () => setHome(true));
    socket.on('munch', (event) => console.log(event)); // Get timestamp from event then setMunch(true)
    socket.on('ready', (data) => setReady(true));
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {

      socket.off('home', () => setHome(true));
      socket.off('joinReply', (response) => setCookie('name', response.name, { path: '/' }));
      socket.off('munch', (event) => console.log(event));
      socket.off('ready', (data) => setReady(true));
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/', { withCredentials: true })
    .then((response) => {
      console.log('RESPONSE FROM AXIOS', response);
      const { name, cookie_uuid } = response.data;
      setCookie('cookie_uuid', cookie_uuid, { path: '/' })
      setCookie('name', name, { path: '/' })
      setDefaultName(name);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <Home handleSubmission={handleSubmission} defaultName={defaultName}/>
  );
}

export default App;
