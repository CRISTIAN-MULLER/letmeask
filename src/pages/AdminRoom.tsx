import { useNavigate, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'

import { useRoom } from '../hooks/useRoom'

import '../styles/room.scss'
import { database, ref, remove, update } from '../services/firebase'

type RoomParams = {
	id: string
}

export function AdminRoom() {
	const params = useParams<RoomParams>()
	//const { user } = useAuth()
	const roomId = params.id
	const { questions, title } = useRoom(roomId)

	let navigate = useNavigate()

	async function handleDeleteQuestion(questionId: string) {
		if (window.confirm('Tem certeza que deseja remover a pergunta?')) {
			const questionRef = ref(
				database,
				`rooms/${roomId}/questions/${questionId}`,
			)
			await remove(questionRef)
		}
	}

	async function handleEndRoom(roomId: string | undefined) {
		if (window.confirm('Tem certeza que deseja encerrar a sala?')) {
			const roomRef = ref(database, `rooms/${roomId}`)

			await update(roomRef, {
				endedAt: new Date(),
			})

			navigate('/')
		}
	}

	return (
		<div id='page-room'>
			<header>
				<div className='content'>
					<img src={logoImg} alt='LetmeAsk' />
					<div>
						<RoomCode code={roomId || ''}></RoomCode>
						<Button
							isOutlined
							onClick={() => {
								handleEndRoom(roomId)
							}}
						>
							Encerrar Sala
						</Button>
					</div>
				</div>
			</header>

			<main className='main-content'>
				<div className='room-title'>
					<h1>Sala: {title}</h1>
					{questions.length > 0 ? (
						questions.length > 1 ? (
							<span>{questions.length} Perguntas</span>
						) : (
							<span>{questions.length} Pergunta</span>
						)
					) : (
						<span>Sem Perguntas</span>
					)}
				</div>

				<div className='question-list'>
					{questions.map((question) => {
						return (
							<Question
								content={question.content}
								author={question.author}
								key={question.id}
							>
								<button
									type='button'
									onClick={() => {
										handleDeleteQuestion(question.id)
									}}
								>
									<img src={deleteImg} alt='Remover pergunta' />
								</button>
							</Question>
						)
					})}
				</div>
			</main>
		</div>
	)
}
