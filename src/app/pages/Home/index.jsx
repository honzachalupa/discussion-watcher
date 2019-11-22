import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import config from 'app-config';
import Layout from 'Layouts/Main';
import MembersList from 'Components/MembersList';

export default () => {
    const { clearCache } = useContext(Context);

    return (
        <Layout>
            <h1>{config.name}</h1>

            <button onClick={clearCache} type="button">Resetovat všechna data</button>

            <MembersList />
        </Layout>
    );
};
