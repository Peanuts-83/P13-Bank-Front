import piggy from '../assets/broken-piggy.png'

const Error404 = () => {
  return (
    <div className='main'>
      <div className='error-text'>
        Oh no! This page seems not to exist...
      </div>
      <img className='error-image' src={piggy} alt='error' />
    </div>
  )
}

export default Error404