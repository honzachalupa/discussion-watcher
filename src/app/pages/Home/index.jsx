import React from 'react';
import Layout from 'Layouts/Main';
import Header from 'Components/Header';
import MembersList from 'Components/MembersList';

export default () => {
    return (
        <Layout>
            <Header />
            <MembersList />
        </Layout>
    );
};
