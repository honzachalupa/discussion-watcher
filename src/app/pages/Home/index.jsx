import React, { Component } from 'react';
import Layout from 'Layouts/Main';
import Settings from 'Components/Settings';
import FacilitatorView from 'Components/FacilitatorView';
import AssistantView from 'Components/AssistantView';

export default class Page_Home extends Component {
    state = {
        page: {
            label: 'Discussion Watcher'
        }
    }

    render() {
        const { page } = this.state;

        return (
            <Layout page={page}>
                <h1>{page.label}</h1>

                <Settings />

                <div className="flex flex-horizontal flex-2">
                    <FacilitatorView />
                    <AssistantView />
                </div>
            </Layout>
        );
    }
}
