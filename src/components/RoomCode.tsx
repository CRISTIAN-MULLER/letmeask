import { type } from 'os'
import copyImg from '../assets/images/copy.svg'

import '../styles/roomcode.scss'

type RoomCodeProps = {
	code: string
}

export function RoomCode(props: RoomCodeProps) {
	function copyRoomCodeToClipboard() {
		navigator.clipboard.writeText(props.code)
	}

	return (
		<button className='room-code' onClick={copyRoomCodeToClipboard}>
			<div>
				<img src={copyImg} alt='Copiar Código da sala' />
			</div>
			<span>Sala #{props.code}</span>
		</button>
	)
}
