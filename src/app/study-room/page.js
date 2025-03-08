"use client";
import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import styles from "./studyRoom.module.css"; // Import the CSS module

export default function StudyRoom() {
  const [roomId, setRoomId] = useState(""); 
  const [joinedRoom, setJoinedRoom] = useState(null); 
  const [roomCode, setRoomCode] = useState(""); 
  const [isCreator, setIsCreator] = useState(false); 
  const [participants, setParticipants] = useState(0); 
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    if (joinedRoom) {
      startVideo();
    }
  }, [joinedRoom]);

  const createRoom = async () => {
    const docRef = await addDoc(collection(db, "studyRooms"), {
      createdBy: auth.currentUser?.email,
      timestamp: new Date(),
      participants: 1, 
    });
    const uniqueCode = docRef.id;
    setRoomId(uniqueCode);
    setJoinedRoom(uniqueCode);
    setIsCreator(true);  
    setParticipants(1);  
    startVideo();
  };

  const joinRoom = async (code) => {
    const roomRef = doc(db, "studyRooms", code);
    const roomSnapshot = await getDoc(roomRef);
    
    if (roomSnapshot.exists()) {
      const roomData = roomSnapshot.data();
      if (roomData.participants < 8) {
        setParticipants(roomData.participants + 1);
        await updateDoc(roomRef, { participants: roomData.participants + 1 });
        setJoinedRoom(code);
        setRoomId(code);
        startVideo();
      } else {
        alert("Room is full! Please try another room.");
      }
    } else {
      alert("Room not found.");
    }
  };

  const deleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await deleteDoc(doc(db, "studyRooms", roomId));
      setRoomId("");
      setJoinedRoom(null);
      setIsCreator(false);
      stopVideo();
    }
  };

  const leaveRoom = async () => {
    if (joinedRoom) {
      const roomRef = doc(db, "studyRooms", roomId);
      const roomSnapshot = await getDoc(roomRef);
      const roomData = roomSnapshot.data();
      setParticipants(roomData.participants - 1);
      await updateDoc(roomRef, { participants: roomData.participants - 1 });

      setJoinedRoom(null);
      setRoomId("");
      setIsCreator(false);
      stopVideo();
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection();
      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };
    } catch (error) {
      console.error("Error starting video:", error);
    }
  };

  const stopVideo = () => {
    if (localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className={styles["study-room-container"]}>
      <h1 className={styles.title}>📚 Study Room</h1>

      {joinedRoom ? (
        <div className={styles["room-info"]}>
          <h2 className={styles["room-code"]}>Room Code: {roomId}</h2>
          <div className={styles["video-container"]}>
            <video ref={localVideoRef} autoPlay playsInline className={styles["local-video"]} />
            <video ref={remoteVideoRef} autoPlay playsInline className={styles["remote-video"]} />
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={leaveRoom} className={styles["leave-button"]}>Leave Room</button>
            {isCreator && (
              <button onClick={deleteRoom} className={styles["delete-button"]}>Delete Room</button>
            )}
          </div>
        </div>
      ) : (
        <div className={styles["join-room"]}>
          <button onClick={createRoom} className={styles["create-button"]}>Create Study Room</button>
          <h2 className={styles["join-text"]}>Join Room by Code:</h2>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            className={styles["input-field"]}
          />
          <button onClick={() => joinRoom(roomCode)} className={styles["join-button"]}>Join Room</button>
        </div>
      )}
    </div>
  );
}
