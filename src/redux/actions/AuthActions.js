export const LoginFail=(message)=>{
    return {
        type: 'LOGIN_FAILED',
        payload: message
    }
}

export const LoginSuccess=(datauser)=>{
    return {
        type: 'LOGIN_SUCCESS',
        payload:datauser
    }
}

export const LogOut=()=>{
    return {
        type: 'LOGOUT'
    }
}
