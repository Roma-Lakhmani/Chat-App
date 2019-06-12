const users=[];

//addUser, removeUser , getUser ,getUsersInRoom

const addUser=({id,username,room})=>{
    //CLean the data
    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();

    //Validate the  data
    if(!username || !room){
        return{
            error:'Username and room are required!'
        }
    }

    //Check for existing user
    const existingUser =users.find((user)=>{
        return  user.room==room && user.username== username
    })

    //Validate username
    if(existingUser){
        return{
            error:'Username is in use'
        }
    }

    //Store user
    const user = {id,username,room}
    users.push(user)
    return { user }
}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!=-1){
        return users.splice(index,1)[0];//to get removed user
    }
}

//getUser
const getUser=(id)=>{
    return users.find((user)=>user.id===id);
}

//getUsersInRoom
const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase();
    return users.filter((user)=> user.room===room);    
}

// addUser({
//     id:1,
//     username:'Romaa',
//     room:'Gkp'
// })
// addUser({
//     id:2,
//     username:'Sapna',
//     room:'Lko'
// })
// addUser({
//     id:3,
//     username:'Ram',
//     room:'Bihar'
// })
// console.log(users);

// const user=getUser(1);
// console.log(user);
const user=getUsersInRoom('Bihar');
console.log(user);

// const removedUser =removeUser(1);
// console.log(removedUser);
// console.log(users);

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}