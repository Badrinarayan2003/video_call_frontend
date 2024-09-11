import { useCallback, useState, useEffect } from "react";

import { useSocket } from '../context/SocketProvider'
import { useNavigate } from "react-router-dom";

const Home = () => {

    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        socket.emit("join-room", { email, room })

    }, [email, room, socket])

    const handleJoinRoom = useCallback((data) => {
        const { email, room } = data;
        console.log(`data from BE ${email} ${room}`)
        navigate(`/room/${room}`)
    }, [navigate])

    useEffect(() => {
        socket.on("join-room", handleJoinRoom)

        return () => {
            socket.off("join-room", handleJoinRoom)
        }

    }, [socket, handleJoinRoom])


    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Home</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">enter email</label>
                <input type="email" placeholder="enter email here" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label htmlFor="room">enter room code</label>
                <input type="text" placeholder="enter room code" id="room" value={room} onChange={(e) => setRoom(e.target.value)} />
                <br />
                <button>join</button>
            </form>
        </div>
    )
}

export default Home;