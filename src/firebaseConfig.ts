import { resolve } from 'dns'
import * as firebase from 'firebase'





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
