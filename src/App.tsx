import { Redirect, Route } from 'react-router-dom';
import { 
  IonAlert, 
  IonApp, 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonCol, 
  IonGrid, 
  IonHeader, 
  IonIcon, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonRouterOutlet, 
  IonRow, 
  IonTitle, 
  IonToolbar, 
  setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calculatorOutline, refreshOutline } from 'ionicons/icons';
import Home from './pages/Home';
import {useRef, useState} from "react";

import BmiControls from './components/BmiControls'
import InputControl from "./components/InputControl";
import BmiResult from "./components/BmiResult";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [ calculatedBMI, setCalculatedBMI ] = useState<number>();
  const [ typeBMI, setTypeBMI ] = useState<string>();

  const [error, setError] = useState<string>();
  const [calcUnits, setCalcsUnits] = useState<"cmkg" | "ftlbs">("cmkg");

  const heightInputRef = useRef<HTMLIonInputElement>(null);
  const weightInputRef = useRef<HTMLIonInputElement>(null);
  const calculateBMI = () => {
      const enteredWeight = weightInputRef.current!.value;
      const enteredHeight = heightInputRef.current!.value;

      if (!enteredWeight || !enteredHeight || +enteredHeight <= 0 || +enteredWeight <= 0) {
        setError("Please enter a valid (non-negative) input number");
        return;
      }
      
      const weightConversion = calcUnits === "ftlbs" ? 2.2 : 1;
      const heightConversion = calcUnits === "ftlbs" ? 0.0328 : 1;

      const weight = +enteredWeight / weightConversion;
      const height = +enteredHeight / heightConversion;
      
      const bmi = weight / ((height / 100) * (height / 100));
      const bmiResult = Number(bmi)

      if (bmiResult < 18.5) {
        setTypeBMI("Kurus")
      } else if (bmiResult >= 18.5 && bmiResult <= 24.9) {
        setTypeBMI("Normal")
      } else if (bmiResult >= 25 && bmiResult <= 29.9) {
        setTypeBMI("Gemuk")
      } else if (bmiResult >= 30) {
        setTypeBMI("Obesitas")
      } else {
        setTypeBMI("Undefined")
      }

      //console.log(bmi);
      setCalculatedBMI(bmiResult);

  };

  const resetInputs = () => {
      weightInputRef.current!.value = '';
      heightInputRef.current!.value = '';
  };

  const selectCalcUnitHandler = (selectedValue: "cmkg" | "ftlbs") => {
    setCalcsUnits(selectedValue);
  };

  return (
    <>
    <IonAlert
        isOpen={!!error}
        message={error}
        buttons={[{ text: "Okay", handler: setError }]}
    />
    <IonApp>    
      <IonHeader>
        <IonToolbar>
          <IonTitle>BMI Calculator</IonTitle>
        </IonToolbar>
      </IonHeader>

      <InputControl
        selectedValue={calcUnits}
        onSelectValue={selectCalcUnitHandler}
      />

      <IonGrid>
        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">
                Tinggi Badan ({calcUnits === "cmkg" ? "cm" : "feet"})
              </IonLabel>
              <IonInput ref={heightInputRef}></IonInput>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">
                Berat Badan ({calcUnits === "cmkg" ? "kg" : "lbs"})
              </IonLabel>
              <IonInput ref={weightInputRef}></IonInput>
            </IonItem>
          </IonCol>
        </IonRow>

        <BmiControls onCalculate={calculateBMI} onReset={resetInputs} />

        {calculatedBMI && (<IonRow>
          <IonCol>
            <IonCard>
              <IonCardContent className="ion-text-center">
                <h2>{calculatedBMI}</h2>
                <h1>{typeBMI}</h1>
              </IonCardContent>
            </IonCard>
          </IonCol>
          </IonRow>)}

      </IonGrid>
    </IonApp>
    </>
  )
};

export default App;
