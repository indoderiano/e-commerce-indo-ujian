import React, {Component} from 'react'
import { Header, Image, Segment, Card, Icon, Container, Grid, Input, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Numeral from 'numeral'
import Axios from 'axios'
import { API_URL } from '../supports/ApiUrl'




class Search extends Component {
    state = { 
        products:[],
        keyword: '',
        header: 'All Product'
     }

     componentDidMount(){
         var keyword=this.props.match.params.keyword
        //  console.log(this.props.match.params.keyword)
         if(keyword){
            this.onSearch(keyword)
         }else{
             Axios.get(`${API_URL}/products?_expand=kategori`)
             .then((res)=>{
                this.setState({products:res.data})
             }).catch((err)=>{
                 console.log(err)
             })
         }
     }

    

    onSearch=(keyword)=>{
        this.setState({header: 'Results'})
        Axios.get(`${API_URL}/products?_expand=kategori&&name_like=${keyword}`)
        .then((res)=>{
            this.setState({products:res.data})
        }).catch((err)=>{
            console.log('error')
            console.log(err)
        })
    }

    onSearchBtn=()=>{
        // console.log(this.state.keyword)
        Axios.get(`${API_URL}/products?_expand=kategori&&name_like=${this.state.keyword}`)
        .then((res)=>{
            this.setState({products:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onCategoryClick=(key)=>{
        // console.log(key)
        if(key===1){
            this.setState({header: 'Fashion'})
        }else if(key===2){
            this.setState({header: 'Bags'})
        }else if(key===3){
            this.setState({header: 'Food'})
        }
        Axios.get(`${API_URL}/products?_expand=kategori&&kategoriId=${key}`)
        .then((res)=>{
            this.setState({products:res.data})
        }).catch((err)=>{
            console.log('error')
        })
    }

    handleSearch=(e)=>{
        this.setState({keyword: e.target.value})
        // this.onSearch()
        // console.log(e.target.value)
    }

    handleKeyPress=(e)=>{
        if(e.key==='Enter'){
            this.onSearch()
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
                    <Card.Header style={{color: 'rgba(0,0,0,.7)'}}>{val.name}</Card.Header>
                    <h5 as='h5' size='small' className='date color-sign-sec' style={{fontWeight:'bold', margin: '4px 0 0'}}>
                        Rp{Numeral(val.harga).format(0.0)}.00
                    </h5>
                    <Card.Meta>
                        <Icon style={{margin: '4px 3px 0 0', verticalAlign: '.5px'}} color='yellow' name='star'/>
                        {val.rating}
                    </Card.Meta>
                    <Card.Meta style={{marginTop:'4px'}}>
                        <Label style={{marginLeft: '0px'}}>Sold {val.sold}</Label>
                    {/* <span className='date' style={{color:'orange', fontWeight:'bold'}}>Rp.{val.harga}.00</span> */}
                    </Card.Meta>
                    {/* <Card.Description style={{letterSpacing: '1px'}}>
                        {val.deskripsi}
                    </Card.Description> */}
                    </Card.Content>
                    <Card.Content extra>
                        {
                            val.kategori.nama==='Fashion'?
                            <Icon name='student' />
                            :val.kategori.nama==='Bag'?
                            <Icon name='briefcase' />
                            :val.kategori.nama==='Food'?
                            <Icon name='food' />
                            : null
                        }
                        {/* <Icon name='shopping bag' /> */}
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

                <Header style={{marginTop: '50px', fontSize: '27px',color: 'rgb(50,50,50)'}}>Our best products</Header>
                
                    <Header as='h3' style={{width: '25vw', color: 'rgb(80,80,80)', fontWeight: '100'}}>What are you looking for...</Header>
                    <Input 
                        // label={{ basic: true, content: 'kg' }}
                        className='page-search' 
                        // action={{onClick:this.onSearchBtn, icon: 'search', className: 'no', style:{color: 'white'}}}
                        icon='search' 
                        size='huge'
                        placeholder='Search...' 
                        style={{ width: '25vw'}}
                        onChange={(e)=>{
                            this.onSearch(e.target.value)
                            this.handleSearch(e)
                        }}
                        value={this.state.keyword}
                        onKeyPress={this.handleKeyPress}
                    />

                    <div style={{marginTop:'14px'}}>
                    <Label onClick={()=>{this.onCategoryClick(1)}} className='bg-sign bg-sign-hvr' style={{fontSize: '21px', cursor: 'pointer'}}>
                        <Icon name='student' /> Fashion
                    </Label>
                    <Label onClick={()=>{this.onCategoryClick(2)}} className='bg-sign bg-sign-hvr' style={{fontSize: '21px', cursor: 'pointer'}}>
                        <Icon name='briefcase' /> Bags
                    </Label>
                    <Label onClick={()=>{this.onCategoryClick(3)}} className='bg-sign bg-sign-hvr' style={{fontSize: '21px', cursor: 'pointer'}}>
                        <Icon name='food' /> Food
                    </Label>
                    </div>

                    <Header as='h3' style={{width: '25vw', color: 'rgb(80,80,80)', fontWeight: '500', fontSize: '27px'}}>{this.state.header}</Header>

                <div className='home-product-list'>
                    {this.renderProducts()}
                </div>
            </Container>

         );
    }
}
 
export default Search;