
import React, { useState, useRef } from 'react'; // import 로 useState 를 불러온다!
import socketio from 'socket.io-client';

const socket = socketio.connect('http://localhost:3000');

const BaseSocket = ()=> {
    const chatWindow = useRef(null);
    const info = useRef(null);
    const chatInput = useRef(null);
    let drawChatMessage= (data)=>{
        let message = <span className="output__user__message">{data.message}</span>; 
        //React.createElement('span',{className:'output__user__message'},data.message);//document.createElement('span'); 
        let name = <span className="output__user__name">{data.name}</span>;
        //React.createElement('span',{className:'output__user__name'},data.name);//document.createElement('span'); 
    
        let wrap =  <p className="output__user" dataset={socket.id}>{name}{message}</p>;
        return wrap; 
    }

    let onSendMessage = e =>{
        var message = chatInput.current.value; 
        if(!message) return false; 
        socket.emit('sendMessage', { message }); 
        chatInput.current.value = ''; 
    }
    socket.on('connect', function(){ 
        console.log('connect'); 
        var name = prompt('대화명을 입력해주세요.', ''); 
        socket.emit('newUserConnect', name);
    });
    socket.on('updateMessage', function(data){
        if(info.current === null) return;
        if(data.name === 'SERVER'){ 
            info.current.innerHTML = data.message; setTimeout(() => { info.current.innerText = ''; }, 100000); 
        }else{
            var chatMessageEl = drawChatMessage(data);
            chatWindow.current.appendChild(chatMessageEl);
            chatWindow.current.scrollTop = chatWindow.current.scrollHeight;        
        }
    });


    return(
        <div className="app__wrap">
            <div id="info" className="app__info" ref={info}></div> 
            <div id="chatWindow" ref={chatWindow} className="app__window"></div>
            <div className="app__input__wrap"> 
                <input id="chatInput" type="text" className="app__input" ref={chatInput} placeholder="대화를 입력해주세요."/>
                    <button id="chatMessageSendBtn" className="app__button" onClick={onSendMessage}>전송</button>
            </div>
        </div>
    );
  };
  
  export default BaseSocket;