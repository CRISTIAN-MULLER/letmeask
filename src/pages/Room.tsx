import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import {
	child,
	database,
	get,
	onValue,
	push,
	ref,
	set,
} from '../services/firebase'

import '../styles/room.scss'

type FirebaseQuestion = Record<
	string,
	{
		author: {
			name: string
			avatar: string
		}
		content: string
		isAnswered: boolean
		isHighLighted: boolean
	}
>

type Question = {
	id: string
	author: {
		name: string
		avatar: string
	}
	content: string
	isAnswered: boolean
	isHighLighted: boolean
}

type RoomParams = {
	id: string
}

export function Room() {
	const params = useParams<RoomParams>()
	const [newQuestion, setNewQuestion] = useState('')
	const [questions, setQuestions] = useState<Question[]>([])
	const [title, setTitle] = useState('')

	const { user } = useAuth()
	const roomId = params.id

	useEffect(() => {
		const roomRef = ref(database, `rooms/${roomId}`)

		async function getQuestions() {
			try {
				await onValue(roomRef, (snapshot) => {
					if (snapshot.exists()) {
						const firebaseQuestion: FirebaseQuestion =
							snapshot.val().questions ?? {}

						const parsedQuestion: Question[] = Object.entries(
							firebaseQuestion,
						).map(([key, value]) => {
							return {
								id: key,
								author: {
									name: value.author.name,
									avatar: value.author.avatar,
								},
								content: value.content,
								isHighLighted: value.isHighLighted,
								isAnswered: value.isAnswered,
							}
						})

						setTitle(snapshot.val().title)
						setQuestions(parsedQuestion)
					} else {
						alert('No data available')
					}
				})
			} catch (error) {
				console.error(error)
			}
		}
		getQuestions()
	}, [roomId])

	async function handleSendQuestion(event: FormEvent) {
		event.preventDefault()

		if (newQuestion.trim() === '') {
			return
		}

		if (!user) {
			throw new Error('Deu ruim mano')
		}

		const question = {
			content: newQuestion,
			author: { name: user.name, avatar: user.avatar },
			isHighLighted: false,
			isAnswered: false,
		}

		const questionRef = ref(database, `rooms/${roomId}/questions`)

		const firebaseQuestion = push(questionRef)
		set(firebaseQuestion, question)
			.then(() => {
				alert('pergunta salva com sucesso')
				setNewQuestion('')
			})
			.catch((error) => {
				alert('erro ao salvar pergunta.')
			})
	}

	return (
		<div id='page-room'>
			<header>
				<div className='content'>
					<img src={logoImg} alt='LetmeAsk' />
					<RoomCode code={roomId || ''}></RoomCode>
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

				<form onSubmit={handleSendQuestion}>
					<textarea
						placeholder='O que você quer perguntar?'
						onChange={(event) => {
							setNewQuestion(event.target.value)
						}}
						value={newQuestion}
					/>
					<div className='form-footer'>
						{user ? (
							<div className='user-info'>
								<img src={user.avatar} alt={user.name} />
								<span>{user.name}</span>
							</div>
						) : (
							<span>
								Para enviar uma pergunta, <button>faça seu login</button>.
							</span>
						)}
						<Button type='submit' disabled={!user}>
							Enviar Pergunta
						</Button>
					</div>
				</form>
			</main>
		</div>
	)
}
