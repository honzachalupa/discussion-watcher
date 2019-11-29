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
    const seconds = s % 60;

    return s < 60 ? `${s} sekund` : `${minutes} minut ${seconds} sekund`;
};
