import React,{useState,useEffect,useContext} from 'react'
import {useParams} from 'react-router-dom'
import {userContext} from '../../App'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from 'react-router-dom'


const Profile =()=>{
    const [userProfile,setProfile] = useState(null)
    const [showFollow,setfollow]=useState(true)
    const {state,dispatch}=useContext(userContext)
    const [image,setImage]=useState({})
    const [url,setUrl]=useState("")
    const {userId}=useParams()
    useEffect(()=>{
       fetch(`/profile/${userId}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
        setProfile(result)

        if(state && result.user.followers.includes(state._id) ) setfollow(false)
       })

    },[])

    const followUser = () => {

        fetch('/follow', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    followId: userId,

                })

            }).then(res => res.json())
            .then(result => {
                setProfile((prev)=>{
                    return {
                        ...prev,
                        user:{
                            ...prev.user,
                            followers:[...(prev.user.followers),result._id]
                        }
                    }
                })
                dispatch({type:"UPDATE",payload:{
                    following:result.following,
                    followers:result.followers
                }
                })
                localStorage.setItem("user",JSON.stringify(result))
                setfollow(false)

            }).catch(err => { console.log(err) })

    }
    const unFollowUser = () => {

        fetch('/unfollow', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    unFollowId: userId,

                })

            }).then(res => res.json())
            .then(result => {
                setProfile((prev)=>{
                    const newFollowers=prev.user.followers.filter((id)=>{
                        return id!==result._id 
                    })
                    return {
                        ...prev,
                        user:{
                            ...prev.user,
                            followers:newFollowers
                        }
                    }
                })
                dispatch({type:"UPDATE",payload:{
                    following:result.following,
                    followers:result.followers
                }
                })
                localStorage.setItem("user",JSON.stringify(result))
                setfollow(true)

            }).catch(err => { console.log(err) })

    }

     useEffect(()=>{
        if(image){
                postImage()
            }
                
    },[image])

     useEffect(()=>{
        if(url){
            fetch('/updateProfilePic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json" ,
                        "Authorization":"Bearer "+localStorage.getItem("jwt")  
                    },
                    body:JSON.stringify({
                        url
                    })
        
                }).then(res=>res.json())
                .then(data=>{
                    if(data.error){
                        toast.error(data.error,{
                        position:"top-right"
                    })
                    }
                    else{
                        toast.success("Profile Pic Updated Successfully",{
                        position:"top-right"
                    })

                        setProfile((prev)=>{
                            return {
                                ...prev,
                                user:data
                            }
                        })
                    }
                }).catch(err=>{console.log(err)})}
                
     },[url])

    const postImage=()=>{
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

        userProfile?
        (
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{margin:"18px 0px" ,borderBottom:"1px solid grey"}}>
            <div style={{display:"flex" , justifyContent:"space-around" }}>
                <div>
                    <img style={{width:"160px" , height:"160px" ,borderRadius:"80px"}} src={userProfile?userProfile.user.profilePic:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} alt="Image"/>
                </div>
        
                <div style={{margin:"0px auto"}}>
                    <h4 style={{textAlign: "center",margin:"10px auto"}}>{userProfile?userProfile.user.name:"Loading.."}</h4>
                    <h6 style={{textAlign: "center",margin:"10px auto"}}>{userProfile?userProfile.user.email:"Loading.."}</h6>
                    <div style={{display :"flex"}}>
                        <h6 style={{textAlign: "center",margin:"10px 5px"}}>{userProfile.posts.length} posts</h6>
                        <h6 style={{textAlign: "center",margin:"10px 5px"}}>{userProfile.user.followers.length} followers</h6>
                        <h6 style={{textAlign: "center",margin:"10px 5px"}}>{userProfile.user.following.length} following</h6>

                    </div>
                    <div style={{textAlign: "center",margin:"10px auto"}}>
                        

                    {(state && userProfile.user._id!==state._id)&&(showFollow?
                    <button className="btn btn-primary" onClick={followUser} >   Follow   </button>
                    :<button className="btn btn-danger" onClick={unFollowUser} >   Following   </button>)
                    }
                    </div>
                </div>
            </div>
                    
            {(state && userProfile.user._id===state._id)&&(
                <>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Update Profile Pic</span>
                  </div>
                  <div className="custom-file">
                    <input type="file" className="custom-file-input"onChange={(e)=>{
                            setImage(e.target.files[0])
                             
                         }} id="inputGroupFile01" />
                    <label className="custom-file-label" for="inputGroupFile02">Upload image</label>
                  </div>
                </div>
                </>)
            }
            </div>
            <div className="gallery" >
                {
                    userProfile.posts.map((post)=>{
                        return (
                            <>
                            <Link to={`/feed/${userProfile.user._id}`}>

                                <div className="item">
                                <div className="card" style={{width: "10rem"}}>
                                  <img  key={post._id} className="card-img-top" src={post.photo} alt="image"/>
                                  <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{post.body}</p>
                                  </div>
                                </div>
                                </div>

                                {/*<img style={{marginTop:"5px" }} key={post._id} className="card-img-top" src={post.photo} alt="image"/>
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.body}</p>*/}
                                </Link>
                            </>
                            )
                    })
                }
            </div>  
            <ToastContainer
            />  
        </div>

        )
        :(<div style={{textAlign:"center", padding: "100px 0"}}><h1 >Loading..</h1></div>)

    )
}

export default Profile



{/*{(state && userProfile.user._id===state._id)&&(*/}