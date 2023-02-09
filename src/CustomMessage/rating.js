import React,{ useState } from 'react';
import {BsHandThumbsUpFill} from "react-icons/bs";
import {BsHandThumbsUp}from "react-icons/bs";
import { Mixpanel } from '../Lib/Mixpanel';

const sendRating = (param,payload) =>{
  let r = Mixpanel.track("like",{"data":payload});
  //console.log(r)
}

const RatingMessage = (props) => {
  let payload = props.payload
  const [isRated, setRate] = useState(false);
  const handleRatingClick = (e,param,payload) => {
    setRate(!isRated)
    if(!isRated)
      sendRating(param,payload)
  }
  let thumbup
  if(isRated){
    thumbup = <BsHandThumbsUpFill/>;}
  else{
    thumbup = <BsHandThumbsUp />;}
  return (
    <div class="react-chatbot-kit-chat-bot-message-container">
      <div class="react-chatbot-kit-chat-bot-message rating-message" onClick={event =>handleRatingClick(event,"good",payload)}>
       说得好! {thumbup} 
      </div></div>
  );
};

export default RatingMessage;