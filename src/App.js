import logo from './logo.svg';
import React from "react";
import axios from 'axios';
import Chatbot from "react-chatbot-kit";
import { createChatBotMessage } from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';
import './App.css';


const client = axios.create({
  baseURL: "http://localhost:3301" 
});


// MessageParser starter code
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    this.actionProvider.handleHello(message);
    
    console.log(message)
  }
}

// ActionProvider starter code
class ActionProvider {
   constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
  }
  handleHello = (message) => {
    var botMessage = "";
    client
         .post('/chat', {
            "input":message
         })
         .then((response) => {
          console.log(response)
          if(response.status&&response.status==200){
            botMessage = botMessage = createChatBotMessage(response.data.chatbotResponse);
          }
          this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
          }));
         });
    //botMessage = createChatBotMessage('I\'m waiting for my API');
    
  };

}
// Config starter code

const config = {
  initialMessages: [createChatBotMessage(`Hello, try input something`)]
}

function App() {
  return (
    <div className="App">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
}

export default App;
