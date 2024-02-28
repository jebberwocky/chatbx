import React,{ useState } from 'react'
import {createChatBotMessage, createCustomMessage} from "react-chatbot-kit";
import axios from "axios";
import prompts from '../prompts.json';
import {Mixpanel} from "../Lib/Mixpanel";
import {AnalyticLogger} from "../Lib/AnalyticLogger";
import {NativeAgent} from "../Lib/NativeAgent";

const client = axios.create({
    baseURL:  process.env.REACT_APP_API_URL
});

const wildcardprefix = "wildcard:"
const variationprefix = "variation:"

function isHTMLMessage(m){
    let r = /<[a-z/][\s\S]*>/i.test(m);
    return r;
}

function getImagePrompt(vision_prompts, key){
    if(key.startsWith(wildcardprefix)){
        return key.split(wildcardprefix)[1]
    }else{
        return vision_prompts[key];
    }
}

function postMessage(payload,path,props){
    const atag = payload.atag
    let botMessage = "";

    const message = getImagePrompt(prompts.vision_prompt, payload.input);
    const image_url = "http://colbt.cc:3309" + path;
    Mixpanel.track("input",{"data":{message,image_url},atag});
    NativeAgent.setMessage({"data":{message,image_url},atag,"s":"input"})
    NativeAgent.toast("🐒收到, 请稍等")

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
            Mixpanel.track("response",{"data":response.data.chatbotResponse,"rawdata":response.data,atag});
            AnalyticLogger.log({"input":{message,image_url},"response":response.data.chatbotResponse},atag);
            NativeAgent.setMessage({"data":response.data.chatbotResponse,atag,"s":"response"})
        })
        .catch((error)=> {
            console.log(error)
            AnalyticLogger.log({"input":{message,image_url},"response":"network error"},atag);
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

const Uploader = (props) => {
    let payload = props.payload
    const [selectedImage, setSelectedImage] = useState(false);
    const [uploaded, setUploaded] = useState(true);
    return (
        <div class="react-chatbot-kit-chat-bot-message-container">
            <div class="react-chatbot-kit-chat-bot-message">
                {selectedImage && (
                    <div>
                        <img
                            alt=""
                            width={"250px"}
                            src={URL.createObjectURL(selectedImage)}
                        />
                        <br />
                    </div>
                )}
                <input type="file" accept="image/png, image/jpeg"
                       disabled={!uploaded}
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
                           setUploaded(false)
                           var post_url = "http://colbt.cc:3309/upload/upload";
                           if(props.payload.input.startsWith(variationprefix)) {
                               post_url = "http://colbt.cc:3309/upload/upload/png/forced"
                           }
                           axios
                               .post(post_url, formData,{headers: {
                                    "Content-Type": "multipart/form-data",
                                },})
                               .then((response) => {
                                   //console.log(response)
                                   setUploaded(true)
                                   if(response.data&&response.data.status === 's'){
                                       postMessage(payload, response.data.path, props)
                                   }
                               })
                               .catch((error) => {
                                   setUploaded(true)
                                   console.log(error)
                               });
                       }}
                />
            </div></div>
    );
};

export default Uploader;