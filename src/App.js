import logo from './logo.svg';
import React from "react";
import axios from 'axios';
import Chatbot from "react-chatbot-kit";
import { createChatBotMessage,createCustomMessage } from "react-chatbot-kit";
import RatingMessage from './CustomMessage/rating';
import 'react-chatbot-kit/build/main.css';
import './App.css';


const chatconfig = {
  "wordlimit":25
}

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
    this.actionProvider.handleMessage(message);
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
  handleMessage = (message) => {
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
          messages: [...prev.messages, botMessage,createCustomMessage('test','rating',{payload: {},}),],
        }));
      })
      .catch((error)=> {
        console.log(error)
        var m = "🐒😴😴😴 等等试试";
        if(error.code = "ERR_NETWORK"){
          m = "网出错了😵";
        }
        if(m){
          this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, createChatBotMessage(m)],
            //messages: [...prev.messages, createChatBotMessage(m),],
          }));
        }
      });
  };

}
// Config starter code
//for UI debug
const bulkmessage = "诗人初到凉州，面对黄河、边城的辽阔景象，又耳听着《折杨柳》曲，有感而发，写成了这首表现戍守边疆的士兵思念家乡情怀的诗作。诗的前两句描绘了西北边地广漠壮阔的风光。首句抓住自下（游）向上（游）、由近及远眺望黄河的特殊感受，描绘出“黄河远上白云间”的动人画面：汹涌澎湃波浪滔滔的黄河竟像一条丝带迤逦飞上云端。写得真是神思飞跃，气象开阔。诗人的另一名句“黄河入海流”，其观察角度与此正好相反，是自上而下的目送；而李白的“黄河之水天上来”，虽也写观望上游，但视线运动却又由远及近，与此句不同。“黄河入海流”和“黄河之水天上来”，同是着意渲染黄河一泻千里的气派，表现的是动态美。而“黄河远上白云间”，方向与河的流向相反，意在突出其源远流长的闲远仪态，表现的是一种静态美。同时展示了边地广漠壮阔的风光，不愧为千古奇句。次句“一片孤城万仞山”出现了塞上孤城，这是此诗主要意象之一，属于“画卷”的主体部分。“黄河远上白云间”是它远大的背景，“万仞山”是它靠近的背景。在远川高山的反衬下，益见此城地势险要、处境孤危。“一片”是唐诗习用语词，往往与“孤”连文（如“孤帆一片”、“一片孤云”等等），这里相当于“一座”，而在词采上多一层“单薄”的意思。这样一座漠北孤城，当然不是居民点，而是戌边的堡垒，同时暗示读者诗中有征夫在。“孤城”作为古典诗歌语汇，具有特定涵义。它往往与离人愁绪联结在一起，如“夔府孤城落日斜，每依北斗望京华”（杜甫《秋兴》）、“遥知汉使萧关外，愁见孤城落日边”（王维《送韦评事》）等等。第二句“孤城”意象先行引入，为下两句进一步刻画征夫的心理作好了准备。“羌笛何须怨杨柳”，在这样苍凉 的环境背景下，忽然听到了羌笛声，所吹的曲调恰好又是《折杨柳》，这不禁勾起戍边士兵们的思乡之愁。因为“柳”和“留”谐音，所以古人常常在别离的时候折柳相赠表示留念。北朝乐府《鼓角横吹曲》中有《折杨柳枝》：“上马不捉鞭，反拗杨柳枝。蹀座吹长笛，愁杀行客儿。”就提到了行人临别时折柳。这种折柳送别风气在唐朝尤其盛行。士兵们听着哀怨的曲子，内心非常惆怅，诗人也不知道该如何安慰戍边的士兵，只能说，羌笛何必总是吹奏那首哀伤的《折杨柳》曲呢？春风本来就吹不到玉门关里的。既然没有春风又哪里有杨柳来折呢？这句话含有一股怨气，但是又含无可奈何语气，虽然乡愁难耐，但是戍守边防的责任更为重大啊。一个“何须怨”看似宽慰，但是，也曲折表达了那种抱怨，使整首诗的意韵变得更为深远。这里的春风也暗指皇帝，因为皇帝的关怀到达不了这里，所以，玉门关外士兵处境如此的孤危和恶劣。诗人委婉地表达了对皇帝不顾及戍守玉门关边塞士兵的生死，不能体恤边塞士兵的抱怨之情。本首诗调苍凉悲壮，虽写满抱怨但却并不消极颓废，表现了盛唐时期人们宽广豁达的胸襟。诗文中对比手法的运用使 诗意的表现更有张力。用语委婉精确，表达思想感情恰到好处"

var initialMessages = [createChatBotMessage("您请说")]
if(false)
  initialMessages.push(createChatBotMessage(bulkmessage))

const config = {
  initialMessages: initialMessages,
  customComponents: {
    // Replaces the default header
    header: () => <div class="react-chatbot-kit-chat-header">说出你的烦恼或随便说点儿什么. 回答可能不完整, 全看心情和钱包.</div>,
    botAvatar: () => <div class="react-chatbot-kit-chat-bot-avatar"><div class="react-chatbot-kit-chat-bot-avatar-container"><p class="react-chatbot-kit-chat-bot-avatar-letter">🙊</p></div></div>
  },
  placeholderText:"在这里输入您的消息("+chatconfig.wordlimit+"个字以内)",
  customMessages: {
    rating: (props) => <RatingMessage {...props} />,
  },
}



function App() {
  return (
    <div className="App">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        placeholderText={config.placeholderText}
      />
    </div>
  );
}

export default App;
