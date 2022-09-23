import { Avatar } from './Avatar';
import { Comment } from './Comment';
import styles from './Post.module.css';
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';

type Author = {
    avatar_url: string
    name: string
    role: string
}

type Content = {
    id: number
    type: 'link' | 'paragraph'
    content: string
}

export type PostData = {
    id: number
    author: Author
    publishedAt: Date
    content: Content[]
}

interface Props {
    data: PostData
}

export function Post({ data }: Props) {
    const [comments, setComments] = useState<string[]>([])
    const [newCommentText, setNewCommentText] = useState('')

    const pulishedDateFormatted = format(data.publishedAt, "d 'de' LLLL HH:mm'h'", {
        locale: ptBR
    })

    const publishedDateRelativeToNow = formatDistanceToNow(data.publishedAt, {
        locale: ptBR,
        addSuffix: true
    })

    function handleCreateNewComment(event: FormEvent) {
        event.preventDefault()

        setComments(prevState => [...prevState, newCommentText])

        setNewCommentText('')
    }

    function deleteComment(comment: string) {
        setComments(prevState => {
            const commentsSet = new Set(prevState)
            commentsSet.delete(comment)
            return [...commentsSet]
        })
    }

    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setNewCommentText(event.target.value)
        event.target.setCustomValidity('')
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Esse campo é obrigatório')
    }

    const commentIsEmpty = newCommentText.length === 0

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src="https://github.com/sonegobruno.png" alt="" />
                    <div className={styles.authorInfo}>
                        <strong>{data.author.name}</strong>
                        <span>{data.author.role}</span>
                    </div>
                </div>

                <time title={pulishedDateFormatted} dateTime={data.publishedAt.toISOString()}>Publicado {publishedDateRelativeToNow}</time>
            </header>

            <div className={styles.content}>
                {data.content.map(item => {
                    if(item.type === 'paragraph') {
                        return <p key={item.id}>{item.content}</p>
                    } else if(item.type === 'link') {
                        return <p key={item.id}><a href="#">{item.content}</a></p>
                    }
                })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>
                <textarea required onInvalid={handleNewCommentInvalid} value={newCommentText} onChange={handleNewCommentChange} placeholder='Deixe um comentário'></textarea>
                <footer>
                    <button disabled={commentIsEmpty}>Comentário</button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => (
                    <Comment comment={comment} key={comment} onDeleteComment={deleteComment} />
                ))}
            </div>

        </article>
    )
}