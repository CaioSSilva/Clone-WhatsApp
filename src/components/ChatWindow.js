import React, {useState, useEffect, useRef} from 'react'
import './ChatWindow.css'
import MessageItem from './Messageitem'
import EmojiPicker from 'emoji-picker-react';

import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import api from '../api';

export default function ChatWindow({user, data}) {

  let recognition = null;
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if(SpeechRecognition !== undefined){
    recognition =  new SpeechRecognition()
  }

  const[emojiopen, setemojiopen] = useState()
  const[text,settext] = useState('')
  const[list, setLists] = useState([])
  const[Listening, setListening] = useState()
  const[users, setUsers] = useState([])
  const body = useRef()

  useEffect(()=>{
    setLists([])
    let unsub = api.onChatContent(data.chatId, setLists, setUsers)
    return unsub
  },[data.chatId])
  
  useEffect(() =>{
    if(body.current.scrollHeight > body.current.offsetHeight){
      body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight
    }
  }, [list])
  const handleEmojiClick = (e, emojiObject) => {
    settext(text + emojiObject.emoji)
  };
  const handleOpenEmoji = () =>{
    setemojiopen(true);
  }
  const handleCloseEmoji = () =>{
    setemojiopen(false);
  }
  const handleSendClick = () =>{
    if(text !== ''){
      api.sendMessage(data, user.id, 'text', text, users);
      settext('');
      setemojiopen(false);
    }
  }
  const handleInputKeyUp = (e) =>{
    if(e.keyCode == 13){
      handleSendClick()
    }
  }
  const handleMicClick = () =>{
      if(recognition !== null){
        recognition.onstart = () =>{
          setListening(true);
        }
        
        recognition.onend = () =>{
          setListening(false);
        }

        recognition.onresult = (e) =>{
          settext(e.results[0][0].transcript)
        }
        recognition.start();
      }
  }
  return (
    <div className='chatWindow'>
      <div className='chatWindow-header'>
        <div className='chatWindow-headerinfo'>
            <img className='chatWindow-avatar' src={data.image}/>
            <div className='chatWindow-name'>{data.title}</div>
        </div>
        <div className='chatWindow-headerbuttons'>
            <div className='chatWindow-btn'>
              <SearchIcon style={{color: '#919191'}}/>
            </div>
            <div className='chatWindow-btn'>
              <AttachFileIcon style={{color: '#919191'}}/>
            </div>
            <div className='chatWindow-btn'>
              <MoreVertIcon style={{color: '#919191'}}/>
            </div>
        </div>
      </div>
      <div ref={body} className='chatWindow-body'>
        {list.map((item, key)=>(
          <MessageItem key={key} data={item} user={user} />
        ))}
      </div>
      <div className='chatWindow-emojiarea' style={{height: emojiopen ? '200px' : '0px'}}>
        <EmojiPicker
        disableSearchBar
        disableSkinTonePicker
        onEmojiClick={handleEmojiClick}/>
      </div>
      <div className='chatWindow-footer'>
          <div className='chatWindow-pre'>
              <div className='chatWindow-btn' onClick={handleCloseEmoji} style={{width: emojiopen ? '40px': '0px'}}>
                <CloseIcon style={{color: '#919191'}}/>
              </div>
              <div className='chatWindow-btn' onClick={handleOpenEmoji}>
                <InsertEmoticonIcon style={{color: emojiopen ? '#009688': '#919191'}}/>
              </div>
          </div>
          <div className='chatWindow-inputarea'>
            <input onKeyUp={handleInputKeyUp} type="text" className='chatWindow-input' placeholder='Digite uma mensagem' value={text} onChange={e=>settext(e.target.value)}/>
          </div>
          <div className='chatWindow-pos'>
                {text === '' &&
                    <div onClick={handleMicClick} className='chatWindow-btn'>
                    <MicIcon style={{color: Listening ? '#126EEC' : '#919191'}}/>
                    </div>
                }
                {text !== '' &&
                    <div onClick={handleSendClick} className='chatWindow-btn'>
                    <SendIcon style={{color: '#919191'}}/>
                    </div>
                }
          </div>
      </div>
    </div>
  )
}
