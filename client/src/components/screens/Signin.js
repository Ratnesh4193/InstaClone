import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom' 
import {userContext} from "../../App"


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signin =()=>{
    const {dispatch}=useContext(userContext);


    const history=useHistory()
    const [user, setUser] = useState({
        email:"",password:""
    });
    
    function changeDetect(e){
        const {name,value}=e.target;
        setUser((prev)=>{
           return {...prev ,[name]:value};
        })
    }
    const postData=()=>{
        const {email,password}=user
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            toast.error("Enter Valid Email",{
                        position:"top-right"
                    })
        }
        else
        {
            fetch('/signin',{
                method:"post",
                headers:{
                    "Content-Type":"application/json"   
                },
                body:JSON.stringify({
                    email,password
                })
    
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    toast.error(data.error,{
                        position:"top-right"
                    })
                }
                else{
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    toast.success(data.message,{
                        position:"top-right"
                    })
                    history.push("./")
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
              <input type="password"
                placeholder="Enter your password"
                name="password"
                onChange={changeDetect} className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" 
                style={{margin:"15px auto"}}/>
              <button className="custom-btn btn-15" onClick={postData} style={{margin:"15px 100px"}}>   Sign In   </button>
              <div style={{display: "flex",justifyContent:'space-evenly'}}>
                  <div><Link to='/signup'><h6 >Create an account </h6 ></Link></div>
                  <div><Link to='/reset'><h6 style={{color:"red"}}>Forgot Password?</h6 ></Link></div>
              </div>
            </div>

            <ToastContainer
            />
        </div>
    )
}

export default Signin