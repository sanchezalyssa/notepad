import { useEffect, useState } from "react"
import { dummyData } from "./data"
import { MdDelete } from "react-icons/md"
export default function Home() {
    const storage = JSON.parse(localStorage.getItem("infos")) || dummyData
    const [user, setUser] = useState(storage)

    const [postText, setPostText] = useState("")
    const [random, setRandomUser] = useState("")
    const randomNum = Math.floor(Math.random() * 1000) + 2
    useEffect(() => {
        localStorage.setItem("infos", JSON.stringify(user))
    }, [user])

    useEffect(() => {
        const getRandomInfo = async () => {
            try {
                const res = await fetch(`https://random-data-api.com/api/v2/users`)
                const data = await res.json()
                setRandomUser(data)
            } catch (error) {
                console.log(error)
            }
        }
        getRandomInfo()
    }, [])

    const dataEls = user.map((data) => (
        <div className="user-container" key={data.id}>
            <div className="user-info">
                <img className="avatar" src={data.img} alt={data.img} />
                <p className="fname">{data.firstName}</p>
                <MdDelete className="delete-icon" />
            </div>
            <div className="user-post">
                <p>{data.post}</p>
            </div>
        </div>
    ))

    function handleClick() {
        if (postText) {
            const newUser = {
                firstName: random ? random.first_name : "",
                img: random ? random.avatar : "",
                post: postText,
                id: randomNum,
            }
            setUser((prevUser) => [newUser, ...prevUser])
            setPostText("")
        }
    }

    return (
        <>
            <div className="container">
                <h3>Random Post Blog</h3>
                <div className="post-container">
                    <textarea value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="What's on your mind?"></textarea>
                    <button onClick={handleClick}>Post</button>
                </div>
                {dataEls}
            </div>
        </>
    )
}
