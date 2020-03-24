import React, { Component } from 'react'
import { Segment, Item, Button, Icon, TextArea, Divider, Header, Input, Label, Menu, Tab, Message } from 'semantic-ui-react'
import Axios from 'axios'
import { API_URL } from '../supports/ApiUrl'
import Numeral from 'numeral'
import { connect } from 'react-redux'
import {GiveNotif, RemoveNotif} from './../redux/actions'
import { Redirect, Link } from 'react-router-dom'

class Cart extends Component {
    state = { 
        transactions: []
     }

     componentDidMount(){
        // check user transaction
        // get all transaction of the user with status onprocess and completed
        Axios.get(`${API_URL}/transactions?userId=${this.props.User.id}&&status=onprocess&&status=completed`)
        .then((res)=>{
            // then from each transactionId's
            // console.log(res)
            // reverse transaction order so the latest added to data will be the first to show up
            res.data.reverse()
            var arr=[]
            res.data.forEach((val,index)=>{
                // do not use this arr[index]={}
                Axios.get(`${API_URL}/transactiondetails?_expand=product&&transactionId=${val.id}`)
                .then((resofeachbill)=>{
                    arr[index]=resofeachbill.data
                    // might want to include each bill data
                    arr[index]={
                        details: resofeachbill.data,
                        transactionId: val.id,
                        method: val.method,
                        status: val.status
                    }
                    // console.log(resofeachbill)
                    // [{[],a,b,c},[],[]]
                    this.setState({transactions: arr})
                }).catch((err)=>{
                    console.log(err)
                }).finally(()=>{
                    // arr.reverse()
                })
                // arr=arr.reverse()
                console.log(arr)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderItems=()=>{
        return this.state.transactions.map((bill,index)=>{
            return (
                <Segment key={index} className='cart-product'>
                    <Header className='color-dark' style={{fontSize: '21px'}} block>
                        Transaction {bill.transactionId}
                        <span style={{margin: '0 14px', color:'rgba(0,0,0,.7)', fontSize:'18px', fontWeight:'100'}}>{bill.method}</span>
                        <Label 
                            style={
                                {float: 'right', fontSize:'15px', margin:'auto'}
                            }
                            className={
                                bill.status==='completed'?
                                'color-sign'
                                :
                                'color-sign-sec'
                            } 
                            // icon='tag'
                        >
                            <Icon name='tag'/>
                            {bill.status}
                        </Label>
                    </Header>

                    {/* <span style={{flex:'0 0 60%'}}>
                    </span>
                    <div style={{flex:'0 0 10%'}}>
                        <p>Other</p>
                    </div>
                    <div style={{flex:'0 0 10%'}}>
                        <p>Status</p>
                    </div> */}
                    {/* <div style={{flex:'0 0 10%'}}>
                        <p>Action</p>
                    </div> */}
                            {
                                bill.details.map((item,index)=>{
                                    return (
                                        <div key={item.id} style={{
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            marginBottom: '14px', 
                                            borderBottom: '1px solid rgb(0,0,0,.15)',
                                            paddingBottom: '10px'}}>
                                        <div style={{flex: '0 0 60%'}}>
                                        <Item.Group divided>
                                            <Item style={{padding:'0 0px'}}>
                                            <Item.Image 
                                                // className='product-detail-img' 
                                                        style={{
                                                            width:'250px', 
                                                            height:'auto', 
                                                            margin:'0 0px 0 0',
                                                            padding: '10px',
                                                            border: '0px solid black',
                                                            overflow: 'hidden'
                                                        }} 
                                                        src={item.product.image}
                                                    />
                            
                                            <Item.Content>
                                                <Item.Header style={{color: 'rgba(0,0,0,.8)'}} as='a'>{item.product.name}</Item.Header>
                                                
                                                <Item.Description style={{color: 'rgba(0,0,0,.6)', marginBottom: '14px'}}>{item.product.deskripsi}</Item.Description>
                                                <Item.Extra style={{width: '70%'}}>
                                                
                                                    Items <span style={{color:'rgb(0,0,0,.87)', float: 'right'}}>({item.qty})</span>
                                                
                                                </Item.Extra>
                                                <Item.Extra style={{width: '70%'}}>
                                                    Harga Product <span style={{float: 'right'}} className='color-sign-sec'>Rp{Numeral(item.product.harga).format(0.0)}</span>
                                                </Item.Extra>
                        
                                            </Item.Content>
                                            </Item>

                                            {/* <Divider section/> */}
                                        </Item.Group>
                                        </div>
                                        <div style={{flex: '0 0 20%', alignItems:'center', margin: 'auto'}}>
                                            <Link to={`productdetails/${item.product.id}`}>
                                                <Button className='bg-sign bg-sign-hvr'>Buy Again</Button>
                                            </Link>
                                        </div>
                                        <div style={{flex: '0 0 20', alignItems:'center'}}>
                                            {/* <div>test</div> */}
                                        </div>
                                        <Divider section/>
                                        </div>
                                    )
                                })
                            }
                </Segment>
            )
                    
        })
    }

    render() { 
        if(this.props.User.role==='admin'){
            this.props.GiveNotif('Admin cannot purchase ;)')
            setTimeout(()=>{
                this.props.RemoveNotif()
            },2000)
            return <Redirect to='/manageproducts'/>
        }else{
            return ( 
                <div style={{padding:'50px 10vw 0 10vw'}}>
                    <Segment>
                        <h2 className='color-dark'>Your Transactions</h2>
                    </Segment>
                    
                    {/* <Segment className='cart-product' style={{display:'flex', justifyContent:'space-between'}}>
                        <span style={{flex:'0 0 60%'}}>
                             <span>Items</span>
                        </span>
                        <div style={{flex:'0 0 10%'}}>
                            <p>Other</p>
                        </div>
                        <div style={{flex:'0 0 10%'}}>
                            <p>Status</p>
                        </div>
                        <div style={{flex:'0 0 10%'}}>
                            <p>Action</p>
                        </div>
                    </Segment> */}

                    {this.renderItems()}
    

                </div>
            )
        }
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Modal: state.Modal
    }
}
 
export default connect(MapstatetoProps,{GiveNotif,RemoveNotif}) (Cart);