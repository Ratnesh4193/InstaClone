import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom' 


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword =()=>{


    const history=useHistory()
    const [user, setUser] = useState({
        email:""
    });
    
    function changeDetect(e){
        const {name,value}=e.target;
        setUser((prev)=>{
           return {...prev ,[name]:value};
        })
    }
    const postData=()=>{
        const {email}=user
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            toast.error("Enter Valid Email",{
                        position:"top-right"
                    })
        }
        else
        {
            fetch('/reset-password',{
                method:"post",
                headers:{
                    "Content-Type":"application/json"   
                },
                body:JSON.stringify({
                    email
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
                    history.push("./signin")
                }
            }).catch(err=>{console.log(err)})
        }
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
              <h1 style={{fontSize:"100px"}}>Insta</h1>
              <input type="email"
                placeholder="Enter your email"
                name="email"
                onChange={changeDetect} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                style={{margin:"15px auto"}}/>

              <button className="custom-btn btn-15" onClick={postData} style={{margin:"15px 100px"}}>   Send Link   </button>
              <h5><Link to='/signup'>Create an account</Link></h5>
            </div>

            <ToastContainer
            />
        </div>
    )
}

export default ResetPassword