// new file called DogPicture.jsx
import React, { useEffect } from 'react';

const Welcome = () => {
  //const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {}, []);

  return (
    <div class="react-chatbot-kit-chat-bot-message-container">
        <div class="react-chatbot-kit-chat-bot-avatar">
            <div class="react-chatbot-kit-chat-bot-avatar-container"><p class="react-chatbot-kit-chat-bot-avatar-letter">🙊</p></div></div><div class="react-chatbot-kit-chat-bot-message">
        <span>保护您的私隐,请勿任何泄露个人信息. 有任何问题, 欢迎联系:
            <a href="mailto:themonkey0220@gmail.com">themonkey0220@gmail.com</a></span>
        <div>
            <span>试试输入"算卦", 诚心求卦</span>
        </div>
        <div class="react-chatbot-kit-chat-bot-message-arrow"></div>
        </div></div>
  );
};

export default Welcome;