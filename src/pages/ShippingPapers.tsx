import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonButtons } from '@ionic/react';
import React from 'react';


const ShippingPapers: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Shipping Paper</IonTitle>
          <IonButtons slot="end">Back</IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        
      </IonContent>
    </IonPage>
  );
};

export default ShippingPapers;
