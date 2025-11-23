import InitiateSocialAuth from "./initiateSocialAuth";

export { default as extractErrorMessage} from "./extractErrorMessage";

export { default as persistAuth} from "./PersistAuth";

export const UseGoogle = () => InitiateSocialAuth("google-oauth2", "google");