

export default function PlayerNameForm () {
  return (
    <form>
      <label htmlFor='name'>Name</label>
      <input type='text' name='playerName' placeholder='Enter Player Name'/>
      <button type='submit'>Submit</button>
    </form>
  )
}
