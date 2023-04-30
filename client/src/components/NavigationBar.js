import React,{useContext,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {userContext} from '../App'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const NavigationBar =()=>{
    const history=useHistory()
    const  {state,dispatch}=useContext(userContext)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
    const logOut=()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        toast.success( "Logged out Successfully",{
                        position:"top-right"
                    })
        history.push('/signin')
    }

    const fetchUsers = (query)=>{
        setSearch(query)
        // console.log(search)
        if(query!=""){
            fetch('/search-users',{
              method:"post",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({
                query
              })
            }).then(res=>res.json())
            .then(results=>{
              setUserDetails(results.user)
              console.log(results.user)
            })}
     }

    const renderList=()=>{
        if(state){
            return (
                <>
                  <li className="nav-item" style={{marginRight:"15px" , marginTop : '10px'}}>
                    <i className="material-icons" data-toggle="modal" data-target="#exampleModalLong">search</i> 
                  </li>
                  <li className="nav-item" style={{marginRight:"15px"}}>
                    <Link className="nav-link" to="/feed">My Feed <span className="sr-only">(current)</span></Link>
                  </li>
                  <li className="nav-item" style={{marginRight:"15px"}}>
                    <Link className="nav-link" to="/profile">Profile</Link>
                  </li>
                  <li className="nav-item" style={{marginRight:"15px"}}>
                    <Link className="nav-link" to="/create">Create Post</Link>
                  </li>
                  <li className="nav-item" style={{marginRight:"15px"}}>
                      <Link className="nav-link" onClick={logOut} ><i className="material-icons">input</i> </Link>
                  </li>

                    <div className="modal fade " id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                      <div className="modal-dialog" role="document" style={{pointerEvents: "all"}}>
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Search Users </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <input type="text"
                            placeholder="Type user email here"
                            value={search}
                            onChange={(e)=>fetchUsers(e.target.value)}
                             className="form-control"  aria-describedby="emailHelp" 
                            
                            style={{margin:"15px auto"}}/>
                          </div>
                              
                              
                          <div className="list-group">
                              <ul className="collection">
                               {
                                    userDetails.map(item=>{
                                     return <div><button type="button"  class="custom-btn btn-16 " style={{width:"90%" ,color:""}}>
                                            <a  href={`/profile/${item._id}`}>{item.email}</a>
                                     </button></div>
                                   })
                                }
                               
                              </ul>
                          </div>
                          <div className="modal-footer">
                            <button type="button"  className="btn btn-secondary" onClick={()=>setSearch('')} data-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
              </>
              )
        }else{
            return (
                <>
                  
                <li className="nav-item active" style={{marginRight:"15px"}}>
                    <Link className="nav-link" to="/signin">Sign In <span className="sr-only">(current)</span></Link>
                  </li>
                  <li className="nav-item" style={{marginRight:"15px"}}>
                    <Link className="nav-link" to="/signup">Sign Up</Link>
                  </li>
                    



                </>
                )
        }
    }
    
    return (
        <>
        <nav className="navbar navbar-expand-lg  ml-15" style={{background :"#C7C4C9"}}>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span ><i className="material-icons">dehaze</i></span>
          </button>
          <div style={{height:"65px"}}>
          <Link className="navbar-brand brandTransition" to="/"><h1>Insta</h1></Link>
          </div>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0 " >
              {renderList()}
            </ul>
          </div>
        </nav>
        
        <ToastContainer
            />
        </>

    )
}

export default NavigationBar


