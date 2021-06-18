import React,{useState,useContext} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom' 


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewPassword =()=>{
    const {token}=useParams()
    const history=useHistory()
    const [user, setUser] = useState({
        password:""
    });
    
    function changeDetect(e){
        const {name,value}=e.target;
        setUser((prev)=>{
           return {...prev ,[name]:value};
        })
    }
    const postData=()=>{
        const {password}=user
        
        fetch('/new-password',{
        method:"post",
        headers:{
            "Content-Type":"application/json"   
        },
        body:JSON.stringify({
            password,
            token
        })

        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                toast.error(data.error,{
                    position:"top-right"
                })
            }
            else{
                toast.success(data.message,{
                    position:"top-right"
                })
                history.push("/signin")
            }
        }).catch(err=>{console.log(err)})
        
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
              <h1 style={{fontSize:"100px"}}>Insta</h1>
              
              <input type="password"
                placeholder="Enter your New password"
                name="password"
                onChange={changeDetect} className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" 
                style={{margin:"15px auto"}}/>
              <button className="custom-btn btn-15" onClick={postData} style={{margin:"15px 100px"}}>   Reset password   </button>
              
            </div>

            <ToastContainer
            />
        </div>
    )
}

export default NewPassword