// import { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';
import '../styles/button.scss'

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

// webpack (snowpack, vite, ...)

// Module Bundler -> 

export function NewRoom() {
  const { user } = useAuth();

  const [newRoom, setNewRoom] = useState('');
  const history = useHistory()

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    // trim -> removendo os espaços, tanto esquerda como direita
    if (newRoom.trim() === '') {
      return;
    }

    // referência para um registro de dados no banco de dados
    const roomRef = database.ref('rooms')

    // push -> jogando informação para dentro de rooms
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    // retorna o id 
    history.push(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
        <main>
          <div className="main-content">
            <img src={logoImg} alt="Letmeask" />
            <h2>Criar uma nova sala</h2>
            <form onSubmit={handleCreateRoom}>
              <input
                type="text"
                placeholder="Nome da sala"
                onChange={event => {
                  setNewRoom(event.target.value)
                }}
                value={newRoom}
              />
              <Button type="submit">
                Criar sala
              </Button>
            </form>
            <p>
              Quer entrar em uma sala existente?
              <Link to="/">Clique aqui!</Link>
            </p>
          </div>
        </main>
    </div>
  )
}