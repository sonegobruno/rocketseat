import './styles/main.css'
import LogoImg from './assets/logo-nlw-esports.svg'
import { GameBanner } from './components/GameBanner'
import { CreateAdBanner } from './components/CreateAdBanner'
import { useEffect, useState } from 'react'
import { Game } from './entities/game/game'
import { gameMapper } from './mapperts/game'
import * as Dialog from '@radix-ui/react-dialog'
import { CreateAdModal } from './components/CreateAdModal'
import axios from 'axios'

function App() {
  const [ games, setGames ] = useState<Game[]>([])

  useEffect(() => {
    axios.get('http://localhost:3333/games').then(response => {
      setGames(gameMapper(response.data))
    })
  },[])

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20 px-8">
      <img src={LogoImg} alt="Logo da Esports" />
      <h1 className="text-6xl text-white font-black mt-20">
        Seu <span className="text-transparent bg-nlw-gradient bg-clip-text">Duo</span> está aqui
      </h1>

      <div className="grid grid-cols-6 gap-6 mt-16">
        {games.map(game => (
          <GameBanner key={game.id} bannerUrl={game.bannerUrl} title={game.title} adsCount={game.adsCount}/>
        ))}
      </div>

      <Dialog.Root>
        <CreateAdBanner />
        <CreateAdModal games={games} />
      </Dialog.Root>
    </div>
  )
}

export default App
