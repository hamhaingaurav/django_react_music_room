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
    FormControlLabel,
    Collapse
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export default class CreateUpdateRoom extends Component {
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => { }
    }

    constructor(props) {
        super(props)
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            successMessage: '',
            errorMessage: ''
        }
        this.handleGuestCanPauseValueChange = this.handleGuestCanPauseValueChange.bind(this)
        this.handleVotesToSkipValueChange = this.handleVotesToSkipValueChange.bind(this)
        this.handleCreateRoom = this.handleCreateRoom.bind(this)
        this.handleUpdateRoom = this.handleUpdateRoom.bind(this)
        this.renderCreateButtonGroup = this.renderCreateButtonGroup.bind(this)
        this.renderUpdateButtonGroup = this.renderUpdateButtonGroup.bind(this)
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

        fetch('/api/room/create/', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.props.history.push(`/room/${data.code}`)
            })
    }

    handleUpdateRoom() {
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode
            })
        }
        fetch('/api/room/update/', requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.setState({
                        successMessage: 'Room Updated Successfully'
                    })
                } else {
                    this.setState({
                        errorMessage: 'Failed to update the room'
                    })
                }
                this.props.updateCallback()
            })
    }

    renderCreateButtonGroup() {
        return (
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
        )
    }

    renderUpdateButtonGroup() {
        return (
            <Grid item xs={12} align='center' justify='center'>
                <Button
                    color='primary'
                    variant='contained'
                    onClick={this.handleUpdateRoom}
                >Update</Button>
            </Grid>
        )
    }

    render() {
        const title = this.props.update
            ? 'Update Room'
            : 'Create a Room'
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <Collapse
                        in={this.state.successMessage || this.state.errorMessage}
                    >
                        {
                            this.state.successMessage
                                ? <Alert
                                    severity='success'
                                    onClose={() => {
                                        this.setState({ successMessage: '' })
                                    }}
                                >
                                    {this.state.successMessage}
                                </Alert>
                                : this.state.errorMessage
                                && <Alert
                                    severity='error'
                                    onClose={() => {
                                        this.setState({ errorMessage: '' })
                                    }}
                                >
                                    {this.state.errorMessage}
                                </Alert>
                        }

                    </Collapse>
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <Typography variant='h4'>
                        {title}
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
                            defaultValue={JSON.stringify(this.props.guestCanPause)}
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
                            defaultValue={this.state.votesToSkip}
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
                {
                    this.props.update
                        ? this.renderUpdateButtonGroup()
                        : this.renderCreateButtonGroup()
                }
            </Grid>
        )
    }
}
