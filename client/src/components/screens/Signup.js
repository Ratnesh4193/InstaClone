import React,{useState} from 'react'
import {Link,useHistory} from 'react-router-dom' 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login =()=>{
    const history=useHistory()
    const [user, setUser] = useState({
        name:"",email:"",password:""
    });
    const [image,setImage]=useState("")
    const [url,setUrl]=useState(undefined)
    
    function changeDetect(e){
        const {name,value}=e.target;
        setUser((prev)=>{
           return {...prev ,[name]:value};
        })
    }
    const postData=()=>{
        if(image){
            uploadPic()
        }
        const {name,email,password}=user
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            toast.error("Enter Valid Email",{
                        position:"top-right"
                    })
        }
        else
        {
            fetch('/signup',{
                method:"post",
                headers:{
                    "Content-Type":"application/json"   
                },
                body:JSON.stringify({
                    name,email,password,profilePic:url
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

    const uploadPic=()=>{
        const data = new FormData();
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","rkt4193")
        fetch("https://api.cloudinary.com/v1_1/rkt4193/image/upload",{
            method:"POST",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        }).catch(err=>{console.log(err);return })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
              <h1 style={{fontSize:"100px"}}>Insta</h1>
                <input type="text" placeholder="Name" name="name" value={user.name} onChange={changeDetect}
                 className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                style={{margin:"15px auto"}}/>
                
                <input type="email" placeholder="Email" name="email" value={user.email} onChange={changeDetect}
                 className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" 
                style={{margin:"15px auto"}}/>
                
                <input type="password" placeholder="password" name="password" value={user.password} onChange={changeDetect}
                 className="form-control" id="exampleInputEmail3" aria-describedby="emailHelp" 
                style={{margin:"15px auto"}}/>


                <div className="input-group mb-3">
                  
                  <div className="custom-file">
                    <input type="file" className="custom-file-input" onChange={(e)=>{setImage(e.target.files[0])}} id="inputGroupFile01" />
                    <label className="custom-file-label" for="inputGroupFile02">Upload Profile Pic</label>
                  </div>
                </div>

                
                <button className="custom-btn btn-15"
                style={{margin:"15px 100px"}}
                onClick={postData}
                >
                    Sign Up
                </button>
              
              <div style={{display: "flex",justifyContent:'space-evenly'}}>
                  <div><Link to='/signin'><h6 >Already have an Account! </h6></Link></div>
                  <div ><Link to='/reset' ><h6 style={{color:"red"}}>Forgot Password?</h6></Link></div>
              </div>
            </div>
            <ToastContainer
            />
        </div>
    )
}

export default Login