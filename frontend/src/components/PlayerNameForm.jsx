import { useState } from 'react'

export default function PlayerNameForm (props) {
  const [playerName, setPlayerName] = useState('')
  const { handleSubmission } = props
  return (
    <form className='playername-form' onSubmit={
      (event) => {
        event.preventDefault()
      }
    }>
      <label htmlFor='name'>Name</label>
      <input type='text' id='name' name='name' value={playerName} onChange={(event) => setPlayerName(event.target.value)}
      placeholder='Enter player name' />
      <button type='submit'>Submit</button>
    </form>
  )
}
