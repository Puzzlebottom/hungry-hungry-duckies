import axios from "axios";
import { useEffect, useState } from "react";
// import { useCookies } from 'react-cookie';

const useConnect = (setView) => {
  const [leaderboard, setLeaderBoard] = useState([]);
  const [player, setPlayer] = useState({ name: '', uuid: '' });

  useEffect(() => {
    console.log(localStorage.getItem('uuid'))
    const baseUrl = 'http://localhost:8080/';
    const uuid = localStorage.getItem('uuid')
    const url = uuid ? baseUrl + uuid : baseUrl

    const playerPromise = axios.get(url);
    const leaderboardPromise = axios.get('http://localhost:8080/api/players');

    Promise.all([playerPromise, leaderboardPromise])
      .then((res) => {
        const [player, leaderboard] = res;

        console.log('player data', player.data)

        setPlayer(player.data);
        localStorage.setItem('uuid', player.data.uuid);
        console.log('player.data', player.data);
        console.log('player.data.uuid', localStorage.getItem('uuid'));

        setLeaderBoard(leaderboard.data.players);

        setView('home');
      })
      .catch(err => console.log(err));

  }, []);
  console.log('player after useEffect', player)

  return { leaderboard, setLeaderBoard, player, setPlayer };
};

export default useConnect;
