import logo from './logo.svg';
import React from "react";
import Chatbot from "react-chatbot-kit";
import { createChatBotMessage } from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';
import './App.css';


// MessageParser starter code
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    this.actionProvider.handleHello();
    
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
  handleHello = () => {
    console.log()
    const botMessage = createChatBotMessage('I\'m empty mind');
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

}
// Config starter code

const config = {
  initialMessages: [createChatBotMessage(`I'm empty mind`)]
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
