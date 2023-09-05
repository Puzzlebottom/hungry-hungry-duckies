import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';
import { socket } from '../../socket';
import Home from '../../Home';
import Table from '../../Table';
import PostGame from '../../PostGame';
import Loading from '../../Loading';


const useApplicationData = () => {

  //useStates
  const [leaderBoardPlayers, setLeaderBoardPlayers] = useState([]);
  const [defaultName, setDefaultName] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(['name']);
  const [view, setView] = useState('home');


  //functions
  const handleSubmission = (name) => {
    socket.emit('join', { 'name': name, 'cookie_uuid': cookies.cookie_uuid });
  };

  const handleViewChange = (view) => {
    setView(view);
  };


  //useEffects

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

  return {
    leaderBoardPlayers,
    setLeaderBoardPlayers,
    defaultName,
    setDefaultName,
    cookies,
    setCookie,
    removeCookie,
    view,
    setView,
    handleSubmission,
    handleViewChange
  };

}

export default useApplicationData;
