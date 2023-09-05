import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';
import { socket } from '../../socket';
import Home from '../../Home';
import Table from '../../Table';
import PostGame from '../../PostGame';
import Loading from '../../Loading';


  //useStates
  const ACTIONS = {
    SET_LEADERBOARD: 'SET_LEADERBOARD',
    SET_DEFAULTNAME: 'SET_DEFAULTNAME',
    SET_VIEW: 'SET_VIEW'
  };

  const { SET_LEADERBOARD, SET_DEFAULTNAME, SET_VIEW } = ACTIONS;


  const reducer = (state, action) => {
    switch (action.type) {

      case SET_LEADERBOARD:
        return { ...state, leaderBoardPlayers: action.payload };

      case SET_DEFAULTNAME:
        return { ...state, defaultName: action.payload };

      case SET_VIEW:
        return { ...state, view: action.payload };

      default:
        throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
    }
  };


const useApplicationData = () => {

  const initialState = {
    leaderBoardPlayers: [],
    defaultName: "",
    view: 'home'
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [cookies, setCookie, removeCookie] = useCookies(['name']);

  //Functions
  const handleSubmission = (name) => {
    socket.emit('join', { 'name': name, 'cookie_uuid': cookies.cookie_uuid });
  };

  const handleDefaultName = (name) => {
    dispatch({ type: ACTIONS.SET_DEFAULTNAME, payload: name });
  };

  const handleViewChange = (view) => {
    dispatch({ type: ACTIONS.SET_VIEW, payload: view });
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
        console.log('RESPONSE FROM AXIOS', response.data);
        const { name, cookie_uuid } = response.data;
        setCookie('cookie_uuid', cookie_uuid, { path: '/' });
        setCookie('name', name, { path: '/' });
        dispatch({ type: ACTIONS.SET_DEFAULTNAME, payload: name });
      })
      .catch((error) => {
        console.log(error);
      });

      axios.get('http://localhost:8080/api/players')
      .then((response) => {
        dispatch({ type: ACTIONS.SET_LEADERBOARD, payload: response.data.players });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return {
    state,
    handleSubmission,
    handleDefaultName,
    handleViewChange
  };

}

export default useApplicationData;

