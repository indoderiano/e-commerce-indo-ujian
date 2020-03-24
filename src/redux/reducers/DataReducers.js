const INITIAL_STATE={
    totalItems: 0 
}


const reducer=(state=INITIAL_STATE,action)=>{
    switch(action.type){
        case 'ITEMS':
            return {...state, totalItems: action.payload}
        default:
            return state
    }
}

export default reducer