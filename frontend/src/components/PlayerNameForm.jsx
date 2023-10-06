import { useState } from 'react';

export default function PlayerNameForm({ player, join }) {
  const [name, setName] = useState(player.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    join({ name: name.trim(), uuid: player.uuid });
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='text' name='name' placeholder='Enter player name' defaultValue={name} onChange={handleChange} />
      <button onClick={handleSubmit}>Join Game</button>
    </form>
  );
}
