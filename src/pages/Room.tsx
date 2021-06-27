import { FormEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import  '../styles/room.scss';

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
}>

// Declarando quais são os parâmetros que RoomParams recebe
type RoomParams = {
  id: string;
}

type Question = {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
}

export function Room() {
  const { user } = useAuth()
  // <RoomParams> generic -> para a função saber quais parâmetros que essa rota vai receber
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')
  // id da sala
  const roomId = params.id

  // dispara um evento sempre que alguma informação mudar
  // se passar o array de dependências vazio, a função vai executar só 1 vez assim que o componente for exibido em tela
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    // val() buscando os valores dentro da room
    // on() toda vez que qualquer informação dentro da sala mudar, ele vai executar o código novamente e substituir as informações em tela
    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      // object entries -> retorna um array com chave e valor
      // exemplo: [ ["name", "Mateus"], ["idade", "21"] ]
      const parsedQuestions = Object.entries
      (firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered
        }
      })
      
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
  }, [roomId])

  async function handleSendQuestion(event: FormEvent) {
    // para não recarregar a tela
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      toast.error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighLighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {/* && -> como não tem else, utilizamos && */}
          { questions.length > 0 &&
            <span>{questions.length} pergunta(s)</span>
          }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            // pegando o valor do input conforme digitado
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {/* se tiver alguam informação dentro de user, mostra isso */}
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta,
                <button>
                  faça seu login
                </button>
              </span>
            )}
            <Button type="submit" disabled={!user} >
              Enviar pergunta
            </Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  );
}