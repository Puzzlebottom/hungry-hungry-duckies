import { useState } from 'react'

export default function PlayerNameForm (props) {
  const [playerName, setPlayerName] = useState('')
  const { handleSubmission, defaultName, handleViewChange } = props
  return (
    <form className='playername-form' onSubmit={
      (event) => {
        event.preventDefault()
        console.log('event target', event.target.name.value)
        handleSubmission(event.target.name.value)
        handleViewChange('loading')
      }
    }>
      <label htmlFor='name'>Name</label>
      <input type='text' id='name' name='name' onChange={(event) => setPlayerName(event.target.value)}
      placeholder='Enter player name' defaultValue={defaultName} />
      <button type='submit'>Submit</button>
    </form>
  )
}
