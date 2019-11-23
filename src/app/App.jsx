/* globals __BASENAME__ */

import '@babel/polyfill';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { autobind } from 'core-decorators';
import { Context, app } from '@honzachalupa/helpers';
import config from 'app-config';
import './App.scss';
import Page_Home from 'Pages/Home';
import Page_NotFound from 'Pages/NotFound';

class App extends Component {
    timeInterval = null;

    jsonPattern = /^(\[|{).*(\]|})$/;

    defaultState = {
        members: [],
        times: {},
        time: 0
    };

    state = {
        ...this.getSavedState(),
        selectedMemberId: null,
        isTimeRunning: false,
        updateContextProperty: this.updateContextProperty,
        clearCache: this.clearCache,
        timePlay: this.timePlay,
        timePause: this.timePause,
        timeStop: this.timeStop,
        selectMember: this.selectMember
    }

    componentDidMount() {
        if (config.caching) {
            app.initServiceWorker();
        }

        window.addEventListener('beforeunload', e => {
            e.preventDefault();

            return this.saveState();
        });
    }

    componentDidUpdate(_, prevState) {
        if (prevState.selectedMemberId !== this.state.selectedMemberId) {
            if (this.state.selectedMemberId === null) {
                this.timePause();
            } else {
                this.changeMember(this.state.selectedMemberId);
            }
        }
    }

    getSavedState() {
        return new RegExp(this.jsonPattern).test(localStorage.getItem('state'))
            ? JSON.parse(localStorage.getItem('state'))
            : this.defaultState;
    }

    saveState() {
        localStorage.setItem('state', JSON.stringify(this.state));
    }

    @autobind
    timePlay() {
        this.setState(prevState => ({
            isTimeRunning: true,
            time: prevState.time + 1
        }));

        this.timeInterval = setInterval(() => {
            this.setState(prevState => ({
                time: prevState.time + 1
            }));
        }, 1000);
    }

    @autobind
    timePause() {
        this.setState({
            isTimeRunning: false,
            selectedMemberId: null
        });

        clearInterval(this.timeInterval);
    }

    @autobind
    timeStop() {
        this.timePause();

        this.setState({
            isTimeRunning: false,
            time: 0,
            selectedMemberId: null
        });
    }

    @autobind
    selectMember(id) {
        this.setState(prevState => ({
            selectedMemberId: prevState.selectedMemberId !== id ? id : null
        }));
    }

    changeMember(id) {
        if (!this.state.isTimeRunning) {
            this.timePlay();
        }

        console.log(id);
    }

    @autobind
    updateContextProperty(key, value) {
        this.setState({
            [key]: value
        });
    }

    @autobind
    clearCache() {
        this.setState(this.defaultState);

        localStorage.setItem('state', JSON.stringify(this.defaultState));
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                <Router basename={__BASENAME__}>
                    <Switch>
                        <Route component={Page_Home} path="/" exact />
                        <Route component={Page_NotFound} exact />
                    </Switch>
                </Router>
            </Context.Provider>
        );
    }
}

render(<App />, document.querySelector('#app'));
