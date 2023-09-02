

export default function PlayerNameForm () {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='name'>Name</label>
      <input
        id='name'
        type='text'
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type='submit'>Submit</button>
    </form>
  )
}
