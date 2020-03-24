import React from 'react'
import { Button, Header, Modal, Label, List, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { RemoveNotif } from '../redux/actions'




const Logout=(testprops)=>{


    return (
        <Button className='test' style={{justifyContent: 'center'}} onClick={testprops.RemoveNotif}>
        <Modal style={{width: 'auto', textAlign: 'center'}} open={true} basic size='small'>
            {/* <Label basic inverted icon='checkmark' content={testprops.Modal.message} /> */}

            <List style={{fontSize: '18px'}}>
                <Icon name='checkmark'/>
                {testprops.Modal.message}
            </List>
            {/* <Modal.Content>
            <p>
                Your inbox is getting full, would you like us to enable automatic
                archiving of old messages?
            </p>
            </Modal.Content> */}
            <Button style={{fontWeight: 100}} size='medium' onClick={testprops.RemoveNotif} basic inverted>
                Ok
            </Button>
        </Modal>
        </Button>
    )


}

const MapstatetoProps=(state)=>{
    return {
        Modal: state.Modal
    }
}

export default connect(MapstatetoProps, {RemoveNotif}) (Logout)