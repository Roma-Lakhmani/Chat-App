
const socket=io() //to connect to server
//Elements
const $messageForm=document.querySelector('#msg-form');
const $messageFormInput=document.querySelector('input');
const $messageFormButton =document.querySelector('#btn');
const $sendLocationBtn=document.querySelector('#send-location');
const $messages=document.querySelector('#messages');
//Templates
const messagesTemplate=document.querySelector('#message-template').innerHTML;

// socket.on('countUpdated',(count)=>{
//     console.log('The count has been updated!',count);
// })
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked!');
//     socket.emit('increment');
// })
socket.on('wlcummsg',(message)=>{
    console.log('Message',message);
    const html=Mustache.render(messagesTemplate);    
    $messages.insertAdjacentHTML('beforeend',html);
})
$messageForm.addEventListener('submit',(e)=>{
   $messageFormButton.setAttribute('disabled','disabled')
    e.preventDefault();
    let data=$messageFormInput.value;
    socket.emit('Sendmessage',data,(err)=>{
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value='';
    $messageFormInput.focus();
        if(err){
            return console.log('Profinity is not allowed');
        }
        console.log('Message Delivered');
    })
})
socket.on('msg',(data)=>{
    console.log(data);
})

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation)
        return  alert('Geolocation is not supported by  your browser')

    $sendLocationBtn.setAttribute('disabled','disabled');   

    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position,position.coords.latitude);
        socket.emit('sendLocation',{'latitude':position.coords.latitude,'longitude':position.coords.longitude},()=>{
            $sendLocationBtn.removeAttribute('disabled');
            console.log('Location Shared!');
        });
    })
})

socket.on('message',(data)=>{
    console.log(data);
    
})