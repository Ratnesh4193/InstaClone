import React,{useContext,useEffect} from 'react'
import {userContext} from '../../App'
import {useHistory,BrowserRouter,Route} from 'react-router-dom'
import UserProfile from  "./UserProfile"

const Profile =()=>{

    const {state}=useContext(userContext)

    const history=useHistory()

    useEffect(()=>{
        state && history.push(`/profile/${ state._id}`)
    },[])
    return (
            state &&
            (
                
                  <BrowserRouter>
                    <Route path='/profile/:userId'>
                        <UserProfile/>
                    </Route>
                  </BrowserRouter>
            )
            
        )
}

export default Profile