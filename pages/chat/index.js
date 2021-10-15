import {useEffect} from "react";

export default function Chat() {

 const  goToHome = () => {
   window.history.back()
 }

 useEffect(() => {
   window.location.href = 'https://chat-app-with-express.herokuapp.com/';
 }, [])

  return(
    <div>
      <button onClick={goToHome}>Home </button>
      <h1> Bem vindo ao chat</h1>
    </div>
  )
}
