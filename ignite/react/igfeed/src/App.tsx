import { Header } from "./components/Header"
import './global.css'
import styles from './app.module.css';
import { Sidebar } from "./components/Sidebar";
import { Post, PostData } from "./components/Post";

const posts: PostData[] = [
  {
    id: 1,
    author: {
      avatar_url: "https://github.com/sonegobruno.png",
      name: "Bruno Sônego",
      role: "Web Developer"
    },
    content: [
      { 
        id: 1,
        type: "paragraph",
        content: "Fala galera"
      },
      { 
        id: 2,
        type: "paragraph",
        content: "Acabei de subir mais um projeto no meu portfólio"
      },
      { 
        id: 3,
        type: "link",
        content: "jane.design/doctorcare"
      }
    ],
    publishedAt: new Date('2022-05-03 20:00:00')
  },
  {
    id: 2,
    author: {
      avatar_url: "https://github.com/sonegobruno.png",
      name: "Bruno Sônego",
      role: "Web Developer"
    },
    content: [
      { 
        id: 4,
        type: "paragraph",
        content: "Fala galera"
      },
      { 
        id: 5,
        type: "paragraph",
        content: "Acabei de subir mais um projeto no meu portfólio"
      },
      { 
        id: 6,
        type: "link",
        content: "jane.design/doctorcare"
      }
    ],
    publishedAt: new Date('2022-05-04 20:00:00')
  },
]

function App() {

  return (
    <div>
      <Header />

      <div className={styles.wrapper}>
        <Sidebar />
        <main>
          {posts.map(post => (
            <Post key={post.id} data={post} />
          ))}
        </main>
      </div>
    </div>
  )
}

export default App
