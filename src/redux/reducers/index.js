import AuthReducers from './AuthReducers'
import ModalReducers from './ModalReducers'
import DataReducers from './DataReducers'
import {combineReducers} from 'redux'

export default combineReducers({
    Auth:AuthReducers,
    Modal:ModalReducers,
    Data: DataReducers
})

// export default reducers

// import {combineReducers} from 'redux'
// import Authreducers from './Authreducers'
// import HeaderReducers from './Headerreducers'
// export default combineReducers({
//     Auth:Authreducers,
//     Header:HeaderReducers
// })