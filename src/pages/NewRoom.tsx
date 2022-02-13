import { Link, useNavigate } from 'react-router-dom'

import { FormEvent, useState } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { database, get, push, ref, set } from '../services/firebase'

export function NewRoom() {
	const { user } = useAuth()

	let navigate = useNavigate()

	const [newRoom, setNewRoom] = useState('')

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault()

		if (newRoom.trim() === '') {
			return
		}

		const roomRef = ref(database, 'rooms')

		const firebaseRoom = push(roomRef)

		set(firebaseRoom, {
			title: newRoom,
			authorId: user?.id,
		})

		navigate(`/rooms/${firebaseRoom.key}`)
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
					<h2>Criar uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input
							onChange={(event) => {
								setNewRoom(event.target.value)
							}}
							type='text'
							placeholder='Nome da sala'
							value={newRoom}
						/>
						<Button type='submit'>Criar sala</Button>
					</form>
					<p>
						Quer entrar em uma sala existente?<Link to='/'>Clique aqui.</Link>
					</p>
				</div>
			</main>
		</div>
	)
}
