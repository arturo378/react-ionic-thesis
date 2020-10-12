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



firebase.initializeApp(config)


export function getCurrentUser() {
    return new Promise((resolve, reject)=> {
        const unsubscribe =firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                resolve(user)
                unsubscribe()
            }else{
                resolve()
            }
        })

    })
    
}

export function logoutUser() {
    return firebase.auth().signOut()
}

export async function loginUser(username: string, password: string) {

    const email = username
    try {
        const res = await firebase.auth().signInWithEmailAndPassword(email, password)

        
        return res
    }catch(error){
        console.log(error)
        return false
    }

   




} 