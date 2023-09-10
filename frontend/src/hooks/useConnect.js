import axios from "axios";
import { useEffect, useState } from "react";

const useConnect = (setView) => {
  const [leaderboard, setLeaderBoard] = useState([]);
  const [player, setPlayer] = useState({ name: '', uuid: '' });

  useEffect(() => {
    const baseUrl = 'http://localhost:8080/';
    const uuid = localStorage.getItem('uuid');
    const url = uuid ? `${baseUrl}players/${uuid}` : baseUrl;

    const playerPromise = axios.get(url);
    const leaderboardPromise = axios.get('http://localhost:8080/api/players');

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
