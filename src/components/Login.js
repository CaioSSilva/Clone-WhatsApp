
import React from 'react';
import Api from '../api';
import './Login.css'
export default function Login({onReceive}) {
    const handleFacebookLogin = async () =>{
        let result = await Api.fbPopup()
        if(result){
            onReceive(result.user)
        }else{
            alert('Erro!')
        }
    }
  return (
    <div className='login'>
        <button onClick={handleFacebookLogin}>Logar com Facebook</button>
        <a href="https://www.iubenda.com/privacy-policy/44143903" class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe " title="Política de Privacidade ">Política de Privacidade</a>
    </div>
  )
}
