export const LOAD_STATUSES = {
    LOADING: 'loading',
    LOADED: 'loaded',
    SUCCESS: 'loaded',
    ERROR: 'error',
    IDLE: 'idle',
}

export const API_HOST = process.env.API_HOST || '';


export const getHeaders = (extra = {}) => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`,
    ...extra
})