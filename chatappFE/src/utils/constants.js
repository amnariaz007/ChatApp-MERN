export const  HOST =  import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth"
export const SINGUP_ROUTE = `${AUTH_ROUTES}/register`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const USER_INFO = `${AUTH_ROUTES}/userInfo`
export const UPDATE_PROFILE = `${AUTH_ROUTES}/profileUpdate`
export const PROFILE_PICTURE = `${AUTH_ROUTES}/profilePicture`
export const DELETE_PROFILE = `${AUTH_ROUTES}/deleteProfile`
export const LOGOUT = `${AUTH_ROUTES}/logout`


export const CONTACT_ROUTES = "api/contact"
export const SEARCH_ROUTE = `${CONTACT_ROUTES}/searchContacts`


export const MESSAGE_ROUTES = "api/message"
export const GET_MESSAGE = `${MESSAGE_ROUTES}/getMessages`











