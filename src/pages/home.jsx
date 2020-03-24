import React, {Component} from 'react'
import { Header, Image, Segment, Card, Icon, Container, Grid, Input, Label } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import Axios from 'axios'




class Home extends Component {
    state = { 
        products:[],
        keyword:'',
        redirect: false
     }

     componentDidMount(){
         Axios.get('http://localhost:2000/products?_expand=kategori')
         .then((res)=>{
            this.setState({products:res.data})
         }).catch((err)=>{
             console.log(err)
         })
     }

     handleKeyPress=(e)=>{
         if(e.key==='Enter'){
             this.setState({redirect:true})
         }
     }


    renderProducts=()=>{
        return this.state.products.map((val,index)=>{
            return (
                // <Link className='product-card' key={val.id} to={`/productdetails/${val.id}`}>
                <Card key={val.id} className='product-card card product-outline-sign-hvr'>
                    <div className='' style={{height:'150px', overflow:'hidden'}}>
                        <Image style={{height:'100%', textAlign:'center', position: 'relative'}} src={val.image} wrapped ui={false} />
                        {/* <div className='shadowlayer'>
                            <Button basic color='red'>
                                Red
                            </Button>
                        </div> */}
                    </div>
                    <Card.Content>
                    <Card.Header>{val.name}</Card.Header>
                    <Card.Meta>
                        <Icon style={{margin: '10px 3px 0 0', verticalAlign: '.5px'}} color='yellow' name='star'/>
                        {val.rating}
                        <Label style={{marginLeft: '10px'}}>Sold ({val.sold})</Label>
                    </Card.Meta>
                    <Card.Meta style={{marginTop:'10px'}}>
                    <Header as='h5' size='small' className='date' style={{color:'orange', fontWeight:'bold'}}>
                        Rp.{val.harga}.00
                    </Header>
                    {/* <span className='date' style={{color:'orange', fontWeight:'bold'}}>Rp.{val.harga}.00</span> */}
                    </Card.Meta>
                    {/* <Card.Description style={{letterSpacing: '1px'}}>
                        {val.deskripsi}
                    </Card.Description> */}
                    </Card.Content>
                    <Card.Content extra>
                        {/* <Icon name='user' /> */}
                        {val.kategori.nama}
                    </Card.Content>
                    <Link className='layer' to={`/productdetails/${val.id}`}></Link>
                    
                </Card>
                // </Link>
            )
        })
    }

