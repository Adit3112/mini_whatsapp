let initial_msg=document.querySelector('.initial_msg');
let newchatBtn=document.querySelector('.newChatBtn');
let allChat=document.querySelectorAll('.allchat');

allChat.forEach(chat=>{if(chat===""){
        initial_msg.style.visibility="visible";

    }
    else{
        initial_msg.style.display="none";
    
}});
// newchatBtn.addEventListener('click',()=>{
//     initial_msg.style.display='none';
// });