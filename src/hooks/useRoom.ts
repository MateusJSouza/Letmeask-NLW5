import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

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
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          // some() -> percorre o array até encontrar uma condição que satisfaça o que passarmos pra ele
          // e encontrando, ele retorna true ou false, ou seja, só retorna se foi encontrado algo ou não
          // se o usuário não tiver dado o like naquela questão, isso não irá retornar nada
          // se não retornar nada, não terá como acessar a propriedade 0
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })
      
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })

    // remove todos os eventListener para essa referência de sala
    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id])

  return { questions, title }
}