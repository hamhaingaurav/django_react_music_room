import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
    Button,
    ButtonGroup,
    Grid,
    Typography,
    TextField,
} from '@material-ui/core'


export default class JoinRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            error: ""
        }
        this.handleValueChange = this.handleValueChange.bind(this)
        this.handleJoinRoom = this.handleJoinRoom.bind(this)

    }

    handleValueChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleJoinRoom() {
        console.log(this.state)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: this.state.roomCode
            })
        }

        fetch('/api/rooms/join/', requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.props.history.push(`/room/${this.state.roomCode}`)
                } else {
                    this.setState({
                        error: "Room not found"
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center' justify='center'>
                    <Typography variant='h4'>
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <TextField
                        error={this.state.error}
                        label='Code'
                        name='roomCode'
                        onChange={this.handleValueChange}
                        placeholder='Enter a Room Code'
                        defaultValue={this.state.roomCode}
                        helperText={this.state.error}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <ButtonGroup
                        disableElevation
                        variant='contained'
                        color='primary'
                    >
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={this.handleJoinRoom}
                        >Join Room</Button>
                        <Button
                            color='secondary'
                            variant='contained'
                            to='/'
                            component={Link}
                        >Back</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }
}
