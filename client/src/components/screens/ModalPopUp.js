import React from 'react'
const ModalPopUp =(props)=>{
    console.log(props.userDetails)
    return (
        <>
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
                                     return (<>
                                                <a href={`/profile/${item._id}`}>
                                                <div class="custom-btn btn-16 " style={{width:"90%" ,padding:"2px",display :"flex",}}>
                                                    
                                                    <img style={{margin:"0px 10px",width:"30px" , height:"30px" ,borderRadius:"15px"}} src={item?item.profilePic:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} alt="Image"/>
                                                    <h5 style={{fontSize:"16px",margin:"5px 5px" ,fontWeight:"1000"}}>{item.name}</h5>
                                                    <p style={{fontSize:"13px",margin:"5px 5px"}}>{item.email}</p>
                                                
                                                </div>
                                                </a>
                                            </>
                                            )
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
                    </>)
}

export default ModalPopUp