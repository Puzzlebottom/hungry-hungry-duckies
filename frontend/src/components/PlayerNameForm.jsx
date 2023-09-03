import { useState } from 'react'

export default function PlayerNameForm () {
  const [playerName, setPlayerName] = useState('')

  return (
    <form className='playername-form'>
      <label htmlFor='name'>Name</label>
      <input type='text' id='name' name='name' value={playerName} onChange={(event) => setPlayerName(event.target.value)}
      placeholder='Enter player name' />
      <button type='submit'>Submit</button>
    </form>
  )
}
