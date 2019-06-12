const path=require('path');
const http=require('http');
const express = require('express');
const socketio=require('socket.io');
const app = express();
const server=http.createServer(app)//if we don't do this express library will do it behind the scenes
const io=socketio(server)//that's why we created server explicitly
const port=process.env.port || 3000;
const publicdirectorypath=path.join(__dirname,'../public');
const Filter=require('bad-words')
const {generateMessage, generateLocationMessage }=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users');
app.use(express.static(publicdirectorypath));
// let count=0;
let message='Welcome!'
io.on('connection',(socket)=>{
    console.log('New web socket connection');
    // socket.emit('countUpdated',count);
    // socket.on('increment',()=>{
    //     count++;
    //     // socket.emit('countUpdated',count);//emit the event to single client
    //     io.emit('countUpdated',count) //emit the event to all the clients
    // })
    // socket.emit('msg',message);//to send msg to particular client
    // socket.emit('msg',generateMessage('Welcome'));
    // socket.broadcast.emit('msg',generateMessage('A new user has joined'));// to emit to all client except that particular client
    socket.on('join',(options,callback)=>{
        const {error,user}=addUser({id:socket.id, ...options});
        if(error){
            return callback(error);
        }
        socket.join(user.room)//to join individual rooms
        socket.emit('msg',generateMessage('Admin',`Welcome!`));
        socket.broadcast.to(user.room).emit('msg',generateMessage('Admin',`${user.username} has joined`));
        io.to(user.room).emit('roomData',({
            room:user.room,
            users:getUsersInRoom(user.room)
        }))
        // io.to.emit------it emit  events to everybody in specific room
        // socket.broadcast.to.emit------it emit event to everyone except for the specific client but it is limiting it to a specific chat room
        callback();
    })
    socket.on('Sendmessage',(data,callback)=>{
        const filter=new Filter();
            if(filter.isProfane(data)){
            return callback('Profanity is not allowed!')
        }
        const user=getUser(socket.id)
        // console.log('Received msg',data);
        // io.emit('msg',generateMessage(data));
        io.to(user.room).emit('msg',generateMessage(user.username,data));//to send mesg only to Gkp room
        callback()
    })
    socket.on('sendLocation',(data,callback)=>{
        const user=getUser(socket.id); 
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${data.latitude},${data.longitude}`))  
        callback();
    })
   
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id);
        if(user){
            io.to(user.room).emit('msg',generateMessage(`${user.username} has left`));
            io.to(user.room).emit('roomData',({
                room:user.room,
                users:getUsersInRoom(user.room)
            }))
        }
    })

})//if the server has 5 clients this function will execute 5 times.
server.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
    
})
