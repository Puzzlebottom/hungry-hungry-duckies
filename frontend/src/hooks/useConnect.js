import axios from "axios";
import { useEffect, useState } from "react";
// import { useCookies } from 'react-cookie';

const useConnect = (setView) => {
  const [leaderboard, setLeaderBoard] = useState([]);
  const [player, setPlayer] = useState({ name: '', uuid: '' });
  // const [, setCookie] = useCookies();
  const localUUID = JSON.parse(localStorage.getItem('UUID'));
  const [UUID, setUUID] = useState(localUUID);

  useEffect(() => {

    const playerPromise = axios.get('http://localhost:8080', { withCredentials: true });
    const leaderboardPromise = axios.get('http://localhost:8080/api/players');

    Promise.all([playerPromise, leaderboardPromise])
      .then((res) => {
        const [player, leaderboard] = res;

        setPlayer(player.data);
        localStorage.setItem('UUID', JSON.stringify(player.data.uuid));
        console.log('player.data.uuid', JSON.parse(localStorage.getItem('UUID')));

        setLeaderBoard(leaderboard.data.players);

        setView('home');
      })
      .catch(err => console.log(err));

  }, []);

  return { leaderboard, setLeaderBoard, player, setPlayer };
};

export default useConnect;
