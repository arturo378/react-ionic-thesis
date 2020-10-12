import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLoading } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { loginUser } from '../firebaseConfig';
import { toast } from '../toast';
import { setUserState } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'

const Login: React.FC = () => {
    const [busy, setBusy] = useState<boolean>(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    async function login(){

       setBusy(true)
        const res: any = await loginUser(username, password)
        
        if(res) {
            console.log(res)
            
                dispatch(setUserState((res.user).email))
                history.replace('/dashboard')
                toast('You have logged in!')
            
            

        }setBusy(false)
    }


  




  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
     <IonLoading message="Please wait.." duration={0} isOpen={busy}></IonLoading>
      <IonContent className="ion-padding">
          <IonInput placeholder="Username?" onIonChange={(e: any) => setUsername(e.target.value)} />
          <IonInput type="password" placeholder="Password?" onIonChange={(e: any) => setPassword(e.target.value)} />
          <IonButton onClick={login}>Login</IonButton>
        
      </IonContent>
    </IonPage>
  );
};

export default Login;
