import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { child, database, get, ref } from '../services/firebase'

export function Home() {
	let navigate = useNavigate()

	const { user, signInWithGoogle } = useAuth()
	const [roomId, setRoomId] = useState('')

	async function handleCreateRoom() {
		if (!user) {
			await signInWithGoogle()
		}
		navigate('rooms/new')
	}

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault()

		if (roomId.trim() === '') {
			return
		}
		const roomRef = ref(database)

		const roomData = await get(child(roomRef, `rooms/${roomId}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					return snapshot.val()
				} else {
					alert('No data available')
				}
			})
			.catch((error) => {
				console.error(error)
			})
		if (roomData) {
			navigate(`/rooms/${roomId}`)
		}
	}

	return (
		<div id='page-auth'>
			<aside>
				<img src={illustrationImg} alt='Ilustração' />
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>Tire as dúvidas da sua audiência em tempo-real</p>
			</aside>
			<main>
				<div className='main-content'>
					<img src={logoImg} alt='LetMeAsk' />
					<button className='create-room' onClick={handleCreateRoom}>
						<img src={googleIconImg} alt='Google' />
						Crie sua sala com o Google
					</button>
					<div className='separator'>ou entre em uma sala</div>
					<form onSubmit={handleJoinRoom}>
						<input
							type='text'
							placeholder='Digite o código da sala'
							onChange={(event) => {
								setRoomId(event.target.value)
							}}
							value={roomId}
						/>
						<Button>Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	)
}
