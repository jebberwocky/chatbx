// new file called DogPicture.jsx
import React, { useEffect } from 'react';

const Welcome = () => {
  //const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {}, []);

  return (
    <div class="react-chatbot-kit-chat-bot-message-container">
        <div class="react-chatbot-kit-chat-bot-avatar">
            <div class="react-chatbot-kit-chat-bot-avatar-container"><p class="react-chatbot-kit-chat-bot-avatar-letter">🙊</p></div></div><div class="react-chatbot-kit-chat-bot-message">
        <span>保护您的私隐,请勿任何泄露个人信息. 🐵不会收集任何个人信息. 欢迎联系:
            <a href="mailto:themonkey0220@gmail.com">themonkey0220@gmail.com</a></span>
        <div>
            <span>shortcut:</span>
            <ul><li>生成图片 showmethepic:生成一张X图</li>
                <li>图片识别 uploadpic:</li>
                <li>识别热量 kcalthis:</li>
            </ul>
        </div>
        <div class="react-chatbot-kit-chat-bot-message-arrow"></div>
        </div></div>
  );
};

export default Welcome;