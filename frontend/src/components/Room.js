import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import {
    Button,
    ButtonGroup,
    Grid,
    Typography
} from '@material-ui/core'


export default class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false
        }
        this.handleLeaveRoom = this.handleLeaveRoom.bind(this)
        this.roomCode = this.props.match.params.roomCode
        this.getRoomDetails()
    }

    getRoomDetails() {
        fetch(`/api/rooms/get?code=${this.roomCode}`)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    this.props.nullRoomCode({ roomCode: null })
                    this.props.history.push('/')
                }
            })
            .then((data) => {
                if (data) {
                    this.setState({
                        votesToSkip: data.votes_to_skip,
                        guestCanPause: data.guest_can_pause,
                        isHost: data.is_host,
                    })
                }
            })
    }

    handleLeaveRoom() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/api/rooms/leave/', requestOptions)
            .then((response) => {
                if (response) {
                    this.props.nullRoomCode({ roomCode: null })
                    this.props.history.push('/')
                }
            })
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center' justify='center'>
                    <Typography variant='h4'>
                        Code: {JSON.stringify(this.roomCode)}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <Typography variant='h6'>
                        Votes: {JSON.stringify(this.state.votesToSkip)}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <Typography variant='h6'>
                        Guest Can Pause: {JSON.stringify(this.state.guestCanPause)}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <Typography variant='h6'>
                        Host: {JSON.stringify(this.state.isHost)}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <Button
                        color='secondary'
                        disableElevation
                        variant='contained'
                        onClick={this.handleLeaveRoom}
                    >Leave this Room</Button>
                </Grid>
            </Grid>
        )
    }
}