    render() { 
        return ( 
            <Container style={{position: 'relative'}}>

                <Grid style={{height: 'calc(100vh - 56px)' ,overflow:'hidden'}} columns={2} >
                    <Grid.Row stretched>
                        <Grid.Column>
                            <Icon style={{fontSize:'30vw',
                                    color: 'rgb(57, 162, 109)',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '35%',
                                    transform: 'translate(-50%,-50%)'
                                    }} name='podcast' size='massive'
                            />
                            <Header style={{margin:'0',
                                        background: 'white',
                                        padding: '6px',
                                        borderRadius: '0px',
                                        left: '45%',
                                        top: '47%',
                                        fontSize: '2vw',
                                        color: 'rgb(80,80,80)',
                                        transform: 'translate(-0%,-50%) rotate(-0deg)',
                                        letterSpacing: '9px',
                                        whiteSpace: 'nowrap'
                                        }} className='central'>E-Commerce</Header>
                        </Grid.Column>

                        {/* <Grid.Column>
                            <Header className='central' style={{
                                                            top: '25%', 
                                                            left: '50%', 
                                                            width: '85%', 
                                                            fontWeight:'lighter', 
                                                            fontSize: '24px',
                                                            color: 'rgb(50,50,50)',
                                                            letterSpacing: '3px'
                                                            }}
                            >Phasellus eu sem at odio euismod venenatis eu nec neque</Header>
                            <Segment className='central' circular style={{width: 175, height: 175, top: '60%', left: '38%'}}>
                                <Header className='color-sign central' as='h2'>
                                    Sale!
                                    <Header.Subheader>$10.99</Header.Subheader>
                                </Header>
                            </Segment>
                            <Segment className='bg-sign central' circular inverted style={{width: 175, height: 175, top: '50%', left: '60%'}}>
                                <Header className='central' as='h2' inverted>
                                    Buy Now
                                    <Header.Subheader>$10.99</Header.Subheader>
                                </Header>
                            </Segment>
                        </Grid.Column> */}

                        <Grid.Column>
                            <Segment style={{boxShadow: 'unset', border: '0px'}}>
                                <Header className='central' style={{
                                                                top: '65%', 
                                                                left: '50%', 
                                                                width: '85%', 
                                                                fontWeight:'lighter', 
                                                                fontSize: '24px',
                                                                color: 'rgb(50,50,50)',
                                                                letterSpacing: '3px'
                                                                }}
                                >Phasellus eu sem at odio euismod venenatis eu nec neque</Header>
                            </Segment>
                            <Segment style={{boxShadow: 'unset', border: '0px'}}>
                                <Header as='h3' className='central' style={{width: '25vw', top: '10%', color: 'rgb(80,80,80)', fontWeight: '100'}}>What are you looking for...</Header>
                                <Input 
                                    // label={{ basic: true, content: 'kg' }}
                                    className='central main-search' 
                                    action={{ icon: 'search', className: 'outline-sign bg-sign bg-sign-hvr', style:{color: 'white'}}}
                                    // icon='search' 
                                    size='huge'
                                    placeholder='Search...' 
                                    style={{top: 'calc(10% + 35px)', width: '25vw'}}
                                    onChange={(e)=>{this.setState({keyword: e.target.value})}}
                                    onKeyPress={this.handleKeyPress}
                                />
                            </Segment>
                            <Segment style={{boxShadow: 'unset', border: '0px'}}>
                                <Image src='https://react.semantic-ui.com/images/leaves/4.png' 
                                    className='central'
                                    style={{width: 150, height: 150, top: '15%', left: '38%'}}
                                />
                                <Image
                                    src='https://react.semantic-ui.com/images/leaves/1.png'
                                    className='central'
                                    style={{width: 150, height: 150, top: '5%', left: '60%'}}
                                />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                
                <Header style={{marginTop: '50px', fontSize: '27px', color: 'rgb(50,50,50)'}}>Categories</Header>
                <Grid columns={3}>
                    <Grid.Column style={{padding: '15px 30px 15px 10px'}}>
                    <Image className='home-ribbon'
                        fluid
                        label={{
                        as: 'a',
                        content: 'Bag',
                        icon: 'spoon',
                        ribbon: true,
                        }}
                        src='https://cdn.shopify.com/s/files/1/1535/5361/products/Good_Quality_Men_s_Messenger_Bags_Genuine_Leather_Travel_Bag_Luxury_Outdoor_Camping_Style_Bags_9042_17_703d2524-7f7a-4a76-877e-aa9e48a31ad8_1024x1024.jpg?v=1571609258'
                    />
                    </Grid.Column>

                    <Grid.Column style={{padding: '15px 30px'}}>
                    <Image className='home-ribbon'
                        fluid
                        label={{
                        as: 'a',
                        content: 'Fashion',
                        icon: 'hotel',
                        ribbon: true,
                        }}
                        src='https://manofmany.com/wp-content/uploads/2018/04/Business-Casual-Dress-Code-Guide-for-Men.jpg'
                    />
                    </Grid.Column>

                    <Grid.Column style={{padding: '15px 10px 15px 30px'}}>
                    <Image className='home-ribbon'
                        fluid
                        label={{
                        as: 'a',
                        content: 'Food',
                        icon: 'spoon',
                        ribbon: true,
                        }}
                        src='https://www.japan-guide.com/thumb/interest_food.jpg'
                    />
                    </Grid.Column>
                </Grid>


                <Header style={{marginTop: '50px', fontSize: '27px',color: 'rgb(50,50,50)'}}>Our best products</Header>
                <div className='home-product-list'>
                    {this.renderProducts()}
                </div>

                {
                    this.state.redirect?
                    <Redirect to={`/search/${this.state.keyword}`} />
                    : null
                }
            </Container>

         );
    }
}
 
export default Home;