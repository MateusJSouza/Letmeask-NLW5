import { useParams } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'

import { Button } from '../../components/Button';
import { Question } from '../../components/Questions';
import { RoomCode } from '../../components/RoomCode';
// import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';

import  '../Room/styles.scss';
import ReactModal from 'react-modal';
import { useState } from 'react';
import { database } from '../../services/firebase';

// Declarando quais são os parâmetros que RoomParams recebe
type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth()
  // <RoomParams> generic -> para a função saber quais parâmetros que essa rota vai receber
  const params = useParams<RoomParams>();
  // id da sala
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  // config do modal
  const [showModal, setShowModal] = useState(false);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined>Encerrar sala</Button>
          </div>
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

        {/* percorre cada item e retorna algo */}
        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => showModal}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
                <ReactModal
                  isOpen={showModal}
                  onRequestClose={() => setShowModal(false)}
                >
                  <p>Modal text!</p>
                  <button onClick={() => setShowModal(false)}>Close Modal</button>
                </ReactModal>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}