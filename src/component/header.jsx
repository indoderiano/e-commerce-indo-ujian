import React, {Component} from 'react'
import { Menu, Icon, Label, Input } from 'semantic-ui-react'
import { GiveNotif, RemoveNotif, LogOut } from './../redux/actions'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class Header extends Component {

    state = {   
                activeItem: 'E-Commerce',
                redirect: '',
                keyword: ''
            }

    // componentDidMount=()=>{
    //     console.log(this.props.User)
    // }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name , redirect: name})

    handleKeyword=(e)=>{
        this.setState({keyword: e.target.value})
    }
    handleKeyPress=(e)=>{
        if(e.key==='Enter'){
            this.setState({redirect: 'search'})
        }
    }

    onLoginClick=()=>{
        this.setState({redirect: true, activeItem: ''})
    }

    onLogoutClick=()=>{
        // this.handleItemClick()
        console.log('logout klik')
        this.props.LogOut()
        localStorage.removeItem('iduser')
        this.props.GiveNotif('Logout Berhasil')
        setTimeout(()=>{
            if(this.props.Modal.isOpen){
                this.props.RemoveNotif()
                // console.log('timeout exc')
            }
        },2000)
        this.setState({ activeItem: 'logout', redirect: 'logout' })

        // return <Redirect to='/'/>
    }

    render() { 
        const { activeItem } = this.state
        return ( 
            <div style={{position:'fixed', top:'0', left:'0', zIndex:'2', width:'100%', background:'white'}}>
                <Menu className='header-menu' pointing secondary color='green'>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        onClick={this.handleItemClick}
                        style={{
                            color:'rgb(50,50,50)', 
                            fontSize:'18px', 
                            fontWeight: '400'
                        }}
                    >
                        <Icon className='color-sign' style={{fontSize:'30px'}} name='podcast'/>
                        E-Commerce
                        {/* <Menu.Item style={{
                            color:'rgb(50,50,50)', 
                            fontSize:'21px', 
                            fontWeight: '400',
                            padding: '0!important'
                        }}>E-Commerce</Menu.Item> */}
                    </Menu.Item>
                    <Menu.Item>
                        <Input 
                            // label={{ basic: true, content: 'kg' }}
                            className='page-search' 
                            // action={{onClick:this.onSearchBtn, icon: 'search', className: 'no', style:{color: 'white'}}}
                            icon='search' 
                            size='small'
                            placeholder='Search...' 
                            style={{ width: '25vw', marginBottom: '2px'}}
                            onChange={this.handleKeyword}
                            value={this.state.keyword}
                            onKeyPress={this.handleKeyPress}
                        />
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        {
                            // go to cart
                            this.props.User.role==='user'?
                            <Menu.Item
                                icon='cart'
                                name='cart'
                                active={activeItem === 'cart'}
                                onClick={this.handleItemClick}
                                // style={{height:'60px'}}
                            />
                            : null
                        }
                        {
                            // go to manage transactions
                            this.props.User.role==='admin'?
                            <Menu.Item
                                name='manage transactions'
                                active={activeItem === 'manage transactions'}
                                onClick={this.handleItemClick}
                                // style={{height:'60px'}}
                            />
                            : null
                        }
                        {
                            // go to manage products
                            this.props.User.role==='admin'?
                            <Menu.Item
                                name='manage products'
                                active={activeItem === 'manage products'}
                                onClick={this.handleItemClick}
                                // style={{height:'60px'}}
                            />
                            : null
                        }
                        {
                            // profile user
                            this.props.User.isLogin?
                            <Menu.Item style={{verticalAlign:'text-bottom'}}>
                                <img alt={this.props.User.role} style={{borderRadius:'20px', marginRight: '5px', width: '27px', height: 'auto'}} src='https://react.semantic-ui.com/images/avatar/small/joe.jpg'/>
                                <p style={{verticalAlign:'text-bottom', margin:'0'}}>{this.props.User.username}</p>
                                {
                                    this.props.User.role==='admin'?
                                    <Label color='orange'>
                                        {this.props.User.role}
                                    </Label>
                                    : null
                                }
                            </Menu.Item>
                            : null
                        }
                        {
                            // login/logout
                            this.props.User.isLogin?
                            <Menu.Item
                            name='logout'
                            active={activeItem === 'logout'}
                            onClick={this.onLogoutClick}
                            />
                            :
                            <Menu.Item
                            name='login'
                            active={activeItem === 'login'}
                            onClick={this.handleItemClick}
                            />

                        }
                    </Menu.Menu>
                    </Menu>

                    {
                        this.state.redirect==='home'?
                        <Redirect to='/'/>
                        : null
                    }
                    {
                        this.state.redirect==='manage transactions'?
                        <Redirect to='/managetransactions'/>
                        : null
                    }
                    {
                        this.state.redirect==='manage products'?
                        <Redirect to='/manageproducts'/>
                        : null
                    }
                    {
                        this.state.redirect==='cart'?
                        <Redirect to='/cart'/>
                        : null
                    }
                    {
                        this.state.redirect==='login'?
                        <Redirect to='/login'/>
                        : null
                    }
                    {
                        this.state.redirect==='logout'?
                        <Redirect to='/'/>
                        : null
                    }
                    {
                        this.state.redirect==='search'?
                        <Redirect to={`/search/${this.state.keyword}`} />
                        : null
                    }
                    
            </div>
         );
    }
}

const MapstatetoProps=(state)=>{
    return {
        User:state.Auth,
        Modal:state.Modal
    }
}
 
export default connect(MapstatetoProps, {GiveNotif, RemoveNotif, LogOut}) (Header);