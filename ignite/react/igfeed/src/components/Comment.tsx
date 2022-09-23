import { ThumbsUp, Trash } from 'phosphor-react'
import { useState } from 'react'
import { Avatar } from './Avatar'
import styles from './Comment.module.css'

interface Props {
    comment: string
    onDeleteComment: (comment: string) => void
}

export function Comment({ comment, onDeleteComment }: Props) {
    const [likeCount, setLikeCount] = useState(0)

    function handleDeleteComment() {
        onDeleteComment(comment)
    }

    function handleLikeCount() {
        setLikeCount(prevState => prevState + 1)
    }

    return (
        <div className={styles.comment}>
            <Avatar src="https://github.com/sonegobruno.png" alt="" hasBorder={false} />

            <div className={styles.commentBox}>
                <div className={styles.commentContent}>
                    <header>
                        <div className={styles.authorAndTime}>
                            <strong>Bruno Sônego</strong>
                            <time title="11 de Maio as 00:13hr" dateTime="2022-05-11 00:13:30">Cerca de 1hr atrás</time>
                        </div>

                        <button onClick={handleDeleteComment} title="Deletar comentário">
                            <Trash size={24}/>
                        </button>
                    </header>
                    <p>{comment}</p>
                </div>
                <footer>
                    <button onClick={handleLikeCount}><ThumbsUp /> Aplaudir <span>{likeCount}</span></button>
                    
                </footer>
            </div>
        </div>
    )
}