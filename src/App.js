import logo from './logo.svg';
import React from "react";
import axios from 'axios';
import Chatbot from "react-chatbot-kit";
import { createChatBotMessage } from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';
import './App.css';

const client = axios.create({
  baseURL:  process.env.REACT_APP_API_URL
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
  initialMessages: [createChatBotMessage("您请说")],
  customComponents: {
    // Replaces the default header
    header: () => <div class="react-chatbot-kit-chat-header">说出你的烦恼或随便说点儿什么. 回答可能不完整, 全看心情和钱包.</div>,
    botAvatar: () => <div class="react-chatbot-kit-chat-bot-avatar"><div class="react-chatbot-kit-chat-bot-avatar-container"><p class="react-chatbot-kit-chat-bot-avatar-letter">🙊</p></div></div>
  }
}



function App() {
  return (
    <div className="App">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        placeholderText="在这里输入您的消息(10个字以内)"
      />
    </div>
  );
}

export default App;
