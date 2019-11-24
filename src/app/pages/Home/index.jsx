import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import Layout from 'Layouts/Main';
import Header from 'Components/Header';
import MembersList from 'Components/MembersList';

export default () => {
    const { clearPersistentState } = useContext(Context);

    return (
        <Layout>
            <button onClick={clearPersistentState} type="button">Resetovat data. (DEV ONLY)</button>

            <Header />

            <MembersList />
        </Layout>
    );
};
