import axios from 'axios';

const {
    REACT_APP_SEARCH_SUGGESTION_SERVICE_PORT,
    REACT_APP_AUTHENTICATION_SERVICE_URL,
    REACT_APP_SEARCH_SUGGESTION_SERVICE_URL
} = process.env

export const authServiceAPI = axios.create({
    baseURL: REACT_APP_AUTHENTICATION_SERVICE_URL 
})

export const commonServiceAPI = axios.create({
    baseURL: `http://localhost:5000/commondata`
})

export const searchSuggestionServiceAPI = axios.create({
    baseURL: REACT_APP_SEARCH_SUGGESTION_SERVICE_URL || `http://localhost:${REACT_APP_SEARCH_SUGGESTION_SERVICE_PORT}`
})