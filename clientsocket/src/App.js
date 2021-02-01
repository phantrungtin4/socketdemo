import React, { useState, useEffect, useRef } from "react";
import './App.css';
import io, { Socket } from "socket.io-client"
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';


const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('/');

    socketRef.current.on("your id", id => {
      
      setYourID(id);
    })

    socketRef.current.on("message", (message) => {
      receivedMessage(message);
    })
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
    store.addNotification({
      title: "Tin mới",
      message: "Tin mới",
      type:"success",
      container:"top-right",
      insert:"top",
      animationIn:["animated","fadeIn"],
      animationOut:["animated","fadeOut"],
      dismiss:{
        duration: 2000,
      }
    })
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      body: message,
      id: yourID,
    };
    setMessage("");
    socketRef.current.emit("send message", messageObject);
    store.addNotification({
      title: "Đã gửi",
      message: "Đã gửi",
      type:"success",
      container:"top-right",
      insert:"top",
      animationIn:["animated","fadeIn"],
      animationOut:["animated","fadeOut"],
      dismiss:{
        duration: 2000,
      }
      
    })
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }


  return (
    <div className="Page">
      <div className="Container">
        {messages.map((message, index) => {
          if (message.id === yourID) {
            return (
              <div className="MyRow" key={index}>
                <div className="MyMessage">
                  {message.body}
                </div>
              </div>
            )
          }
          return (
            <div className="PartnerRow" key={index}>
              <div className="PartnerMessage">
                {message.body}
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={sendMessage}>
        <textarea value={message} onChange={handleChange} />
        <button>Send</button>
      </form>
      <ReactNotification/>
    </div>
  );
};


export default App;
