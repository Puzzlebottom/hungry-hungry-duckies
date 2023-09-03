import React, { useState, useEffect } from 'react';
import Home from './Home';
import Table from './Table';
import { socket } from './socket';
import PostGame from './PostGame';
import Loading from './Loading';
import { CookiesProvider, useCookies } from 'react-cookie';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [munch, setMunch] = useState(false);
  const [ready, setReady] = useState(false);
  const [home, setHome] = useState(false);
  const [join, setJoin] = useState(false); //????????
  const [cookies, setCookie] = useCookies(['name']);


  const handleSubmission = (name) => {
    console.log('HANDLE SUBMIT', name);
    console.log('COOKIE', cookies.cookie_uuid)
    socket.emit('playerName', { 'name': name, 'cookie': cookies.cookie_uuid });
  };
  useEffect(() => {
    setCookie('cookie_uuid', 'f52d45a6-9d74-48d9-b30b-d487a40f7a77', { path: '/' }) //REMOVE AFTER TESTING
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

  return (
    <Home handleSubmission={handleSubmission} />
  );
}

export default App;
