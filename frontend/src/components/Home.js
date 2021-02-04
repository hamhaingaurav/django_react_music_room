import React, { Component } from 'react'

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
} from 'react-router-dom';

import {
    Button,
    ButtonGroup,
    Grid,
    Typography
} from '@material-ui/core'

import CreateRoom from './CreateRoom'
import JoinRoom from './JoinRoom'
import Room from './Room'


export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomCode: null,
        }
        this.setState = this.setState.bind(this)
    }

    async componentDidMount() {
        fetch('/api/rooms/check_user_in_room/')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roomCode: data.code
                })
            })
    }

    renderHome(props) {
        return (
            <Grid container spacing={3} >
                <Grid item xs={12} align='center' justify='center'>
                    <Typography variant='h3'>
                        Music Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' justify='center'>
                    <ButtonGroup
                        disableElevation
                        variant='contained'
                        color='primary'
                    >
                        <Button
                            color='primary'
                            to='/room/join'
                            component={Link}
                        >Join a Room</Button>
                        <Button
                            color='secondary'
                            to='/room/create'
                            component={Link}
                        >Create a Room</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        exact
                        path='/'
                        render={(props) => {
                            return (
                                this.state.roomCode
                                    ? <Redirect
                                        to={`/room/${this.state.roomCode}`}
                                    />
                                    : this.renderHome(props)
                            )
                        }}
                    />
                    <Route
                        exact
                        path='/room/join'
                        component={JoinRoom}
                    />
                    <Route
                        exact
                        path='/room/create'
                        component={CreateRoom}
                    />
                    <Route
                        exact
                        path='/room/:roomCode'
                        component={(props) =>
                            <Room
                                {...props}
                                nullRoomCode={this.setState}
                            />
                        }
                    />
                </Switch>
            </Router>
        )
    }
}
