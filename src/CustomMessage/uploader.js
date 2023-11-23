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
function postMessage(atag,path,props){
    let botMessage = "";
    const message = "This GPT, named Diplomat Interpreter, specializes in interpreting and providing insights into diplomatic language, particularly in Chinese. It aims to help users understand the nuances and subtleties often present in diplomatic statements, offering clear explanations and cultural context. The GPT avoids making speculative or politically charged statements and maintains a neutral, informative tone. It focuses on linguistic analysis and cultural understanding, steering clear of personal opinions or sensitive political commentary. When answering questions, it employs a deep-breathing strategy and references cases and research from uploaded documents. it seeks clarification from users and network search to ensure accurate and relevant interpretations.";
    const image_url = "http://colbt.cc:3309" + path;
    client
        .post("/chat/vision", {
            "input":message,
            atag,
            "contents":[{
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": message
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url
                        }
                    }
                ]
            }]
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
        })
        .catch((error)=> {
            console.log(error)
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

const Uploader = (props) => {
    let payload = props.payload
    const [selectedImage, setSelectedImage] = useState(false);
    return (
        <div class="react-chatbot-kit-chat-bot-message-container">
            <div class="react-chatbot-kit-chat-bot-message">
                {selectedImage && (
                    <div>
                        <img
                            width={"250px"}
                            src={URL.createObjectURL(selectedImage)}
                        />
                        <br />
                    </div>
                )}
                <input type="file" accept="image/*"
                       onChange={(event) => {
                           console.log(event.target.files[0]);
                           setSelectedImage(event.target.files[0]);
                           console.log(props)
                           props.setState((prev) => ({
                               ...prev,
                               messages: [...prev.messages, createChatBotMessage("🐒收到, 请稍等"),]}));
                           event.preventDefault();
                           const image = event.target.files[0];
                           const formData = new FormData();
                           formData.append("image", image);
                           axios
                               .post("http://colbt.cc:3309/upload/upload", formData,{headers: {
                                    "Content-Type": "multipart/form-data",
                                },})
                               .then((response) => {
                                   console.log(response)
                                   if(response.data&&response.data.status === 's'){
                                       postMessage(payload.atag, response.data.path, props)
                                   }
                               })
                               .catch((error) => {
                                  console.log(error)
                               });
                       }}
                />
            </div></div>
    );
};

export default Uploader;