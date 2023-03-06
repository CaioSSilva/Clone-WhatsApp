import React, { useState, useEffect } from "react";
import "./App.css";
import ChatListItem from "./components/ChatListItem";
import Chatintro from "./components/Chatintro";
import ChatWindow from "./components/ChatWindow";
import NewChat from "./components/newChat";

import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import Login from "./components/Login";
import api from "./api";

export default function App() {
  const [showNewChat, setShowNewChat] = useState();
  const [chatlist, setChatlist] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  //Desativar Login com Facebook(null)
  const [user, setuser] = useState({
    id: "E77kt8N5JbXjHINNx3TQWm8iw9m1",
    name: "Caio Souza",
    avatar:
      "https://pbs.twimg.com/profile_images/1600164413453000705/D2QbXpoF_400x400.jpg",
  });

  /*
useEffect(()=> {
  if(user !== null){*/
  let unsub = -api.onChatLIst(user.id, setChatlist);
  /*    return unsub
  }
}, [user])*/

  const handleLoginData = async (u) => {
    let newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL,
    };
    await api.addUser(newUser);
    setuser(newUser);
  };

  if (user === null) {
    return <Login onReceive={handleLoginData} />;
  }

  const handleNewChat = () => {
    setShowNewChat(true);
  };

  return (
    <div className="app-window">
      <aside className="side-bar">
        <NewChat
          setShow={setShowNewChat}
          show={showNewChat}
          user={user}
          chatList={chatlist}
        />
        <header>
          <img src={user.avatar} className="header-avatar"></img>
          <div className="header-buttons">
            <div className="header-button">
              <DonutLargeIcon style={{ color: "#919191" }} />
            </div>
            <div onClick={handleNewChat} className="header-button">
              <ChatIcon style={{ color: "#919191" }} />
            </div>
            <div className="header-button">
              <MoreVertIcon style={{ color: "#919191" }} />
            </div>
          </div>
        </header>
        <div className="search">
          <div className="search-input">
            <SearchIcon fontsize="small" style={{ color: "#919191" }} />
            <input
              type="search"
              placeholder="Procurar ou começar uma nova conversa"
            ></input>
          </div>
        </div>

        <div className="chatlist">
          {chatlist.map((item, key) => (
            <ChatListItem
              key={key}
              data={item}
              active={activeChat.chatId === chatlist[key].chatId}
              onClick={() => setActiveChat(chatlist[key])}
            />
          ))}
        </div>
      </aside>
      <div className="contentarea">
        {activeChat.chatId !== undefined && (
          <ChatWindow user={user} data={activeChat} />
        )}
        <Chatintro />
      </div>
    </div>
  );
}
