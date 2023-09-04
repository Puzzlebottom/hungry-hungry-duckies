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
  const [cookies, setCookie] = useCookies(['name']);

  //Emits form info to server
  const handleSubmission = (name) => {
    console.log('HANDLE SUBMIT', name);
    console.log('COOKIE before', cookies);
    socket.emit('playerName', { 'name': name, 'cookie_uuid': cookies.cookie_uuid });
  };
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('serverReply', (data) => console.log(data));
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('home', () => setHome(true));
    socket.on('join', (data) => console.log(data)); // ????
    socket.on('munch', (event) => console.log(event)); // Get timestamp from event then setMunch(true)
    socket.on('ready', (data) => setReady(true));
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('serverReply', (data) => console.log(data));
      socket.off('disconnect', onDisconnect);
      socket.off('home', () => setHome(true));
      socket.off('join', (data) => console.log(data));
      socket.off('munch', (event) => console.log(event));
      socket.off('ready', (data) => setReady(true));
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/', { withCredentials: true })
    .then((response) => {
      setCookie('cookie_uuid', response.data, { path: '/' })
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <Home handleSubmission={handleSubmission} />
  );
}

export default App;
