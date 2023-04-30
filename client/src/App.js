import {useEffect,createContext,useReducer,useContext} from 'react';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import "./App.css"
import NavigationBar from  "./components/NavigationBar"
import Home from  "./components/screens/Home"
import Feed from  "./components/screens/Feed"
import Profile from  "./components/screens/Profile"
import UserProfile from  "./components/screens/UserProfile"
import UserFeed from  "./components/screens/UserFeed"
import Signin from  "./components/screens/Signin"
import Signup from  "./components/screens/Signup"
import CreatePost from  "./components/screens/CreatePost"
import ResetPassword from  "./components/screens/ResetPassword"
import NewPassword from  "./components/screens/NewPassword"


import {initialState,reducer} from './reducers/userReducer'
import 'bootstrap/dist/css/bootstrap.min.css';
export const userContext=createContext()

const Routing =()=>{
    
    const history=useHistory()
    const {dispatch}=useContext(userContext)

    useEffect(()=>{
        const user =JSON.parse( localStorage.getItem('user'))
        if(user){
            dispatch({type:"USER",payload:user})
        }
        else {
            if(!(history.location.pathname.startsWith('/reset')))
                history.push('/signin')
        }
    },[])
    return (
        <Switch>
            <Route path ='/' exact>
                <Home/>
            </Route>
            <Route path='/signup'>
                <Signup/>
            </Route>
            <Route path='/signin'>
                <Signin/>
            </Route>
            <Route path='/profile' exact>
                <Profile/>
            </Route>
            <Route path='/create'>
                <CreatePost/>
            </Route>
            <Route path='/profile/:userId'>
                <UserProfile/>
            </Route>
            <Route exact path='/feed'>
                <Feed/>
            </Route>
            <Route path='/feed/:userId'>
                <UserFeed/>
            </Route>
            <Route exact path='/reset'>
                <ResetPassword/>
            </Route>
            <Route path='/reset/:token'>
                <NewPassword/>
            </Route>
            NewPassword

        </Switch>
        )
}


function App() {
    const [state,dispatch]=useReducer(reducer,initialState);



  return (
    <userContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavigationBar/>
        <Routing/>
      </BrowserRouter>
    </userContext.Provider>
      
  );
}


//   return (
//         <NavBar/>
      
//   );
// }


export default App;
