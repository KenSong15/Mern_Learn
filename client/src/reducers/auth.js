import {REGISTER_SUCCESS, REGISTER_FAIL} from "./../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true, //identicating if loaded
    user: null
};

export default function(state = initialState, action) {
    const {type, payload} = action; //to show there is item in action

    switch (type) {
        case REGISTER_SUCCESS:
            localStorage.setItem("token", payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            };
        case REGISTER_FAIL:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            };
        default:
            return state;
    }
}
