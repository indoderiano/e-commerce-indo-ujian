import React, { useState } from 'react'
import { Card, Input, Button, Image, Label, Icon } from 'semantic-ui-react'
import { LoginSuccess, LoginFail, GiveNotif, RemoveNotif } from './../redux/actions'
import { connect } from 'react-redux'
import Axios from 'axios'
import { API_URL } from './../supports/ApiUrl'
import { Redirect } from 'react-router-dom'


const Login = (props) => {

    const [input,setinput]=useState({
        username:'',
        password:'',
        confirmpassword:''
    })
    const [isreg,setisreg]=useState(false)
    const [message,setmessage]=useState('')

    const onInputChange=(e)=>{
        setinput({...input,[e.target.name]:e.target.value})
        // console.log(input)
    }
    const handleKeypress=(e)=>{
        if(e.key==='Enter'){
            if(isreg){
                onRegisterClick()
            }else{
                onLoginClick()
            }
            // console.log('Enter pressed')
        }
    }
    const handleRegClick=()=>{
        setisreg(true)
    }

    const onRegisterClick=()=>{
        if(input.username===''){
            setmessage('username belum diisi')
        }else if(input.password===''){
            setmessage('password belum diisi')
        }else if(input.password!==input.confirmpassword){
            setmessage('confirm password gagal')
        }else{
            Axios.post(`${API_URL}/users`,{username: input.username, password: input.password, role: 'user'})
            .then((res)=>{
                // notif that acc is created succesfully
                props.GiveNotif('Create account succesfully')
                setTimeout(()=>{
                    props.RemoveNotif()
                },2000)
                // autologin
                Axios.get(`${API_URL}/users?username=${input.username}&password=${input.password}`)
                .then((res)=>{
                    if(res.data.length){
                        props.LoginSuccess({...res.data[0],errmes:'berhasil'})
                        localStorage.setItem('iduser',res.data[0].id)
                    }else{
                        props.LoginFail('Username atau password salah')
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    const onLoginClick=()=>{
        // console.log('berhasil')
        // props.LoginSuccess('testuser',1)
        // seterr('testerror')

        if(input.username===''||input.password===''){
            props.LoginFail('Username atau password tidak terisi')
            // console.log('username atau pass kosong')
        }else{
            Axios.get(`${API_URL}/users?username=${input.username}&password=${input.password}`)
            .then((res)=>{
                if(res.data.length){
                    props.LoginSuccess({...res.data[0],errmes:'berhasil'})
                    // console.log({...res.data[0],errmes:'berhasil'})
                    localStorage.setItem('iduser',res.data[0].id)
                }else{
                    props.LoginFail('Username atau password salah')
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    if(props.User.isLogin){
        return <Redirect to='/'/>
    }else{
        return ( 
            <div style={{
                            display:'flex',
                            flexDirection:'column',
                            alignItems:'center', 
                            backgroundSize:'cover', 
                            // background:'url(https://www.waldengalleria.com/wp-content/uploads/sites/3/2019/11/Shopping_Blog-Feature-Image.jpg) no-repeat center',
                            width:'100hw',
                            height:'calc(100vh - 56px)',
                            overflow:'hidden',
                            position:'relative'
                        }}>
                <div style={{width:'100%',height:'100%',position:'relative',zIndex:'0'}}>
                    <Image src='https://react.semantic-ui.com/images/leaves/5.png' 
                            className='central'
                            style={{
                                width: 150, 
                                height: 'auto', 
                                top: '23%', 
                                left: '37%',
                                transform: 'translate(-50%,-50%) rotate(50deg)'
                            }}
                    />
                    <div style={{background:'rgba(0, 0, 0, .0)',width:'100%',height:'100%',position:'absolute'}}></div>
                </div>
                {/* <form onSubmit={handleFormSubmit}> */}
                    <Card onKeyPress={handleKeypress} style={{padding:'15px',position:'absolute',top:'45%',transform:'translate(0,-50%)'}}>
                        {/* <Image src='/images/avatar/large/matthew.png' wrapped ui={false} /> */}
                        <Card.Content>
                        <Card.Header>
                            {
                                isreg?'Register':'Log In'
                            }
                        </Card.Header>
                        <Card.Meta>
                            {/* <span className='date'>Joined in 2015</span> */}
                        </Card.Meta>
                        <Card.Description>
                            {/* Matthew is a musician living in Nashville. */}
                        </Card.Description>
                            <div style={{marginTop:'15px'}}>
                                <p style={{marginBottom:'0px'}}>Username</p>
                                <Input 
                                    name='username' 
                                    onChange={onInputChange} 
                                    // onKeyPress={handleKeypress}
                                    value={input.username} 
                                    style={{display:'inline'}} 
                                    size='small' 
                                    icon='user' 
                                    placeholder='username...' 
                                />
                            </div>
                            <div style={{marginTop:'15px'}}>
                                <p style={{marginBottom:'0px'}}>Password</p>
                                <Input name='password' 
                                    onChange={onInputChange} 
                                    value={input.password} 
                                    size='small' 
                                    icon='lock' 
                                    placeholder='password...' 
                                    type='password'
                                />
                            </div>
                            <div className={isreg?'login-reg-confirm-pass':'login-reg-confirm-pass gone'}>
                                <p style={{marginBottom:'0px'}}>Confirm password</p>
                                <Input name='confirmpassword' 
                                    onChange={onInputChange} 
                                    value={input.confirmpassword} 
                                    size='small' 
                                    icon='lock' 
                                    placeholder='confirm password...' 
                                    type='password'
                                />
                            </div>
                        </Card.Content>
                        <Card.Content style={{position:'relative', overflow: 'hidden'}} extra>
                        {
                            props.User.errmes&&!isreg?
                            <p style={{color:'red'}}>{props.User.errmes}</p>
                            :
                            null
                        }
                        {
                            message&&isreg?
                            <p style={{color:'red'}}>{message}</p>
                            :
                            null
                        }
                        {/* <Label onClick={()=>{setisreg(false)}} className={isreg?'login-back':'login-back gone'} floating>
                            <Icon name='arrow left'/>back
                        </Label> */}
                        </Card.Content>
                        <Button 
                            className={isreg?'login-button outline-sign outline-sign-hvr':'bg-sign bg-sign-hvr login-button'} 
                            onClick={isreg?()=>{setisreg(false)}:onLoginClick} 
                            // content={isreg?'<':'Login'} 
                            primary 
                        >
                            {
                                isreg?
                                // <Icon style={{fontSize: '12px', height:'0'}} name='arrow left'/>
                                'Back to login'
                                :
                                'Login'
                            }
                        </Button>
                        <Button style={{marginTop: '5px'}} 
                            className={isreg?'bg-sign-sec-hvr':'outline-sign-sec-hvr'}
                            onClick={isreg?onRegisterClick:handleRegClick}
                            content={isreg?'Create new account':'Register'}
                            
                        />
                    </Card>
                {/* </form> */}
            </div>
        )
    }
} 

const MapstatetoProps=(state)=>{
    return {
        User:state.Auth
    }
}

export default connect(MapstatetoProps,{LoginFail,LoginSuccess,GiveNotif,RemoveNotif})(Login)