import React, { Component } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';

export default class Settings extends Component {
    static contextType = Context;

    state = {
        membersString: this.context.members.join(';')
    }

    render() {
        return (
            <div>
                <textarea value={this.state.membersString} onChange={(e) => this.setState({ membersString: e.target.value })} />
                <button type="button" onClick={() => this.context.handleStartDiscussion(this.state.membersString.split(';'))}>Začít novou diskuzi</button>
                <button type="button" onClick={this.context.resetState}>Resetovat</button>
            </div>
        );
    }
}
