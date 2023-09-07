import { useState, useEffect } from 'react';

export default function PlayerNameForm({ player, join }) {
  const [name, setName] = useState(player.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    join({ name, uuid: player.uuid });
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <form className='playername-form' onSubmit={handleSubmit}>
      <label htmlFor='name'>Name</label>
      <input type='text' id='name' name='name' placeholder='Enter player name' defaultValue={name} onChange={handleChange} />
      <button type='submit'>Join Game</button>
    </form>
  );
}
