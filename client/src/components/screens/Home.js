import React, { useState, useEffect, useContext } from 'react'
import { userContext } from '../../App'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])
    const { state } = useContext(userContext)
    useEffect(() => {
        fetch('/allpost', {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {

        fetch('/like', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    postId: id,

                })

            }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)

            }).catch(err => { console.log(err) })

    }
    const disLikePost = (id) => {

        fetch('/dislike', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    postId: id,

                })

            }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => { console.log(err) })

    }
    const makeComment = (text, postId) => {
        fetch('/comment', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    postId,
                    text
                })
            }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
                method: "delete",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res => res.json())
            .then(result => {
                toast.error("Post deleted Successfully",{
                        position:"top-right"
                    })
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }
    const deleteComment = (postid,commentId) => {
        fetch(`/deletecomment/${postid}/${commentId}`, {
                method: "delete",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res => res.json())
            .then(result => {
                toast.error("Comment deleted Successfully",{
                        position:"top-right"
                    })
                console.log("here")
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
    }
    const sort_array=(arr)=>{
        arr.sort(function(a, b) {
          var keyA = a.createdAt,
            keyB = b.createdAt;
          // Compare the 2 dates
          if (keyA > keyB) return -1;
          if (keyA < keyB) return 1;
          return 0;
        });
    }
    return (
        <div className="home">
            
                {
                    data.map((post)=>{
                        return (
                            <>
                                <div className="card home-card">
                                <div className="card " style={{maxWidth: "500px",margin: "26px auto",height: "max-content"}}>
                            <div key={post._id}>

                            <h5 style={{padding:"5px"}}><Link to={`/profile/${post.postedBy._id}`}>
                            <img style={{margin:"0px 10px",width:"40px" , height:"40px" ,borderRadius:"20px"}} src={post.postedBy?post.postedBy.profilePic:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} alt="Image"/>
                            {post.postedBy.name}

                            </Link>
                            {
                                (state._id===post.postedBy._id) && 
                                (<i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(post._id)}>delete</i> )
                                
                            }
                            
                            </h5>
                                  <img className="card-img-top" src={post.photo} alt="img" />
                                  <div className="card-body">
                                  <i className="material-icons" style={{color:"red"}}>favorite</i>
                                        {post.likes.includes(state._id) ?
                                    <i className="material-icons" onClick={()=>disLikePost(post._id)}>thumb_down</i>
                                        :
                                    <i className="material-icons" onClick={()=>likePost(post._id)}>thumb_up</i>
                                    }

                                    <h6>{post.likes.length} likes</h6>
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{post.body}</p>
                                    {sort_array(post.comments)}
                                    
                                    {
                                    post.comments.map(record=>{
                                        return (
                                            <h6 key={record._id}><span style={{fontWeight :'500'}}><Link to={`/profile/${record.postedBy._id}`}>
                                            <img style={{margin:"0px 10px",width:"40px" , height:"40px" ,borderRadius:"20px"}} src={record.postedBy?record.postedBy.profilePic:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} alt="Image"/>
                                            {record.postedBy.name}
                                            </Link></span> {record.text}
                                            {
                                                (state._id===record.postedBy._id) && 
                                                (<i className="material-icons" style={{float:"right"}} onClick={()=>deleteComment(post._id,record._id)}>delete</i> )
                                                
                                            }
                                            </h6>
                                            )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,post._id)
                                    e.target[0].value=""
                                }}>
                                <input type="text" placeholder="Write comment" name="comment" autocomplete="off"
                                     className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                                    style={{margin:"15px auto"}}/>
                                </form>
                                  </div>
                                </div>

                                </div>
                                </div>
                            </>
                            
                            )
                    })}
           <ToastContainer
            />
            
        </div>
    )
}

export default Home


{/*<div className="card home-card">
                            <div key={post._id}>

                            <h5 style={{padding:"5px"}}><Link to={`/profile/${post.postedBy._id}`}>{post.postedBy.name}</Link>
                            {
                                (state._id===post.postedBy._id) && 
                                (<i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(post._id)}>delete</i> )
                                
                            }
                            
                            </h5>
                            <Card.Img variant="top" src={post.photo} alt="img"/>
                           
                              <Card.Body>
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {post.likes.includes(state._id) ?
                                <i className="material-icons" onClick={()=>disLikePost(post._id)}>thumb_down</i>
                                :

                                <i className="material-icons" onClick={()=>likePost(post._id)}>thumb_up</i>
                                 }

                                 <h6>{post.likes.length} likes</h6>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>
                                  {post.body}
                                </Card.Text>

                                {
                                    post.comments.map(record=>{
                                        return (
                                            <h6 key={record._id}><span style={{fontWeight :'500'}}><Link to={`/profile/${record.postedBy._id}`}>{record.postedBy.name}</Link></span> {record.text}
                                            {
                                                (state._id===record.postedBy._id) && 
                                                (<i className="material-icons" style={{float:"right"}} onClick={()=>deleteComment(post._id,record._id)}>delete</i> )
                                                
                                            }
                                            </h6>
                                            )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,post._id)
                                    e.target[0].value=""
                                }}>
                                <Form.Control type="text" placeholder="Write comment"  />
                                </form>
                              </Card.Body>


                            </div>
                             </div>*/}