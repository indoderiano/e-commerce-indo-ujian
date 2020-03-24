import React, { Component } from 'react'
import { Segment, Item, Button, Icon, TextArea, Divider, Header, Input, Label, Menu, Tab, Message } from 'semantic-ui-react'
import Axios from 'axios'
import { API_URL } from '../supports/ApiUrl'
import Numeral from 'numeral'
import { connect } from 'react-redux'
import {GiveNotif, RemoveNotif, UpdateItems} from './../redux/actions'
import { Redirect, Link } from 'react-router-dom'

class Cart extends Component {
    state = { 
        cartProduct:[],
        transactionId: '',
        method: '',
        vouchers:[],
        deleteindex: -1,
        editmsgindex: -1,
        editmsg: '',
        checkDetails:{
            item: 0,
            harga: 0
        },
        checkout: false,
        inputVoucher: '',
        errvoucher: false,
        complete: false
     }

     componentDidMount(){
        // check user transaction
        // find data with status "on cart"
        Axios.get(`${API_URL}/transactions?userId=${this.props.User.id}&&status=oncart`)
        .then((res)=>{
            // then use transactionId to track items on the cart
            // res.data[0].id is transactionId
            // store the transactionId
            this.setState({transactionId: res.data[0].id})
            // then get items
            var items=0
            Axios.get(`${API_URL}/transactiondetails?_expand=product&&transactionId=${res.data[0].id}`)
            .then((rescart)=>{
                this.setState({cartProduct:rescart.data})
                console.log(rescart.data)
                rescart.data.forEach((val,index)=>{
                    this.setState({
                        checkDetails: {
                            ...this.state.checkDetails,
                            item: this.state.checkDetails.item+val.qty,
                            harga: this.state.checkDetails.harga+val.product.harga*val.qty
                        }
                    })
                    items=items+val.qty
                })
            }).catch((err)=>{
                console.log(err)
            }).finally(()=>{
                // this.UpdateItems(items)
                // this.GiveNotif('test')
                // console.log(items)
            })
        }).catch((err)=>{
            console.log(err)
        })
        // console.log(this.state.cartProduct)
        // get voucher code
        Axios.get(`${API_URL}/vouchers`)
        .then((res)=>{
            this.setState({vouchers: res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    reloadCart=()=>{
        // get all transactions with the transaction Id
        Axios.get(`${API_URL}/transactiondetails?_expand=product&&transactionId=${this.state.transactionId}`)
        .then((rescart)=>{
            this.setState({cartProduct:rescart.data})
            // recalculate qty dan harga
            this.setState({checkDetails:{item:0,harga:0}})
            rescart.data.forEach((val,index)=>{
                this.setState({
                    checkDetails: {
                        ...this.state.checkDetails,
                        item: this.state.checkDetails.item+val.qty,
                        harga: this.state.checkDetails.harga+val.product.harga*val.qty
                    }
                    
                })
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    deleteItem=(transactiondetailsid)=>{
        // get transaction details id
        // then delete
        Axios.delete(`${API_URL}/transactiondetails/${transactiondetailsid}`)
        .then((res)=>{
            console.log(res.data)
            this.setState({deleteindex: -1})
            this.reloadCart()
            this.props.GiveNotif('Items is deleted')
            setTimeout(()=>{
                this.props.RemoveNotif()
                this.reloadCart()
            },2000)
        }).catch((err)=>{
            console.log(err)
        })

    }

    onAddQty=(e,transactiondetailsid)=>{
        console.log('test')
        var amt
        if(e.target.name==='add'){
            amt=1
        }else if(e.target.name==='sub'){
            amt=-1
        }else{
            amt=0
        }

        Axios.get(`${API_URL}/transactiondetails/${transactiondetailsid}`)
        .then((res)=>{
            Axios.put(`${API_URL}/transactiondetails/${transactiondetailsid}`,
                {
                    ...res.data,
                    qty: res.data.qty+amt
                }
            )
            .then((res)=>{
                this.reloadCart()
            }).catch((err)=>{
                console.log(err)
            })

        }).catch((err)=>{
            console.log(err)
        })
    }

    onEditMsg=(transactiondetailsid)=>{
        if(this.state.editmsg!==''){
            Axios.get(`${API_URL}/transactiondetails/${transactiondetailsid}`)
            .then((res)=>{
                Axios.put(`${API_URL}/transactiondetails/${transactiondetailsid}`,
                    {
                        ...res.data,
                        msg: this.state.editmsg
                    }
                )
                .then((res)=>{
                    this.setState({editmsgindex: -1, editmsg: ''})
                    this.reloadCart()
                }).catch((err)=>{
                    console.log(err)
                })
    
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    // TO DO...
    // situation, if a user open this page, and during this time, if the product is being updated
    // then, the new product details will be received until the page is refreshed
    // so, the user is able to make a purchase with previous product details(name, price, description, etc)
    // SOLUTION
    // 
    finishPayment=(method)=>{
        //first, need to add current product details
        this.state.cartProduct.forEach((val,index)=>{
            Axios.put(`${API_URL}/transactiondetails/${val.id}`,
            {
                ...val,
                // harga: val.product.harga
            }).then((res)=>{
                console.log(res)
            }).catch((err)=>{
                console.log(err)
            })
        })

        // then change the status on transaction data
        Axios.put(`${API_URL}/transactions/${this.state.transactionId}`,
            {
                status: 'onprocess',
                userId: this.props.User.id,
                method: method,
                id: this.state.transactionId
            }
        ).then((res)=>{
            // complete
            this.props.GiveNotif('Pembayaran berhasil')
            setTimeout(()=>{
                this.props.RemoveNotif()
                this.setState({complete:true})
            },2000)
        }).catch((err)=>{
            console.log(err)
        })
    }

    handleEdit=(index)=>{
        this.setState({editmsgindex: index})
        // this.nameInput.focus()
    }

    voucherCheck=()=>{
        this.state.vouchers.forEach((val,index)=>{
            if(val.code===this.state.inputVoucher){
                this.finishPayment('voucher')
            }else{
                this.setState({errvoucher: true})
            }
        })
    }

    renderVouchers=()=>{
        return this.state.vouchers.map((val,index)=>{
            return (
                <Label 
                    style={{
                        fontSize: '18px', 
                        fontWeight:'100', 
                        color:'rgb(150,150,150)', 
                        // width: '100%', 
                        display: 'block',
                        textAlign: 'center',
                        letterSpacing: '-2px',
                        margin:'0 0 14px'
                    }}
                    as='a'
                    tag    
                >
                    {val.code}
                </Label>
            )
        })
    }

    renderCartProducts=()=>{
        return this.state.cartProduct.map((val,index)=>{
            return (
                <Segment key={index} className='cart-product' style={{display:'flex', justifyContent:'space-between'}}>
                    <div style={{flex:'0 0 45%'}}>
                        <Item.Group>
                            <Item style={{display:'flex'}}>
                            <Item.Image style={{width: '45%', margin: '0 20px 0 0'}}  size='tiny' src={val.product.image} />

                            <Item.Content >
                            <Item.Header as='a'>{val.product.name}</Item.Header>

                            {
                                index===this.state.editmsgindex?
                                <div>
                                    <TextArea 
                                        style={{margin: '7px 0', color: 'gray', fontSize: 'unset'}}
                                        onChange={(e)=>{
                                            this.setState({editmsg: e.target.value})
                                            console.log(e.target.value)
                                        }} 
                                        onBlur={()=>{this.onEditMsg(val.id)}}
                                        placeholder={val.msg} 
                                        value={this.state.editmsg}
                                        // ref={(input) => { this.nameInput = input; }}
                                    />
                                    <div>
                                        <span 
                                            className='color-sign-sec'
                                            onClick={()=>{
                                                this.onEditMsg(val.id)
                                            }} 
                                            style={{cursor: 'pointer', textAlign:'left'}}
                                        >
                                            Ok
                                        </span>
                                    </div>

                                </div>
                                :
                                <div>
                                    <Item.Meta style={{}}>{val.msg}</Item.Meta>
                                    <span
                                        className='color-sign-sec'
                                        onClick={()=>{
                                            this.handleEdit(index)
                                            this.setState({editmsg: val.msg})
                                        }} 
                                        style={{cursor: 'pointer', textAlign:'left'}}
                                    >
                                        Edit
                                    </span>
                                </div>

                            }
                            
                                {/* <Item.Extra>Additional Details</Item.Extra> */}
                            </Item.Content>
                            </Item>
                        </Item.Group>
                    </div>
                    <div style={{flex:'0 0 15%'}}>
                        <h4 className='color-sign-sec' style={{fontWeight:'bold'}}>Rp{Numeral(val.product.harga).format(0.0)}</h4>
                    </div>
                    <div style={{flex:'0 0 15%', whiteSpace:'nowrap'}}>
                        <span style={{display: 'inline-block',marginBottom: '7px'}}>
                            <Button name='sub' onClick={(e)=>{this.onAddQty(e,val.id)}} style={{padding: '5px 10px'}} basic>-</Button>
                                <span style={{margin:'0 5px'}}>{val.qty}</span>
                            <Button name='add' onClick={(e)=>{this.onAddQty(e,val.id)}} style={{marginLeft:'.25em', padding: '5px 10px'}} basic>+</Button>
                        </span>
                    </div>
                    <div style={{flex:'0 0 15%', whiteSpace: 'nowrap'}}>
                        {
                            index===this.state.deleteindex?
                            <span style={{float: 'right'}}>
                                <Button onClick={()=>{this.deleteItem(val.id)}} content='yes' />
                                <Button onClick={()=>{this.setState({deleteindex: -1})}} content='no' />
                                <p style={{textAlign: 'center', marginTop: '10px'}}>Are you sure?</p>
                            </span>
                            :
                            <Button onClick={()=>{this.setState({deleteindex: index})}} style={{float:'right'}} >
                                <Icon name='trash alternate outline' />
                                Hapus
                            </Button>
                        }
                    </div>
                </Segment>
            )
        })
    }

    render() { 
        // console.log('test')
        if(this.props.User.role==='admin'){
            this.props.GiveNotif('Admin cannot purchase ;)')
            setTimeout(()=>{
                this.props.RemoveNotif()
            },2000)
            return <Redirect to='/manageproducts'/>
        }else{
            return ( 
                <div style={{padding:'50px 30vw 0 10vw'}}>
                    <div className={this.state.checkout?'show gone':'show'}>
                    <Segment>
                        <h2>Cart</h2>
                    </Segment>
    
                    <Segment className='cart-product' style={{display:'flex', justifyContent:'space-between'}}>
                        <span style={{flex:'0 0 45%'}}>
                             <span>Items</span>
                        </span>
                        <div style={{flex:'0 0 15%'}}>
                            <p>Harga</p>
                        </div>
                        <div style={{flex:'0 0 15%'}}>
                            <p>Jumlah</p>
                        </div>
                        <div style={{flex:'0 0 15%'}}>

                        </div>
                    </Segment>
    
                    {this.renderCartProducts()}

                    </div>

                    {/* Checkout section */}
                    <Segment 
                        className={
                            this.state.checkout?
                            'show gone'
                            :
                            'show vague'
                        }
                        style={{position: 'fixed', 
                                top: '106px',
                                left: '71vw',
                                width: '24vw',
                                margin: '0'
                            }}
                        compact
                    >
                        <Divider 
                            // style={{position: 'relative', margin: 'auto'}} 
                            className='cart-checkout'
                            horizontal
                            // section
                            // clearing
                        >
                            <Header as='h4'>
                                <Icon style={{color: 'rgb(57, 162, 109)'}} name='tags' />
                                Belanja
                            </Header>
                        </Divider>
                        <p>
                            <span style={{color: 'rgb(150,150,150)', marginRight: '40px'}}>
                                Item
                            </span>
                            <span style={{float: 'right'}}>
                                {this.state.checkDetails.item}
                            </span>
                        </p>
                        <p>
                            <span style={{color: 'rgb(150,150,150)', marginRight: '40px'}}>
                                Total Harga
                            </span>
                            <span className='color-sign-sec' style={{float: 'right'}}>
                                Rp{Numeral(this.state.checkDetails.harga).format(0.0)}
                            </span>
                        </p>
                        <Button onClick={()=>{this.setState({checkout:true})}} className='bg-sign bg-sign-hvr' style={{display: 'block', width: '100%', marginTop: '0px'}}>
                            Checkout
                        </Button>
                    </Segment>


                    {/* Payment section */}
                    <Segment 
                        className={
                            this.state.checkout?
                            'show'
                            :
                            'show gone'
                        }
                        style={{position: 'fixed', 
                                top: 'calc(56px + 3%)',
                                left: '50%',
                                transform: 'translate(-50%, 0%)',
                                minWidth: '40vw',
                                fontSize: '18px',
                                transition: 'all .5s ease'
                            }}
                        compact
                    >
                        <Divider 
                            // style={{position: 'relative', margin: 'auto'}} 
                            className='cart-checkout'
                            horizontal
                            section
                            // clearing
                        >
                            <Header as='h4'>
                                <Icon style={{color: 'rgb(57, 162, 109)'}} name='tags' />
                                Payment
                            </Header>
                        </Divider>
                        <p>
                            <span style={{color: 'rgb(150,150,150)', marginRight: '40px'}}>
                                Total Harga
                            </span>
                            <span style={{float: 'right'}} className='color-sign-sec'>
                                Rp{Numeral(this.state.checkDetails.harga).format(0.0)}
                            </span>
                        </p>
                        <Divider section/>

                        <Tab renderActiveOnly={true} style={{color: 'rgb(120,120,120)'}} panes={[
                            {
                                menuItem: { key: 'transfer', icon: 'dollar', content: 'Transfer' },
                                render: () => <Tab.Pane>
                                    <Segment style={{lineHeight: '120px'}}>
                                        Do your transfer payment here...
                                    </Segment>
                                    <Divider />
                                    <Button onClick={()=>{this.finishPayment('transfer')}} className='bg-sign bg-sign-hvr' style={{fontSize: '18px', width: '100%', marginTop: '14px'}}>
                                        Finish
                                    </Button>
                                </Tab.Pane>,
                                },
                            {
                            menuItem: { key: 'voucher', icon: 'ticket alternate', content: 'Voucher' },
                            render: () => <Tab.Pane>
                                <p>Voucher code</p>
                                {this.renderVouchers()}
                                <Divider />
                                <Input onChange={(e)=>{this.setState({inputVoucher: e.target.value})}} style={{width: '100%'}} placeholder='Enter your voucher code...'/>
                                {
                                    this.state.errvoucher?
                                    <p style={{color: 'red', marginTop: '7px'}}>Code voucher tidak berhasil</p>
                                    : null
                                }
                                <Button onClick={this.voucherCheck}  className='bg-sign bg-sign-hvr' style={{fontSize: '18px', width: '100%', marginTop: '14px'}}>
                                    Submit
                                </Button>
                            </Tab.Pane>,
                            },
                            {
                            menuItem: (
                                <Menu.Item key='cod'>
                                    <Icon name='money bill alternate'/>
                                Cash on delivery<Label>new</Label>
                                </Menu.Item>
                            ),
                            render: () => <Tab.Pane>
                                <Message>
                                    <Message.Header>New Method</Message.Header>
                                    <span style={{color: 'rgba(0,0,0,.87)'}}>
                                    We updated our privacy policy here to better service our customersaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                                    </span>
                                </Message>
                                <Button onClick={()=>{this.finishPayment('cod')}} className='bg-sign bg-sign-hvr' style={{fontSize:'18px', width: '100%'}}>
                                    Cash on Delivery
                                </Button>
                            </Tab.Pane>,
                            },
                        ]} />

                    </Segment>


                    {/* payment success */}
                    {
                        this.state.complete?
                        <Redirect to='/'/>
                        : null

                    }
                    
    
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
 
export default connect(MapstatetoProps,{GiveNotif,RemoveNotif,UpdateItems}) (Cart);