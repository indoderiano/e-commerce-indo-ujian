const LOGIN_FAILED='LOGIN_FAILED'
const LOGIN_SUCCESS='LOGIN_SUCCESS'
const LOGOUT='LOGOUT'

const INITIAL_STATE={
    username:'',
    id:0,
    isLogin:false,
    role:'',
    errmes:'',
}

const reducer=(state=INITIAL_STATE,action)=>{
    switch(action.type){
        case LOGIN_FAILED:
            return {...state,errmes:action.payload}
        case LOGIN_SUCCESS:
            return {...state,...action.payload,isLogin:true,errmes:''}
        case LOGOUT:
            return INITIAL_STATE
        default:
            return state
    }
}

export default reducer