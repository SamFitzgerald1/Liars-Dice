import { Login } from '../components/Login.jsx'
import '../styles/homePage/homePageStyles.css'
import logo from '../images/LIAR-S-DICE-12-19-2024.png'

export function Home({gameName, setGameName, setPage, playerName, setPlayerName}) {

  return (
    <div className='home'>
      <img className='logo'
        src={logo}
        alt="Liar's Dice Logo"
      />
      <Login gameName={gameName} setGameName={setGameName} setPage={setPage} playerName={playerName} setPlayerName={setPlayerName} />
    </div>
  )
}