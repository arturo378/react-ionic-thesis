import { resolve } from 'dns'
import * as firebase from 'firebase'


const config = {
    apiKey: "AIzaSyD4RlNnKl7zHleWWpf3aI8vGI4vAmDNAzI",
    authDomain: "thesis-6c5d6.firebaseapp.com",
    databaseURL: "https://thesis-6c5d6.firebaseio.com",
    projectId: "thesis-6c5d6",
    storageBucket: "thesis-6c5d6.appspot.com",
    messagingSenderId: "1019570880262",
    appId: "1:1019570880262:web:09d97e96a80524007b2887",
    measurementId: "G-VCL7H5V0YC"
}



const fire = firebase.initializeApp(config)

export default fire;


export function getCurrentUser() {
    return new Promise((resolve, reject)=> {
        const unsubscribe =fire.auth().onAuthStateChanged(function(user) {
            if(user){
                resolve(user)
                
            }else{
                resolve(null)
            }
            unsubscribe()
        })

    })
    
}

export function logoutUser() {

    return fire.auth().signOut()
   
}


export function getUserInfo() {
    return fire.auth().currentUser;
}

export async function loginUser(username: string, password: string) {

    const email = username
    try {
        const res = await fire.auth().signInWithEmailAndPassword(email, password)

        
        return res
    }catch(error){
        console.log(error)
        return false
    }

   




} 