import { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/Peer";

import ReactPlayer from 'react-player'

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketid] = useState(null);
    const [myStream, setMyStream] = useState()
    const [remoteStream, setRemoteStream] = useState()

    const [disConnMsg, setDisConnMsg] = useState();
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`email ${email} joined the room and id ${id}`);
        setRemoteSocketid(id)
    }, []);

    const handleUserDisconnected = useCallback(({ email, id }) => {
        console.log(`email ${email} disconnected, id: ${id}`);
        setRemoteSocketid(null);
        setRemoteStream(null);
        setDisConnMsg(email)
    }, [])

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



    // <-----HANDLE CAMERA PAUSE AND PLAY----->
    const toggleCamera = useCallback(() => {
        if (myStream) {
            const videoTrack = myStream.getTracks().find((track) => track.kind === "video")
            console.log(videoTrack, "videoTrack-----for pause resume!");

            videoTrack.enabled = !videoTrack.enabled
            setIsCameraOn(videoTrack.enabled);
        }
    }, [myStream])

    // <-----HANDLE MIC MUTE AND UNMUTE----->
    const toggleMic = useCallback(() => {
        if (myStream) {
            const audioTrack = myStream.getTracks().find((track) => track.kind === "audio")
            console.log(audioTrack, "audioTrack-----for pause resume!");

            audioTrack.enabled = !audioTrack.enabled
            setIsMicOn(audioTrack.enabled);
        }
    }, [myStream])





    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);

        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
        }

    }, [handleNegoNeeded])


    useEffect(() => {

        const handleTrack = (event) => {
            const remoteStream = event.streams[0];
            console.log("Received remote track:", remoteStream);
            setRemoteStream(remoteStream);
        };

        const peerConnection = peer.peer; // Assuming `peer.peer` is the RTCPeerConnection
        peerConnection.addEventListener('track', handleTrack);

        return () => {
            peerConnection.removeEventListener('track', handleTrack);
        };

    }, [])


    useEffect(() => {
        socket.on("user-Joined", handleUserJoined);
        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted);
        socket.on("peer-nego-needed", handleNegoIncomming);
        socket.on("peer-nego-final", handleNegoFinal);
        socket.on("user-disconnected", handleUserDisconnected);

        return () => {
            socket.off("user-Joined", handleUserJoined);
            socket.off("incoming-call", handleIncomingCall);
            socket.off("call-accepted", handleCallAccepted);
            socket.off("peer-nego-needed", handleNegoIncomming);
            socket.off("peer-nego-final", handleNegoFinal);
            socket.off("user-disconnected", handleUserDisconnected);
        }

    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted, handleNegoIncomming, handleNegoFinal, handleUserDisconnected])


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
                    <div className="room-btn-box">
                        <button onClick={toggleCamera}>{isCameraOn ? "Pause" : "Play"}</button>
                        <button onClick={toggleMic}>{isMicOn ? "Mute" : "Unmute"}</button>
                    </div>
                </div>
            }
            {
                remoteStream &&
                <div>
                    <h4 className="room-heading">Remote stream</h4>
                    <ReactPlayer url={remoteStream} playing width="200px" height="200px" />
                </div>

            }
            {
                disConnMsg && <p>{`user ${disConnMsg} disconnected!`}</p>
            }
        </div>
    )
}

export default Room;