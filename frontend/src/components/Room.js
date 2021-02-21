import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import {
    Button,
    ButtonGroup,
    Grid,
    Typography
} from '@material-ui/core'
import CreateUpdateRoom from './CreateUpdateRoom'


export default class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false
        }
        this.handleLeaveRoom = this.handleLeaveRoom.bind(this)
        this.updateShowSettings = this.updateShowSettings.bind(this)
        this.renderSettingsButton = this.renderSettingsButton.bind(this)
        this.renderSettings = this.renderSettings.bind(this)
        this.roomCode = this.props.match.params.roomCode
        this.getRoomDetails = this.getRoomDetails.bind(this)
        this.authenticatedSpotify = this.authenticatedSpotify.bind(this)
    }

    componentDidMount() {
        this.getRoomDetails()
    }

    authenticatedSpotify() {
        fetch('/spotify/is-authenticated')
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                this.setState({
                    spotifyAuthenticated: data.status
                })
                if (data.status) {
                    fetch('spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url)
                        })
                }
            })
    }

    getRoomDetails() {
        fetch(`/api/room/get?code=${this.roomCode}`)
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
                    if (data.is_host) {
                        this, this.authenticatedSpotify()
                    }
                }
            })
    }

    handleLeaveRoom() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/api/room/leave/', requestOptions)
            .then((response) => {
                if (response) {
                    this.props.nullRoomCode({ roomCode: null })
                    this.props.history.push('/')
                }
            })
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value
        })
    }

    renderSettingsButton() {
        return (
            <Button
                variant='contained'
                color='primary'
                onClick={() => this.updateShowSettings(true)}
            >Settings</Button>
        )
    }

    renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center' justify='center'>
                    <CreateUpdateRoom
                        update={true}
                        votesToSkip={this.state.votesToSkip}
                        guestCanPause={this.state.guestCanPause}
                        roomCode={this.roomCode}
                        updateCallback={this.getRoomDetails}
                    />
                </Grid>

                <Grid item xs={12} align='center' justify='center'>
                    <Button
                        color='secondary'
                        disableElevation
                        variant='contained'
                        onClick={() => { this.updateShowSettings(false) }}
                    >Close</Button>
                </Grid>
            </Grid>
        )
    }

    render() {
        if (this.state.showSettings) {
            return this.renderSettings()
        }
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
                    <ButtonGroup
                        disableElevation
                        variant='contained'
                        color='primary'
                    ><Button
                        color='secondary'
                        disableElevation
                        variant='contained'
                        onClick={this.handleLeaveRoom}
                    >Leave this Room</Button>
                        {
                            this.state.isHost
                            &&
                            this.renderSettingsButton()
                        }
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }
}
