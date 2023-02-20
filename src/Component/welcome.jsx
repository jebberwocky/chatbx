// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';

const Welcome = () => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {}, []);

  return (
    <div class="react-chatbot-kit-chat-bot-message-container">
        <div class="react-chatbot-kit-chat-bot-avatar">
            <div class="react-chatbot-kit-chat-bot-avatar-container"><p class="react-chatbot-kit-chat-bot-avatar-letter">🙊</p></div></div><div class="react-chatbot-kit-chat-bot-message">
        <span>为保护您的私隐,请勿任何泄露个人信息. 🐵不会收集任何个人信息. 欢迎联系猴子: <a href="mailto:themonkey0220@gmail.com">themonkey0220@gmail.com</a>,請再三注意您私隐</span><div class="react-chatbot-kit-chat-bot-message-arrow"></div>
        </div></div>
  );
};

export default Welcome;