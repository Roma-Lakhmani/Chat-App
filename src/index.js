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
    socket.emit('wlcummsg',message);//to send msg t particular client
    socket.broadcast.emit('wlcummsg','A new user has joined');// to emit to all client except that particular client

    socket.on('Sendmessage',(data,callback)=>{
        const filter=new Filter();
        if(filter.isProfane(data)){
            return callback('Profanity is not allowed!')
        }
        // console.log('Received msg',data);
        io.emit('msg',data);
        callback()
    })
    socket.on('sendLocation',(data,callback)=>{
        io.emit('message',`https://google.com/maps?q=${data.latitude},${data.longitude}`)  
        callback();
    })

    socket.on('disconnect',()=>{
        io.emit('wlcummsg','A user has left!')
    })

})//if the server has 5 clients this function will execute 5 times.
server.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
    
})
