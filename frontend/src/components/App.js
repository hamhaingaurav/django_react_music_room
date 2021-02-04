import React, { Component } from 'react'
import { render } from "react-dom";
import Home from './Home';


export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Home />
            </div>
        )
    }
}

render(<App />, document.getElementById('app'));