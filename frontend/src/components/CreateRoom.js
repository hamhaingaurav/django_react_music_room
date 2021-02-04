import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
    Button,
    ButtonGroup,
    Grid,
    Typography,
    TextField,
    FormHelperText,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel
} from '@material-ui/core'


export default class CreateRoom extends Component {
    defaultVotes = 2

    constructor(props) {
        super(props)
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes
        }
        this.handleGuestCanPauseValueChange = this.handleGuestCanPauseValueChange.bind(this)
        this.handleVotesToSkipValueChange = this.handleVotesToSkipValueChange.bind(this)
        this.handleCreateRoom = this.handleCreateRoom.bind(this)
    }

    handleGuestCanPauseValueChange(e) {
        this.setState({
            [e.target.name]: e.target.value === 'true' ? true : false
        })
    }

    handleVotesToSkipValueChange(e) {
        this.setState({
            [e.target.name]: parseInt(e.target.value)
        })
    }

    handleCreateRoom() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        }

        fetch('/api/rooms/create/', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.props.history.push(`/room/${data.code}`)
            })
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center' justify='center'>
                    <Typography variant='h4'>
                        Create a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <FormControl component='fieldset'>
                        <FormHelperText>
                            <div align='center'>
                                Guest control of playback state
                            </div>
                        </FormHelperText>
                        <RadioGroup
                            row
                            defaultValue='true'
                            name='guestCanPause'
                            onChange={this.handleGuestCanPauseValueChange}
                        >
                            <FormControlLabel
                                value='true'
                                control={<Radio color='primary' />}
                                label='Play/Pause'
                                labelPlacement='bottom'
                            />
                            <FormControlLabel
                                value='false'
                                control={<Radio color='secondary ' />}
                                label='No Control'
                                labelPlacement='bottom'
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <FormControl>
                        <TextField
                            required={true}
                            type='number'
                            name='votesToSkip'
                            defaultValue={this.defaultVotes}
                            onChange={this.handleVotesToSkipValueChange}
                            inputProps={{
                                min: 1,
                                style: {
                                    textAlign: 'center'
                                }
                            }}
                        />
                        <FormHelperText>
                            <div align='center'>
                                Votes required to Skip song
                            </div>
                        </FormHelperText>
                    </FormControl>
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
                            onClick={this.handleCreateRoom}
                        >Create A Room</Button>
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
