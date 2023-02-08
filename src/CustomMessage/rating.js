import React,{ useState } from 'react';
import {BsHandThumbsUpFill} from "react-icons/bs";
import {BsHandThumbsUp}from "react-icons/bs";

const sendRating = (param) =>{
  //console.log(param)
}

const RatingMessage = (props) => {
  const [isRated, setRate] = useState(false);
  const handleRatingClick = () => {
    setRate(!isRated)
    sendRating("good")
  }
  let thumbup
  if(isRated){
    thumbup = <BsHandThumbsUpFill/>;}
  else{
    thumbup = <BsHandThumbsUp />;}
  return (
    <div class="react-chatbot-kit-chat-bot-message-container">
      <div class="react-chatbot-kit-chat-bot-message rating-message" onClick={event =>handleRatingClick(event,"good")}>
       说得好! {thumbup} 
      </div></div>
  );
};

export default RatingMessage;