import React, { useEffect, useState } from 'react'
import { Button, Icon, Item, Label, Form } from 'semantic-ui-react'
import Numeral from 'numeral'
import { API_URL } from '../supports/ApiUrl'
import Axios from 'axios'
import { GiveNotif, RemoveNotif } from './../redux/actions'
import { connect } from 'react-redux'



const ProductDetails=(props)=>{

    const [product,setproduct]=useState()
    const [buyproduct,setbuyproduct]=useState({
        productId: props.match.params.productid,
        qty: '',
        msg: ''
    })

    useEffect(()=>{
        Axios.get(`${API_URL}/products/${props.match.params.productid}`)
        .then((res)=>{
            setproduct(res.data)
            // console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])


    // NEED TO FIX 
    // IF CHAR IS INPUT, THEN ERROR
    const handleInput=(e)=>{
        if(e.target.name==='qty'){
            if(e.target.value===''||e.target.value==='0'){
                setbuyproduct({...buyproduct,[e.target.name]:''})
            }else{
                setbuyproduct({...buyproduct,[e.target.name]:parseInt(e.target.value)})
            }
        }else{
            setbuyproduct({...buyproduct,[e.target.name]:e.target.value})
        }
        // console.log('target value '+e.target.value)
        // console.log('buyproduct qty '+buyproduct.qty)
    }


    // IMPORTANT
    // CHECK IF RETURN OBJECT OR ARRAY
    const onPurchase=()=>{
        // check if there is transaction in the cart
        Axios.get(`${API_URL}/transactions?userId=${props.User.id}&&status=oncart`)
        .then((res)=>{
            // var {transactionId}=res.data[0]
            if(res.data.length){
                // if the transaction already exist (cart is not empty), then just add more item
                // but first check if the same product already exist in the cart
                Axios.get(`${API_URL}/transactiondetails?transactionId=${res.data[0].id}&&productId=${props.match.params.productid}`)
                    .then((resproductcheck)=>{
                        // console.log(resproductcheck)
                        if(resproductcheck.data.length){
                            // if product already exist then just add the quantity
                            // and update the message for seller
                            Axios.put(`${API_URL}/transactiondetails/${resproductcheck.data[0].id}`,
                            {
                                ...resproductcheck.data[0],
                                qty: (parseInt(resproductcheck.data[0].qty)+buyproduct.qty),
                                msg: buyproduct.msg
                            }).then((resproductadded)=>{
                                // after qty is added
                                // console.log(resproductadded)
                                props.GiveNotif('Product is added to the cart')
                                setTimeout(()=>{
                                    props.RemoveNotif()
                                },2000)
                            })
                        }else{
                            // if product is not yet existed, then create new transaction-details
                            // transactionId =  res.data[0].id
                            Axios.post(`${API_URL}/transactiondetails`,
                                {
                                    transactionId: res.data[0].id, 
                                    ...buyproduct
                                }
                            ).then((resproductcreated)=>{
                                // after transaction detail is created
                                props.GiveNotif('Product is added to the cart')
                                setTimeout(()=>{
                                    props.RemoveNotif()
                                },2000)
                            })
                        }
                    }).catch((err)=>{
                    })
            }else{
                // if user transaction not exist (cart is empty), then create a new one
                Axios.post(`${API_URL}/transactions`,{status: 'oncart', userId: props.User.id})
                .then((resnewtransaction)=>{
                    // then add the items into it
                    // but first check if the same product already exist in the cart
                    // no point to check, since cart is empty
                    Axios.get(`${API_URL}/transactiondetails?transactionId=${resnewtransaction.data.id}&&productId=${props.match.params.productid}`)
                    .then((resproductchecksec)=>{
                        if(resproductchecksec.data.length){
                            // if product already exist then just add the quantity
                            Axios.put(`${API_URL}/transactiondetails/${resproductchecksec.data[0].id}`,
                            {
                                ...resproductchecksec.data[0],
                                qty: (resproductchecksec.data[0].qty+buyproduct.qty)
                            })
                            .then((resproductaddedsec)=>{
                                // after product is added
                                // NO NEED
                                console.log(resproductaddedsec.data)
                            }).catch((err)=>{
                                console.log(err)
                            })
                        }else{
                            // if product not exist, then push the transaction-details
                            Axios.post(`${API_URL}/transactiondetails`,
                                {
                                    transactionId: resnewtransaction.data.id, 
                                    ...buyproduct
                                })
                            .then((resproductcreatedsec)=>{
                                // after product is created
                                props.GiveNotif('Product is added to the cart')
                                setTimeout(()=>{
                                    props.RemoveNotif()
                                },2000)
                                // SUCCESS
                            }).catch((err)=>{
                                console.log(err)
                            })
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })

                }).catch((err)=>{
                    console.log(err)
                })
            }

        }).catch((err)=>{
            console.log(err)
        })
    }


    if(product){
        return (
            <div style={{marginTop:'90px'}}>
                <Item.Group divided>
                    <Item style={{padding:'0 30px'}}>
                    <Item.Image className='product-detail-img' 
                                style={{
                                    width:'550px', 
                                    height:'350px', 
                                    margin:'0 20px 0 0',
                                    padding: '10px',
                                    border: '0px solid black',
                                    overflow: 'hidden'
                                }} 
                                src={product.image} 
                            />
    
                    <Item.Content style={{maxWidth:'500px'}}>
                        <Item.Header style={{fontSize: '24px'}} as='h1'>{product.name}</Item.Header>
                        <Item.Meta>
                        {/* <span className='cinema'>IFC Cinema</span> */}
                        </Item.Meta>
                        <Item.Description>{product.deskripsi}</Item.Description>
                        <Item.Header style={{margin: '7px 0', fontWeight: '700'}} className='color-sign-sec' as='h5'>
                            Rp{Numeral(product.harga).format(0.0)}
                        </Item.Header>
                        <Item.Extra>
                        <Label>Stok {product.stok}</Label>
                        </Item.Extra>
                        <Item.Extra>
                        <Button as='div' labelPosition='left'>
                            <Label className='color-sign-hvr' as='a' basic pointing='right'>
                                2,048
                            </Label>
                            <Button className='color-sign-hvr' icon>
                                <Icon name='heart' />
                                Like
                            </Button>
                        </Button>
                        </Item.Extra>

                        <Item.Extra>
                            <Form>
                                <Form.Group>
                                    <Form.Input style={{width: '80px'}} value={buyproduct.qty} name='qty' onChange={handleInput} fluid type='number' label='Quantity' placeholder='0'/>
                                </Form.Group>
                                <Form.TextArea value={buyproduct.msg} name='msg' onChange={handleInput} style={{width: '350px'}} label='Message to seller' placeholder='Size or color...' />

                            </Form>
                        </Item.Extra>

                        <Item.Extra className='product-detail-des'>
                            {
                                props.User.role==='user'?
                                <Button onClick={onPurchase} className='bg-sign'>
                                    Add to cart
                                    <Icon name='right chevron' />
                                </Button>
                                : null
                            }
                        </Item.Extra>
                    </Item.Content>
                    </Item>
                </Item.Group>
            </div>
        )
    }else{
        return null
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth
    }
}

export default connect(MapstatetoProps,{GiveNotif,RemoveNotif}) (ProductDetails);