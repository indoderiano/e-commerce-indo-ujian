import React, { Component } from 'react'
import { Container, Grid, Button, Icon, Image, Header, Modal, Form, Checkbox, Item, Label, Input, Select, List, Segment } from 'semantic-ui-react'
import { API_URL } from '../supports/ApiUrl'
import Axios from 'axios'
import { connect } from 'react-redux'
import { GiveNotif, RemoveNotif } from '../redux/actions'
import { Redirect } from 'react-router-dom'


class ManageProducts extends Component {
    state = { 
        products:[],
        categories: [],
        addproduct:{
            name: '',
            image: '',
            stok: '',
            kategoriId: 1,
            harga: '',
            deskripsi: '',
            rating: '',
            sold: ''
        },
        editproduct:{
            name: '',
            image: '',
            stok: '',
            kategoriId: '',
            harga: '',
            deskripsi: '',
            rating: '',
            sold: ''
        },
        modalAdd: false,
        modalDelete: false,
        iddelete: -1,
        idedit: -1,
        erraddmsg: '',
        erreditmsg: '',
        tnc: false
     }

     componentDidMount(){
        //  IMPORTANT
        // cannot use redux store inside componentDidMount
        // if(this.props.User.role==='admin'){
        //     console.log('redux check in didmount in admin')
        // }
        Axios.get(`${API_URL}/products?_expand=kategori`)
        .then((res)=>{
            //  this.setState({products: res.data})
            Axios.get(`${API_URL}/kategoris`)
            .then((kategoris)=>{
                this.setState({products: res.data,categories: kategoris.data})
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
     }

    // getProductsData=()=>{
    //     Axios.get(`${API_URL}/products?_expand=kategori`)
    //     .then((res)=>{
    //         //  this.setState({products: res.data})
    //         Axios.get(`${API_URL}/kategoris`)
    //         .then((kategoris)=>{
    //             this.setState({products: res.data,categories: kategoris.data})
    //         }).catch((err)=>{
    //             console.log(err)
    //         })
    //     }).catch((err)=>{
    //         console.log(err)
    //     }) 
    // }

    reloadProduct=()=>{
        const defaultAddProduct = {
            name: '',
            image: '',
            stok: '',
            kategoriId: 1,
            harga: '',
            deskripsi: '',
            rating: '',
            sold: ''
        }
        Axios.get(`${API_URL}/products?_expand=kategori`)
        .then((resrefresh)=>{
            this.setState({ 
                products: resrefresh.data,
                addproduct: defaultAddProduct, 
                editproduct: defaultAddProduct,
                modalAdd: false, 
                modalDelete: false,
                iddelete: -1,
                idedit: -1,
                erraddmsg: '',
                erreditmsg: '',
                tnc: false
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    defaultMode = () => {
        const defaultAddProduct = {
            name: '',
            image: '',
            stok: '',
            kategoriId: 1,
            harga: '',
            deskripsi: '',
            rating: '',
            sold: ''
        }
        this.setState({ 
            addproduct: defaultAddProduct, 
            editproduct: defaultAddProduct,
            modalAdd: false, 
            modalDelete: false,
            iddelete: -1,
            idedit: -1,
            erraddmsg: '',
            erreditmsg: '',
            tnc: false
        })
    }
    //

    // modal
    openModalAdd = () => {
        this.setState({ modalAdd: true })
    }
    

    onSubmitProduct=()=>{
        var {name,image,stok,kategoriId,harga,deskripsi}=this.state.addproduct
        var {tnc}=this.state
        if(name&&image&&stok&&kategoriId&&harga&&deskripsi&&tnc){
            Axios.post(`${API_URL}/products`,this.state.addproduct)
            .then((res)=>{

                // close modal add
                this.setState({ modalAdd: false })
                this.props.GiveNotif('Product Added Succesfully')
                setTimeout(()=>{
                    this.props.RemoveNotif()
                    this.reloadProduct()
                },2000)
            }).catch((err)=>{
                console.log(err)
            })
        }else{
            // console.log('smua kolom harus diisi')
            this.setState({erraddmsg: 'Semua kolom harus diisi'})
            // if(this.state.tnc){
            //     this.setState({erraddmsg: 'check is true'})
            // }
            
            if(name&&image&&stok&&kategoriId&&harga&&deskripsi){
                this.setState({erraddmsg: 'Terms and conditions harus disetujui'})
            }else{
                this.setState({erraddmsg: 'Semua kolom harus diisi'})
            }
        }
    }

    onDeleteProduct=()=>{
        Axios.delete(`${API_URL}/products/${this.state.iddelete}`)
        .then((res)=>{
            // close modal delete
            this.setState({ modalDelete: false })
            this.props.GiveNotif('Product is deleted')
            setTimeout(()=>{
                this.props.RemoveNotif()
                this.reloadProduct()
            },2000)
        }).catch((err)=>{
            console.log(err)
        })
    }
    onEditProduct=()=>{
        var {name,image,stok,kategoriId,harga,deskripsi}=this.state.editproduct
        if(name&&image&&stok&&kategoriId&&harga&&deskripsi){
            Axios.put(`${API_URL}/products/${this.state.idedit}`,this.state.editproduct)
            .then((res)=>{
                this.props.GiveNotif('Update Succesful')
                setTimeout(()=>{
                    this.props.RemoveNotif()
                    this.reloadProduct()
                },2000)
            }).catch((err)=>{
                console.log(err)
            })
        }else{
            console.log('smua kolom harus diisi')
            this.setState({erreditmsg: 'Semua kolom harus diisi'})
        }
    }

    handleInput=(e)=>{
        // if(e.target.name==='stok'||e.target.name==='harga'){
        //     this.setState({addproduct:{...this.state.addproduct,[e.target.name]:parseInt(e.target.value)}})
        // }else{
        // }
        this.setState({addproduct:{...this.state.addproduct,[e.target.name]:e.target.value}})
    }
    handleInputEdit=(e)=>{
        // if(e.target.name==='stok'||e.target.name==='harga'){
        //     this.setState({editproduct:{...this.state.editproduct,[e.target.name]:parseInt(e.target.value)}})
        // }else{
        // }
        this.setState({editproduct:{...this.state.editproduct,[e.target.name]:e.target.value}})
    }
    handleTnC=(e)=>{
        this.setState({tnc:!this.state.tnc})
        console.log(this.state.tnc)
    }
    handleDelete=(id)=>{
        this.setState({iddelete: id, modalDelete: true})
    }
    handleEdit=(id)=>{
        // this.setState({idedit: id})
        // need to store product data to editproduct
        this.state.products.forEach((val,index)=>{
            if(val.id===id){
                this.setState({editproduct:val,idedit:id})
            }
        })
    }

    renderCategories=()=>{
        // return [
        //     { key: 'm', text: 'Male', value: 'male' },
        //     { key: 'f', text: 'Female', value: 'female' },
        //     { key: 'o', text: 'Other', value: 'other' },
        //   ]
        return this.state.categories.map((val,index)=>{
            return {
                key: val.id, text: val.nama, value: val.nama, name: val.nama
            }
        })
    }
    handleCategory=(e)=>{
        // if(e.target.textContent===''){
        //     this.setState({addproduct:{...this.state.addproduct,kategoriId: 1}})
        // }
        this.state.categories.forEach((val,index)=>{
            if(val.nama===e.target.textContent){ // using textContent to get value
                this.setState({addproduct:{...this.state.addproduct,kategoriId:val.id}})
            }
        })
    }
    handelCategoryEdit=(e)=>{
        // console.log(e.target.value)
        this.state.categories.forEach((val,index)=>{
            if(val.nama===e.target.textContent){ // using textContent to get value
                this.setState({editproduct:{...this.state.editproduct,kategoriId:val.id}})
            }
        })
        // console.log(this.state.editproduct)
    }
    

    renderProducts=()=>{
        return this.state.products.map((val,index)=>{
            return (
                            val.id===this.state.idedit?

                            <Grid.Row key={index} style={{margin: '10px 0'}} className='ui segment'>
                            <Grid.Column width={1}>
                                {index+1}
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Input 
                                    value={this.state.editproduct.name} 
                                    name='name' 
                                    onChange={this.handleInputEdit} 
                                    placeholder={val.name}
                                    fluid
                                />
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Input 
                                    value={this.state.editproduct.image} 
                                    name='image' 
                                    onChange={this.handleInputEdit} 
                                    placeholder={val.image}
                                    fluid
                                />
                                <Image style={{marginTop: '10px'}} src={this.state.editproduct.image?this.state.editproduct.image:val.image}/>
                            </Grid.Column>
                            <Grid.Column width={1}>
                            <Input 
                                value={this.state.editproduct.stok} 
                                name='stok' 
                                onChange={this.handleInputEdit} 
                                placeholder={val.stok}
                                fluid
                            />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Select
                                    fluid
                                    options={this.renderCategories()}
                                    placeholder={val.kategori.nama}
                                    onChange={this.handelCategoryEdit}
                                />

                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Input 
                                    value={this.state.editproduct.harga} 
                                    name='harga' 
                                    onChange={this.handleInputEdit} 
                                    placeholder={val.harga}
                                    fluid
                                />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Input 
                                    value={this.state.editproduct.deskripsi} 
                                    name='deskripsi' 
                                    onChange={this.handleInputEdit} 
                                    placeholder={val.deskripsi}
                                    fluid
                                />
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <List>
                                    <List.Item>
                                        <Icon style={{margin: '10px 3px 0 0', verticalAlign: '.5px'}} color='yellow' name='star'/>
                                        {val.rating}
                                    </List.Item>
                                    <List.Item style={{marginTop: '10px'}}>
                                        Sold
                                        <Label size='large'>
                                            {val.sold}
                                        </Label>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Button onClick={this.onEditProduct} style={{marginBottom: '1em'}} icon labelPosition='left'>
                                <Icon name='save outline' />
                                Submit
                                </Button>
                                <Button onClick={this.defaultMode} icon labelPosition='left'>
                                <Icon name='delete' />
                                Cancel
                                </Button>
                                <Segment 
                                    style={{
                                        color: 'red', 
                                        paddingTop: '10px', 
                                        border: 'unset',
                                        boxShadow: 'unset', 
                                        padding: '0'
                                    }}
                                >
                                    {this.state.erreditmsg?this.state.erreditmsg:null}
                                </Segment>
                            </Grid.Column>
                            </Grid.Row>

                            : 

                            <Grid.Row key={index} style={{margin: '10px 0'}} className='ui segment'>
                            <Grid.Column width={1}>
                                {index+1}
                            </Grid.Column>
                            <Grid.Column width={2}>
                                {/* {val.name?val.name:null} */}
                                {val.name}
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Image src={val.image}/>
                            </Grid.Column>
                            <Grid.Column width={1}>
                                {val.stok}
                            </Grid.Column>
                            <Grid.Column width={2}>
                                {val.kategori.nama}
                            </Grid.Column>
                            <Grid.Column width={2}>
                                Rp{val.harga}.00
                            </Grid.Column>
                            <Grid.Column width={2}>
                                {val.deskripsi}
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <List>
                                    <List.Item>
                                        <Icon style={{margin: '10px 3px 0 0', verticalAlign: '.5px'}} color='yellow' name='star'/>
                                        {val.rating}
                                    </List.Item>
                                    <List.Item style={{marginTop: '10px'}}>
                                        Sold
                                        <Label size='large'>
                                            {val.sold}
                                        </Label>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Button onClick={()=>{this.handleEdit(val.id)}} style={{marginBottom: '1em'}} icon labelPosition='left'>
                                <Icon name='edit outline' />
                                Edit
                                </Button>
                                <Button onClick={()=>{this.handleDelete(val.id)}} icon labelPosition='left'>
                                <Icon name='delete' />
                                Delete
                                </Button>
                            </Grid.Column>
                            </Grid.Row>
                        
            )
        })
    }

    render() { 
        // const { open, closeOnEscape, closeOnDimmerClick } = this.state
        if(this.props.User.role==='admin'){
            // this.getProductsData()
        return ( 
            <Container style={{paddingTop:'30px'}}>
                <Header as='h1'>Manage Products</Header>
                <Grid style={{fontSize:'12px'}} divided>
                    <Grid.Row className='ui segment' style={{
                                        fontSize: '15px', 
                                        fontWeight: 'bold',
                                        margin: '10px 0'
                                    }}
                    >
                        <Grid.Column width={1}>
                        No.
                        </Grid.Column>
                        <Grid.Column width={2}>
                        Name
                        </Grid.Column>
                        <Grid.Column width={3}>
                        Image
                        </Grid.Column>
                        <Grid.Column width={1}>
                        Stok
                        </Grid.Column>
                        <Grid.Column width={2}>
                        Kategori
                        </Grid.Column>
                        <Grid.Column width={2}>
                        Harga
                        </Grid.Column>
                        <Grid.Column width={2}>
                        Deskripsi
                        </Grid.Column>
                        <Grid.Column width={1}>
                        Data
                        </Grid.Column>
                        <Grid.Column width={2}>
                        Action
                        </Grid.Column>

                    </Grid.Row>
                    {this.renderProducts()}
                </Grid>
                
                {/* modal add product */}
                <Modal 
                    open={this.state.modalAdd}
                    // closeOnEscape={true}
                    // closeOnDimmerClick={true}
                    // onClose={this.close} 
                    trigger={
                                <Button className='bg-sign bg-sign-hvr' 
                                    style={{
                                            position: 'fixed',
                                            right: '10%', 
                                            bottom: '10%'
                                        }} 
                                    content='Add Product' 
                                    icon='add' 
                                    labelPosition='left' 
                                    onClick={this.openModalAdd}
                                />
                                } 
                                basic size='small'
                >

                    <Modal.Content>
                    <Grid columns={2}>
                        {/* preview product add */}
                        <Grid.Column>
                            <Header style={{color: 'white'}} icon={{name: 'list ul'}} content='Preview' />
                            <Item.Group style={{padding: '0vh 0 0 0'}} divided>
                                <Item>
                                    {
                                        this.state.addproduct.image?
                                        <Item.Image className='a' 
                                                    style={{ 
                                                        margin:'0 20px 0 0',
                                                        border: '0px solid black',
                                                        overflow: 'hidden'
                                                    }} 
                                                    src={this.state.addproduct.image} 
                                        />
                                        : null
                                    }
                                </Item>
                
                                <Item>
                                <Item.Content>
                                    {
                                        this.state.addproduct.name?
                                        <Item.Header style={{color: 'white'}} as='a'>{this.state.addproduct.name}</Item.Header>
                                        : null
                                    }
                                    <Item.Meta>
                                    {/* <span className='cinema'>IFC Cinema</span> */}
                                    </Item.Meta>
                                    {
                                        this.state.addproduct.deskripsi?
                                        <Item.Description style={{color: 'white'}}>{this.state.addproduct.deskripsi}</Item.Description>
                                        : null
                                    }
                                    <Item.Extra>
                                    {
                                        this.state.addproduct.stok?
                                        <Label>Stok {this.state.addproduct.stok}</Label>
                                        : null
                                    }
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
                                    <Item.Extra style={{color: 'white'}}>
                                        {
                                            this.state.addproduct.harga?
                                            <span>Rp{this.state.addproduct.harga}.00</span>
                                            : null
                                        }
                                    </Item.Extra>
                                    <Item.Extra className='product-detail-des'>
                                    {/* <Button className='bg-sign'>
                                        Buy items
                                        <Icon name='right chevron' />
                                    </Button> */}
                                    </Item.Extra>
                                </Item.Content>
                                </Item>
                            </Item.Group>
                        </Grid.Column>
                        <Grid.Column>
                        {/*  */}
                            <Header style={{color: 'white'}} icon='list alternate outline' content='Add product details' />
                            <Form style={{margin:'0 0 20px 0', color: 'white'}}>
                                <Form.Field>
                                <label style={{color: 'white'}}>Name</label>
                                <input value={this.state.addproduct.name} name='name' onChange={this.handleInput} placeholder='Name' />
                                </Form.Field>
                                <Form.Field>
                                <label style={{color: 'white'}}>Image</label>
                                <input value={this.state.addproduct.image} name='image' onChange={this.handleInput} placeholder='Image source' />
                                </Form.Field>
                                <Form.Group widths='equal'>
                                <Form.Input 
                                    fluid 
                                    label={<label style={{color: 'white'}}>Stok</label>} 
                                    placeholder='Stok' 
                                    onChange={this.handleInput}
                                    name='stok'
                                    value={this.state.addproduct.stok}
                                    // input={<input value={this.state.addproduct.stok} name='stok' onChange={this.handleInput}/>}
                                />
                                {/* <Form.Input fluid label={<label style={{color: 'white'}}>Name</label>} placeholder='Last name' /> */}
                                <Form.Select
                                    fluid
                                    label={<label style={{color: 'white'}}>Kategori</label>}
                                    options={this.renderCategories()}
                                    placeholder='Kategori'
                                    // text='test'
                                    onChange={this.handleCategory}
                                    // name='test2'
                                />
                                </Form.Group>
                                <Form.Field>
                                <label style={{color: 'white'}}>Harga</label>
                                <input value={this.state.addproduct.harga} name='harga' onChange={this.handleInput} placeholder='Harga' />
                                </Form.Field>
                                <Form.Field>
                                <Form.TextArea 
                                    label={<label style={{color: 'white'}}>Description</label>} 
                                    placeholder='Product description...' 
                                    onChange={this.handleInput}
                                    name='deskripsi'
                                    value={this.state.addproduct.deskripsi}
                                    // textarea={<textarea value={this.state.addproduct.deskripsi} name='deskripsi' onChange={this.handleInput}/>}
                                />
                                {/* <textarea value={this.state.addproduct.deskripsi} name='deskripsi' onChange={this.handleInput}/> */}
                                </Form.Field>
                                <Form.Field>
                                <Checkbox checked={this.state.tnc} name='tnc' onChange={this.handleTnC} label={<label style={{color: 'white'}}>I Agree to the Terms and Conditions</label>} />
                                </Form.Field>
                            </Form>
                            <Modal.Actions>
                            <Button onClick={this.defaultMode} basic color='red' inverted>
                                <Icon name='remove' /> Cancel
                            </Button>
                            <Button onClick={this.onSubmitProduct} color='green' inverted>
                                <Icon name='checkmark' /> Submit
                            </Button>
                            </Modal.Actions>
                            <Label 
                                basic 
                                style={{marginTop: '0px', color: 'orange', fontWeigth: 'lighter', background: 'unset'}} 
                                as='h4'
                            >
                                {this.state.erraddmsg?this.state.erraddmsg:null}
                            </Label>

                        </Grid.Column>
                    </Grid>

                </Modal.Content>
                </Modal>

                {/* modal delete */}
                <Modal 
                    open={this.state.modalDelete}
                    basic size='small'
                >
                    <Modal.Content>
                            <Header style={{color: 'white'}} content='Are you sure?' />
                            <Modal.Actions>
                            <Button onClick={this.defaultMode} basic color='red' inverted>
                                <Icon name='remove' /> Cancel
                            </Button>
                            <Button onClick={this.onDeleteProduct} color='green' inverted>
                                <Icon name='checkmark' /> Yes
                            </Button>
                            </Modal.Actions>
                    </Modal.Content>
                </Modal>

                {/* modal finished, no need anymore */}
                {/* <Modal 
                    open={this.state.modalFinished}
                    basic size='small'
                >
                    <Modal.Content>
                        <Header style={{color: 'white'}} content={this.state.modalMsg} />
                        <Button onClick={this.reloadProduct} color='green' inverted>
                            <Icon name='checkmark'/> Ok
                        </Button>
                    </Modal.Content>
                </Modal> */}

                
            </Container>
         )

        }else{
            if(this.props.Modal.isOpen){
                return null
            }else{
                this.props.GiveNotif('Admin access is declined')
                console.log(this.props.User.role)
                console.log('no access')
                setTimeout(()=>{
                    this.props.RemoveNotif()
                },2000)
                return <Redirect to='/'/>
            }
        }
    }
}

const MapstatetoProps=(state)=>{
    return {
        User: state.Auth,
        Modal: state.Modal
    }
}
 
export default connect(MapstatetoProps,{GiveNotif,RemoveNotif}) (ManageProducts);




// TASK
// on edit product, make the value equal to current data
// idea
// on edit click, get the product data, then store them in the state
//how to get the product data
// by using the product id, forEach the state product data, then store them into the state edit product data