import React,{ useState } from 'react'
import {createChatBotMessage,createClientMessage,createCustomMessage} from "react-chatbot-kit";
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

const updateLastMessage = (props, message) => {
    props.setState((prev) => {
        return { ...prev, messages: [...prev.messages.slice(0, -1), { ...prev.messages.at(-1), message }]};
    });
};

async function postMessage(payload,gua,props){
    console.log(gua)
    let m_gua = "卦象: "+gua[0]+" "+gua[1]+ " "+gua[2]+ ", [卦辭]:"+gua[3][7]+" ", 
    m_guaci = gua[3][7]+""
    props.setState((prev) => ({
        ...prev,
        //messages: [...prev.messages, createChatBotMessage(m),createCustomMessage('test','rating',{payload:{"input":message,"response":m}},),],
        messages: [...prev.messages.slice(0,-1), createChatBotMessage(m_gua),],
    }));
    props.setState((prev) => ({
        ...prev,
        //messages: [...prev.messages, createChatBotMessage(m),createCustomMessage('test','rating',{payload:{"input":message,"response":m}},),],
        messages: [...prev.messages, createChatBotMessage("..."),],
    }));
    const atag = payload.atag
    let botMessage = "";
    const message = getDivinationPrompt(gua);
    Mixpanel.track("input",{"data":{message},atag});
    NativeAgent.setMessage({"data":{message},atag,"s":"input"})
    NativeAgent.toast("🐒收到, 请稍等")
    //always use v4 for 解卦
    const response = await fetch('http://colbt.cc:8661/beta/v4', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"input":message,
            atag})
        }).catch((error) => {
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
    let vs = [];
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
    while (true) {
        const {value, done} = await reader.read();
        if (done){
            //console.log(vs)
            Mixpanel.track("response",{"data":vs.join("")});
            //extra log to indicate jiegua
            Mixpanel.track("jiegua",{"data":vs.join(""),gua});
            AnalyticLogger.log({"input":message,"response":vs.join("")},atag);
            NativeAgent.setMessage({"data":vs.join(""),"s":"response"})
            break;
        }
        vs.push(value)
        updateLastMessage(props,vs.join(""))
    }
}

const Divination = (props) => {
    let payload = props.payload
    const [submitted, setSubmitted] = useState(true);
    return (
        <div class="react-chatbot-kit-chat-bot-message-container">
            <div class="react-chatbot-kit-chat-bot-message">
                <input type="button" 
                        class="react-chatbot-kit-chat-btn-send"
                        value="点此诚心求卦🙏"
                       disabled={!submitted}
                       onClick={(event) => {
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