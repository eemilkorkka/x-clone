export const DIALOG_EVENTS = {
    OPEN_SIGNUP: 'open-signup-dialog',
    OPEN_SIGNIN: 'open-signin-dialog'
} as const;

export const openSignupDialog = () => {
    window.dispatchEvent(new CustomEvent(DIALOG_EVENTS.OPEN_SIGNUP));
};

export const openSigninDialog = () => {
    window.dispatchEvent(new CustomEvent(DIALOG_EVENTS.OPEN_SIGNIN));
}; 