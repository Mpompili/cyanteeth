import React, { useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyD8j79WsqYHOltEVecHlJ3CG_KDyrcnmXw",
  authDomain: "cyanteeth-40529.firebaseapp.com",
  databaseURL: "https://cyanteeth-40529.firebaseio.com",
  projectId: "cyanteeth-40529",
  storageBucket: "cyanteeth-40529.appspot.com",
  messagingSenderId: "858825572069",
  appId: "1:858825572069:web:7b0a312bb48e8f0b475e0c",
  measurementId: "G-79W8GMM7LP"
});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      {/* <header className="App-header">
      </header> */}
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idFeild: 'id' });
  const [formValue, setFormValue] = useState('');
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');
  }
  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">Submit Messages</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  return (
    <div>
      {photoURL && <img src={photoURL} />}
      <p>{text}</p>
    </div>
  )
}

export default App;
