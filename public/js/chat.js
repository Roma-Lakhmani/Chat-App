
const socket=io() //to connect to server
//Elements
const $messageForm=document.querySelector('#msg-form');
const $messageFormInput=document.querySelector('input');
const $messageFormButton =document.querySelector('#btn');
const $sendLocationBtn=document.querySelector('#send-location');
const $messages=document.querySelector('#messages');
const $sidebar=document.querySelector('#sidebar');
//Templates
const messagesTemplate=document.querySelector('#message-template').innerHTML;
const locationTemplate=document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML;
const  autoscroll=()=>{
//New Message Element
    const $newmessage= $messages.lastElementChild;
// height of new message
const newMessageStyles=getComputedStyle($newmessage);
const newMessageMargin=parseInt(newMessageStyles.marginBottom);
const newMessageHeight=$newmessage.offsetHeight + newMessageMargin;
console.log(newMessageMargin);

//visible height
const visibleheight= $messages.offsetHeight;

//height of messages container
const containerHeight=$messages.scrollHeight;

//How far i have scrolled
const scrolloffset=$messages.scrollTop+visibleheight;

if(containerHeight-newMessageHeight<=scrolloffset){
    $messages.scrollTop=$messages.scrollHeight;
}
}

const {username,room}=Qs.parse(location.search,{ ignoreQueryPrefix : true})
// socket.on('countUpdated',(count)=>{
//     console.log('The count has been updated!',count);
// })
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked!');
//     socket.emit('increment');
// })
// socket.on('wlcummsg',(message)=>{
//     console.log('Message',message); 
//     const html=Mustache.render(messagesTemplate,{
//         message:message.text,
//         createdAt:moment(message.createdAt).format('h:mm a')
//     });    
//     $messages.insertAdjacentHTML('beforeend',html);
// })
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
    console.log('data' ,data);
    const html=Mustache.render(messagesTemplate,{
        username:data.username,
        message:data.text,
        createdAt:moment(data.createdAt).format('h:mm a')
    });    
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
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

socket.on('locationMessage',(message)=>{
    console.log(message);
    const html=Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    });    
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();

})
socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room:room,
        users:users
    })
    $sidebar.insertAdjacentHTML('beforeend',html)
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        location.href = '/'
        alert(error)
  }
})
