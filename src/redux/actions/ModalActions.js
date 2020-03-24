export const GiveNotif=(message)=>{
    return {
        type: 'NOTIF_ON',
        payload: message
    }
}

export const RemoveNotif=()=>{
    return {
        type: 'NOTIF_OFF'
    }
}