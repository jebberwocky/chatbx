import React,{ useState } from 'react'
import {createChatBotMessage, createCustomMessage} from "react-chatbot-kit";
import axios from "axios";
import {Mixpanel} from "../Lib/Mixpanel";
import {AnalyticLogger} from "../Lib/AnalyticLogger";
import {NativeAgent} from "../Lib/NativeAgent";

const client = axios.create({
    baseURL:  process.env.REACT_APP_API_URL
});

function isHTMLMessage(m){
    let r = /<[a-z/][\s\S]*>/i.test(m);
    return r;
}

function getDivinationPrompt(gua_text){
    return "你是一个只解释易经卦像的bot, 解释以下易经卦像:"+JSON.stringify(gua_text)+""
}

function postMessage(payload,gua,props){
    const atag = payload.atag
    let botMessage = "";
    const message = getDivinationPrompt(gua);
    Mixpanel.track("input",{"data":{message},atag});
    NativeAgent.setMessage({"data":{message},atag,"s":"input"})
    NativeAgent.toast("🐒收到, 请稍等")
    //always use v4 for 解卦
    client
        .post("/chat/v4", {
            "input":message,
            atag
        })
        .then((response) => {
            if(response.status&&response.status===200){
                if(!isHTMLMessage(response.data.chatbotResponse))
                    botMessage = createChatBotMessage(response.data.chatbotResponse);
                else
                    botMessage = createCustomMessage(response.data.chatbotResponse,'chathtml',{payload:{"m":response.data.chatbotResponse,}})
            }
            props.setState((prev) => ({
                ...prev,
                messages: [...prev.messages, botMessage,
                    createCustomMessage('test','rating',{payload: {"input":message,"response":response.data.chatbotResponse,atag},}),],
            }));
            Mixpanel.track("response",{"data":response.data.chatbotResponse,"rawdata":response.data,atag});
            AnalyticLogger.log({"input":{message},"response":response.data.chatbotResponse},atag);
            NativeAgent.setMessage({"data":response.data.chatbotResponse,atag,"s":"response"})
        })
        .catch((error)=> {
            console.log(error)
            AnalyticLogger.log({"input":{message},"response":"network error"},atag);
            Mixpanel.track("error",{"data":error,atag});
            var m = "🐒😴😴😴 等等试试";
            if(error.code === "ERR_NETWORK"){
                m = "网出错了😵 把代理或VPN关掉再试试.🐒🐒🐒在解决这个问题.";
            }
            if(m){
                props.setState((prev) => ({
                    ...prev,
                    //messages: [...prev.messages, createChatBotMessage(m),createCustomMessage('test','rating',{payload:{"input":message,"response":m}},),],
                    messages: [...prev.messages.slice(0,-1), createChatBotMessage(m),],
                }));
            }
        });
}

const Divination = (props) => {
    let payload = props.payload
    const [submitted, setSubmitted] = useState(true);
    return (
        <div class="react-chatbot-kit-chat-bot-message-container">
            <div class="react-chatbot-kit-chat-bot-message">
                <input type="button" 
                        class="react-chatbot-kit-chat-btn-send"
                        value="点此诚心求一卦"
                       disabled={!submitted}
                       onClick={(event) => {
                           console.log(props)
                           props.setState((prev) => ({
                               ...prev,
                               messages: [...prev.messages, createChatBotMessage("🐒收到, 请稍等"),]}));
                           event.preventDefault();
                           setSubmitted(false)
                           var get_url = "http://colbt.cc:8686/suangua";
                           axios
                               .get(get_url)
                               .then((response) => {
                                   //console.log(response)
                                   setSubmitted(true)
                                   if(response.data){
                                       postMessage(payload, response.data, props)
                                   }
                               })
                               .catch((error) => {
                                    setSubmitted(true)
                                    console.log(error)
                               });
                       }}
                />
            </div></div>
    );
};

export default Divination;