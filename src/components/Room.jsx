import { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/Peer";

import ReactPlayer from 'react-player'

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketid] = useState(null);
    const [myStream, setMyStream] = useState()
    const [remoteStream, setRemoteStream] = useState()


    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`email ${email} joined the room and id ${id}`);
        setRemoteSocketid(id)
    }, []);


    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        const offer = await peer.getOffer();
        socket.emit("user-call", { to: remoteSocketId, offer })
        setMyStream(stream)
        console.log(stream);

    }, [remoteSocketId, socket])


    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketid(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        setMyStream(stream)
        console.log(`incomming call from ${from} and offer`, offer);
        const ans = await peer.getAnswer(offer);
        socket.emit("call-accepted", { to: from, ans })
    }, [socket])

    const sendStream = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream])

    const handleCallAccepted = useCallback(({ from, ans }) => {
        peer.setLocalDescription(ans);
        console.log("call accepted!!!")
        console.log(peer)
        console.log(myStream, "mystream");
        sendStream();

    }, [myStream, sendStream])

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer-nego-needed", { offer, to: remoteSocketId });

    }, [remoteSocketId, socket])


    const handleNegoIncomming = useCallback(async ({ from, offer }) => {
        const ans = await peer.getAnswer(offer);
        socket.emit("peer-nego-done", { to: from, ans });

    }, [socket])

    const handleNegoFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, [])

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);

        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
        }

    }, [handleNegoNeeded])


    useEffect(() => {
        peer.peer.addEventListener('track', async (evt) => {
            const remoteStream = evt.streams
            console.log("GOT TRACKS!!!!");
            console.log(remoteStream);
            setRemoteStream(remoteStream[0]);
        })
    }, [])


    useEffect(() => {
        socket.on("user-Joined", handleUserJoined);
        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted);
        socket.on("peer-nego-needed", handleNegoIncomming);
        socket.on("peer-nego-final", handleNegoFinal);

        return () => {
            socket.off("user-Joined", handleUserJoined);
            socket.off("incoming-call", handleIncomingCall);
            socket.off("call-accepted", handleCallAccepted);
            socket.off("peer-nego-needed", handleNegoIncomming);
            socket.off("peer-nego-final", handleNegoFinal);
        }
    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted, handleNegoIncomming, handleNegoFinal])


    return (
        <div className="room-box">
            <h1>Room</h1>
            <h3>{remoteSocketId ? "Connected" : "No one in room"}</h3>
            <div className="room-btn-box">
                {myStream && <button onClick={sendStream}>send stream</button>}
                {
                    remoteSocketId && <button onClick={handleCallUser}>Call</button>
                }
            </div>
            {
                myStream &&
                <div>
                    <h4 className="room-heading">my stream</h4>
                    <ReactPlayer url={myStream} playing muted width="100px" height="100px" />
                </div>

            }
            {
                remoteStream &&
                <div>
                    <h4 className="room-heading">Remote streambe</h4>
                    <ReactPlayer url={remoteStream} playing playsinline muted width="200px" height="200px" />
                </div>

            }
        </div>
    )
}

export default Room;