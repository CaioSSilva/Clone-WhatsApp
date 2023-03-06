/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react'
import './newChat.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../api';
export default function newChat({user, chatlist, setShow, show}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [list, setlist] = useState([]);
// eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=> {
    const getList = async () => {
      if(user !== null) {
        let results = await api.getContactList(user.id)
        setlist(results)
      }
    }
    getList()
  }, [user])

  const addNewChat = async (user2) => {
    await api.addNewChat(user, user2)

    handleClose()
  }

  const handleClose = () =>{
    setShow (false);
  }
  return (
    <div className='newChat' style={{
      left: show ? 0:-415
    }}>
        <div className='newChat-head'>
            <div className='newChat-backbtn' onClick={handleClose}>
             <ArrowBackIcon style={{color:  'white'}}/>
            </div>
            <div className='newChat-headtitle'>
              Nova Conversa
            </div>
        </div>
        <div className='newChat-list'>
            {list.map((item,key) =>(
              <div onClick={()=>addNewChat(item)} className='newChat-item' key={key}>
                  <img className='newChat-itemavatar' src={item.avatar}/> 
                  <div className='newChat-itemname'>{item.name}</div>
              </div>
            ))}
        </div>
    </div>
  )
}
