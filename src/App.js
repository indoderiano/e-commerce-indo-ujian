import React, { useEffect } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import {Switch,Route} from 'react-router-dom'
import Axios from 'axios';
import { connect } from 'react-redux';
import Login from './pages/login'
import Home from './pages/home'
import Search from './pages/search'
import Header from './component/header'
import ProductDetails from './pages/productdetails'
import Cart from './pages/cart'
import Transactions from './pages/transactions'
import ManageProducts from './pages/manageproducts'
import ManageTransactions from './pages/managetransactions'
import Notif from './component/notif'
import { LoginSuccess } from './redux/actions'
import { API_URL } from './supports/ApiUrl';
import { useState } from 'react';



function App(props) {

  const [loading,setloading]=useState(true)

  useEffect(()=>{

    const id=localStorage.getItem('iduser')
    if(id){
      Axios.get(`${API_URL}/users/${id}`)
      .then((res)=>{
        props.LoginSuccess(res.data)
        // console.log(res.data)
      }).catch((err)=>{
        console.log(err)
      }).finally(()=>{
        setloading(false)
      })
    }else{
      setloading(false)
    }
    // console.log(props.Modal.isOpen)
    document.title='E-Commerce Indo'

  },[])

  // loading to wait until logging in with previous user id, is finished
  if(loading){
    return (
      <div>
        <Header/>
        {/* <Home/> */}
      </div>
    )
  }
  return (
    <div>
      <Header/>
      <div style={{paddingTop:'56px', position: 'relative'}}>
        <Switch>
          <Route path='/login' exact component={Login}/>
          <Route path='/' exact component={Home}/>
          <Route path='/search/:keyword' exact component={Search}/>
          <Route path='/search*' component={Search}/>
          <Route path='/productdetails/:productid' exact component={ProductDetails}/>
          <Route path='/cart' exact component={Cart}/>
          <Route path='/transactions' exact component={Transactions}/>
          <Route path='/manageproducts' exact component={ManageProducts}/>
          <Route path='/managetransactions' exact component={ManageTransactions}/>
        </Switch>
        {
          props.Modal.isOpen?
          <Notif></Notif>
          : null
        }
      </div>
    </div>
  );
}

const MapstatetoProps=(state)=>{
  return {
    Modal: state.Modal
  }
}

export default connect(MapstatetoProps,{LoginSuccess})(App);
