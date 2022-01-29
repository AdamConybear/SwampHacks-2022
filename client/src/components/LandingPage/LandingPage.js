import React, { useState } from 'react';
import TextField from './TextField';
import Button from './Button';
import {v4 as uuidV4 } from 'uuid'; // save reference to "v4" function from uuid library, but rename function to "uuidV4"
import io from 'socket.io-client'; // io library allows React frontend to talk to webserver
import Grid from '@mui/material/Grid';

function LandingPage()
{    
    // Eventually move below state variables to Redux.
    const [ username, set_username ] = useState("")
    const [ room_id, set_room_id ] = useState("")
    const [ user_in_room, set_user_in_room ] = useState(false)
    const socket = io('/') // tells socket to connect to root path of our application

    const create_room = () =>
    {
    const new_room_id = uuidV4()

    console.log("Trying to connect to server with username: \'"+username+"\'")
    socket.emit('join-room', new_room_id, username) // sends 'join-room' event to our server

    socket.on('user-connected', username => {
        console.log('Username connected: \''+username+'\' to room: \''+new_room_id+'\'.')
        set_user_in_room(true)
        set_room_id(new_room_id)
    })
    }

    const join_room = () =>
    {
    console.log("Trying to connect to server with username: " + username)
    socket.emit('join-room', room_id, username) // sends 'join-room' event to our server

    socket.on('user-connected', username => {
        console.log('Username connected: \''+username+'\' to room: \''+room_id+'\'.')
        set_user_in_room(true)
    })
    }

    // Below function is called to determine whether text fields should display text or be empty, as is case after user joins room and fields are disabled.
    const get_TextField_text = (text) =>
    {
    if(user_in_room)
    {
        return "";
    }
    else
    {
        return text
    }
    }

    return (
    <div>
        <Grid sx={{ flexGrow: 1 }} container spacing={5}>
        <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
            <TextField
            value={get_TextField_text(username)}
            set_value_function={set_username}
            id={"username-textfield"}
            label={"Username"}
            disabled={user_in_room}
            />
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
            THEN
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
            <Button
            event_trigger={create_room}
            variant={"contained"}
            text={"Create Room"}
            disabled={user_in_room}
            />
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
            OR
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
            <TextField
            value={get_TextField_text(room_id)}
            set_value_function={set_room_id}
            id={"roomID-textfield"}
            label={"Existing Room ID"}
            disabled={user_in_room}
            />
            <Button
            event_trigger={join_room}
            variant={"contained"}
            text={"Join Existing Room"}
            disabled={user_in_room}
            />
            </Grid>
        </Grid>
        </Grid>
    </div>
    );

}

export default LandingPage;
