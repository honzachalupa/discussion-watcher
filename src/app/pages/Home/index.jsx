import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import { clearPersistentState } from 'Helpers';
import Layout from 'Layouts/Main';
import Header from 'Components/Header';
import MembersList from 'Components/MembersList';

export default () => {
    const { initialState } = useContext(Context);

    return (
        <Layout>
            <Header />
            <MembersList />

            <button
                style={{
                    backgroundColor: 'transparent',
                    fontSize: 12,
                    border: 'none',
                    padding: 5,
                    opacity: 0.5,
                    alignSelf: 'flex-start'
                }}
                onClick={() => clearPersistentState(initialState)}
                type="button"
            >
                Resetovat veškerá data.
            </button>
        </Layout>
    );
};
