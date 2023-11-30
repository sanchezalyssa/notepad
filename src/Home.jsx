import { useEffect, useState } from "react"
import { dummyData } from "./data"
import { MdDelete } from "react-icons/md"
import "./toggle.css"

export default function Home() {
    const storage = JSON.parse(localStorage.getItem("infos")) || dummyData
    const [user, setUser] = useState(storage)

    const [postText, setPostText] = useState("")
    const [random, setRandomUser] = useState("")

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
                <MdDelete onClick={() => handleRemove(data.id)} className="delete-icon" />
            </div>
            <div className="user-post">
                <p>{data.post}</p>
            </div>
        </div>
    ))

    function handleRemove(id) {
        const deleteUser = user.filter((data) => data.id !== id)
        setUser(deleteUser)
    }

    const randomNum = Math.floor(Math.random() * 1000) + 2

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
    const [toggle, setToggle] = useState(false)
    function handleToggle() {
        setToggle((prevToggle) => !prevToggle)
    }
    const darkModeClass = toggle ? "dark" : ""
    return (
        <>
            <div className={`container ${darkModeClass}`}>
                <div className="switch">
                    <label className="ui-switch">
                        <input onClick={handleToggle} type="checkbox" />
                        <div className="slider">
                            <div className="circle"></div>
                        </div>
                    </label>
                </div>

                <div className="post-container">
                    <textarea value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="What's on your mind?"></textarea>
                    <button onClick={handleClick}>Post</button>
                </div>
                {dataEls}
            </div>
        </>
    )
}
