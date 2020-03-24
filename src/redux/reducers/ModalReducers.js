const INITIAL_STATE={
    isOpen: false,
    message: ''
}


const reducer=(state=INITIAL_STATE,action)=>{
    switch(action.type){
        case 'NOTIF_ON':
            return {...state, isOpen: true, message: action.payload}
        case 'NOTIF_OFF':
            return {...state, isOpen: false, message: ''}
        default:
            return state
    }
}

export default reducer