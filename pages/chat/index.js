
export default function Chat() {

 const  goToHome = () => {
   window.history.back()
 }


  return(
    <div>
      <button onClick={goToHome}>Home </button>
      <h1> Bem vindo ao chat</h1>
    </div>
  )
}
