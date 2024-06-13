"use client";

import { use, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Button from "./components/ui/button";
import Textarea from "./components/ui/textArea";
import MyMessage from "./components/ui/myMessage";
import NotMyMessage from "./components/ui/notMyMessage";
import Message from "./types/message";
import { on } from "events";

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessage] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [numberOfUsers, setNumberOfUsers] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [text, setText] = useState<string>("");

  const usernameRef = useRef<string>(username);
  const [texting, setTexting] = useState<boolean>(false);
  const [textingUserName, setTextingUserName] = useState<string>("");
  const onTyping = useRef<() => void>(() => {});
  const onFocus = useRef<() => void>(() => {});
  const onBlur = useRef<() => void>(() => {});


  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  

  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }

  const handleSendMessage = () => {
    if(!text) {
      alert("Please enter a message");
      return;
    }
    else if(!username) {
      alert("Please enter your name");
      return;
    }
    
    setMessage([...messages, {
      id: "1", 
      text: text, 
      username: username, 
      createdAt: new Date()
    }]);
    setText("");


    if (socket) {
      socket.emit('message', {
        id: "1", 
        text: text, 
        username: username, 
        createdAt: new Date()
      });
      setText("");
    } else {
      console.log("Socket is not connected");
    }
  };

  useEffect(() => {
    const socketIo = io("https://mini-chat-back-production.up.railway.app/");

    socketIo.on("connect", () => {
      console.log("Connected to server");

      // Запрашиваем текущие сообщения с сервера
      setTimeout(() => {
        socketIo.emit("get-message");
      }, 2000);
      
    });

    socketIo.on("init-message", (newMessages: Message[]) => {
      if (Array.isArray(newMessages)) {
        console.log("Init Received messages from server", newMessages);
        setMessage(newMessages);
      } else {
        console.error("Invalid messages format received from server", newMessages);
      }
    });

    socketIo.on("chat-message", (newMessages: Message[]) => {
      if (Array.isArray(newMessages)) {
        setMessage(newMessages);
      } else {
        console.error("Invalid messages format received from server", newMessages);
      }
    });

    socketIo.on("clients-total", (data) => {
      console.log(`Clients-total: ${data}`);
      setNumberOfUsers(data);
    });

    socketIo.on("feedback-check", (user:string) => {
      setTextingUserName(user);
    });

    onTyping.current = () => {
      socketIo.emit("feedback", usernameRef.current);
    };

    onFocus.current = () => {
      socketIo.emit("feedback", usernameRef.current);
    };

    onBlur.current = () => {
      socketIo.emit("feedback", "");
    };
    

    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    }
  }, [])



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
    <div className="flex flex-col h-[90vh] max-h-[90vh] bg-white dark:bg-gray-950 rounded-lg shadow-lg overflow-auto w-64">
      <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="font-medium">
        <input
          type="text"
          className="bg-gray-800 text-white border-none rounded p-4 flex-grow"
          placeholder="Enter your name...please..."
          value={username}
          onChange={(e) => handleInputChange(e)}
        />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" ref={chatContainerRef}>
        {messages.map((message, index) => {
          if (message.username === username) {
            return <MyMessage key={index} text={message.text} username={message.username} />
          }
          else {
            return <NotMyMessage key={index} text={message.text} username={message.username}/>
          }
        })}

        {textingUserName && <div className="text-sm text-gray-500 dark:text-gray-400">{textingUserName} is typing...</div>}

      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center">
        <Textarea text={text} setText={setText} 
          placeholder="Type your message..."
          className="flex-1 resize-none border-none focus:ring-0 dark:bg-gray-950 dark:text-gray-50"
          onTyping={onTyping.current}
          onBlur={onBlur.current}
          onFocus={onFocus.current}
        />
        <Button 
          variant="ghost" 
          size="icon"  
          className="ml-2"
          onClick={() => handleSendMessage()}
        >
            <SendIcon className="w-5 h-5" />
            <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>

    <div className="px-4 py-3">
        <p>Online users: {numberOfUsers}</p>
    </div>


    </main>
  );

  function SendIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    )
  }
}
