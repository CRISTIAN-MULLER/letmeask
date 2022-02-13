import { useEffect, useState } from 'react'
import { database, onValue, ref } from '../services/firebase'
import { useAuth } from './useAuth'

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
    likes: Record<string, {
      authorId: string
    }>
  }
>

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighLighted: boolean
  likeCount: number
  likeId: string | undefined
}


export function useRoom ( roomId: string | undefined )
{
  const { user } = useAuth()
  const [ questions, setQuestions ] = useState<QuestionType[]>( [] )
  const [ title, setTitle ] = useState( '' )


  useEffect( () =>
  {
    const roomRef = ref( database, `rooms/${ roomId }` )

    async function getQuestions ()
    {
      try
      {
        const unsubscribe = await onValue( roomRef, ( snapshot ) =>
        {
          if ( snapshot.exists() )
          {
            const firebaseQuestion: FirebaseQuestion =
              snapshot.val().questions ?? {}

            const parsedQuestion = Object.entries(
              firebaseQuestion,
            ).map( ( [ key, value ] ) =>
            {
              return {
                id: key,
                author: {
                  name: value.author.name,
                  avatar: value.author.avatar,
                },
                content: value.content,
                isHighLighted: value.isHighLighted,
                isAnswered: value.isAnswered,
                likeCount: Object.values( value.likes ?? {} ).length,
                likeId: Object.entries( value.likes ?? {} ).find( ( [ key, like ] ) => like.authorId === user?.id )?.[ 0 ]
              }
            } )
            setTitle( snapshot.val().title )
            setQuestions( parsedQuestion )
          } else
          {
            alert( 'No data available' )
          }
        } )

        return () =>
        {
          unsubscribe()
        }
      } catch ( error )
      {
        console.error( error )
      }
    }
    getQuestions()

  }, [ roomId, user?.id ] )

  return { questions, title }

}