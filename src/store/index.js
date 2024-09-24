import { createContext,useContext,useMemo,useReducer } from "react";
import auth from "@react-native-firebase/auth"
import firestore from '@react-native-firebase/firestore';
import { Alert } from "react-native";

const MyContext = createContext()
MyContext.displayName = "vbdvabv"
const reducer = (state,action)=>{
    switch(action.type) {
        case "USER_LOGIN":
            return {...state,userLogin: action.value}
        case "LOGOUT":
            return {...state,userLogin: null}
        default:
            return new Error("Action not found")
            break;
    }
}
const MyContextControllerProvider = ({children}) => {
    const initialState = {
        userLogin: null,
        services: [],
    }
    const [controller, dispatch] = useReducer(reducer, initialState)
    const value = useMemo(()=>[controller,dispatch], [controller, dispatch])
    return(
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    )
}
//Dinh nghia useMyContextController
const useMyContextController = () => {
    const context = useContext(MyContext);
    if (context == null)
      return new Error("useMyContextController must inside in MyContextControllerProvider");
    return context;
  }
  
  //Dinh nghia cac action
  const USERS = firestore().collection("USERS");
  
  const login = (dispatch, email, password) => {
    auth().signInWithEmailAndPassword(email, password)
      .then(response => 
        USERS.doc(email)
          .onSnapshot(u => dispatch({ type: "USER_LOGIN", value: u.data() }))
      )
      .catch(e => Alert.alert("Sai email va password"));
  }
  
  const logout = (dispatch) => {
    auth().signOut()
      .then(() => dispatch({ type: "LOGOUT" }));
  }
  
  export {
    MyContextControllerProvider,
    useMyContextController,
    login,
    logout
  }
  