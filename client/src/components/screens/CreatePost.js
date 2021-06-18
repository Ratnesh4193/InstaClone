import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom' 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CreatePost =()=>{
    const history=useHistory()
    const [post, setPost] = useState({
        title:"",body:""
    });
    const [image,setImage]=useState({})
    const [url,setUrl]=useState("")
    
    useEffect(()=>{
        if(url){
                const {title,body}=post
                fetch('/createpost',{
                    method:"post",
                    headers:{
                        "Content-Type":"application/json" ,
                        "Authorization":"Bearer "+localStorage.getItem("jwt")  
                    },
                    body:JSON.stringify({
                        title,body,url
                    })
        
                }).then(res=>res.json())
                .then(data=>{
                    if(data.error){
                        toast.error(data.error,{
                        position:"top-right"
                    })
                    }
                    else{
                        toast.success( data.message,{
                        position:"top-right"
                    })
                        history.push("./")
                    }
                }).catch(err=>{console.log(err)})}
    },[url])

    function changeDetect(e){
        const {name,value}=e.target;
        setPost((prev)=>{
           return {...prev ,[name]:value};
        })
    }

    const postImage=()=>{
        const data = new FormData();
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","rkt4193")
        fetch("https://api.cloudinary.com/v1_1/rkt4193/image/upload/",{
            method:"POST",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        }).catch(err=>{console.log(err);return })
    }
    return (
        <>
        <div className="card home-card"
       style={{
           margin:"30px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
       }}
       >
        <h1 style={{fontSize:"100px"}}>Insta</h1>
            
            <input type="text"
            placeholder="title"
            name="title"
            value={post.title}
            onChange={(e)=>changeDetect(e)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
            style={{margin:"15px auto"}}
            autocomplete="off"
            />
           
           <input
            type="text"
            name="body"
             placeholder="body"
             value={post.body}
            onChange={(e)=>changeDetect(e)}
            className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" 
            style={{margin:"15px auto"}}
            autocomplete="off"
            />

            <div className="input-group mb-3">
                  
                  <div className="custom-file">
                    <input type="file" className="custom-file-input"onChange={(e)=>{
                            setImage(e.target.files[0])
                             
                         }} id="inputGroupFile01" />
                    <label className="custom-file-label" for="inputGroupFile02">Upload image</label>
                  </div>
                </div>

           
            <button className="custom-btn btn-15"
            style={{margin:"0px auto ", width:"150px"}}
            onClick={()=>postImage()}
            
            >
                Submit post
            </button>
            <ToastContainer
            />
       </div>
</>
        // <Card style={{maxWidth:"550px",margin:"30px auto", padding:'20px', textAlign:'center' }}>
        //   <Card.Img variant="top" src="holder.js/100px180" />
        //   <Card.Body>
        //     <Card.Title>Card Title</Card.Title>
        //     <Card.Text>
        //       Some quick example text to build on the card title and make up the bulk of
        //       the card's content.
        //     </Card.Text>

        //     <Button variant="primary">Go somewhere</Button>
        //   </Card.Body>
        // </Card>


       
    )
}

export default CreatePost




// <Form.Group controlId="formFile" className="mb-3">
//     <Form.Label>Default file input example</Form.Label>
//     <Form.Control type="file" />
//   </Form.Group>