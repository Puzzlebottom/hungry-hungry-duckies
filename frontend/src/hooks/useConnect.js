import axios from "axios";
import { useEffect, useState } from "react";

const useConnect = (setView) => {
  if (import.meta.env.VITE_APP_BACKEND_SERVER_BASE_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_SERVER_BASE_URL;
  }
  const [leaderboard, setLeaderBoard] = useState([]);
  const [player, setPlayer] = useState({ name: '', uuid: '' });

  useEffect(() => {
    const uuid = localStorage.getItem('uuid');
    const url = uuid ? `/players/${uuid}` : '/';
    const playerPromise = axios.get(url);
    const leaderboardPromise = axios.get('/api/players');

    Promise.all([playerPromise, leaderboardPromise])
      .then((res) => {
        const [player, leaderboard] = res;

        setPlayer(player.data);
        localStorage.setItem('uuid', player.data.uuid);
        setLeaderBoard(leaderboard.data.players);
        setView('home');
      })
      .catch(err => console.log(err));

  }, []);

  return { leaderboard, setLeaderBoard, player, setPlayer };
};

export default useConnect;
