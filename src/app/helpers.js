import { useState, useEffect, useRef } from 'react';

const SEX_MALE = 'MALE';

export const useRefState = initialValue => {
    const [state, setState] = useState(initialValue);
    const stateRef = useRef(state);

    useEffect(
        () => { stateRef.current = state; },
        [state]
    );

    return [state, stateRef, setState];
};

export const getPersistentState = () => {
    return /^(\[|{).*(\]|})$/.test(localStorage.getItem('state')) ? JSON.parse(localStorage.getItem('state')) : {};
};

export const setPersistentState = state => {
    localStorage.setItem('state', JSON.stringify(state));
};

export const clearPersistentState = initialState => {
    localStorage.removeItem('state', JSON.stringify(initialState));

    window.location.reload();
};

export const formatTimeFromSeconds = s => {
    const minutes = Math.floor(s / 60);
    const seconds = Math.round(s % 60);

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export const getNewMemberId = members => {
    const existingIDs = members ? members.map(member => member.id) : [];
    const id = Math.round(Math.random() * 1000000);

    if (!existingIDs.includes(id)) {
        return id;
    } else {
        return getNewMemberId();
    }
};

export const getDefaultMember = () => {
    const id = getNewMemberId();

    return {
        id,
        name: `Člen ${id}`,
        sex: SEX_MALE
    };
};

export const sumObjectProperty = (object, property) => {
    let sum = 0;

    Object.keys(object).forEach(key => {
        sum += property ? object[key][property] : object[key];
    });

    return sum;
};
