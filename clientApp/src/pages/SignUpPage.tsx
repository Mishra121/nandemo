import { useEffect, useState } from "react";
import {
  IonButton,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonPage,
  IonRow,
} from "@ionic/react";
import { useParams } from "react-router";

import CustomField from "../components/auth/CustomField";
import { useSignupFields } from "../data/fields";
import { Action } from "../components/auth/Action";
import { Wave } from "../components/auth/Wave";

import { validateForm } from "../data/utils";
import styles from "./Signup.module.css";
import HeaderNandemo from "../components/common/Header";
import useWindowDimensions from "../utilities/hooks/use-window-dimensions";

const Signup = () => {
  const params = useParams();
  const fields = useSignupFields();
  const { width: windowWidth } = useWindowDimensions();
  const isMobileView = windowWidth ? windowWidth <= 600 : false;
  const [errors, setErrors] = useState(false);

  const createAccount = () => {
    const errors = validateForm(fields);
    // setErrors(errors);

    if (!errors.length) {
      //  Submit your form here
    }
  };

  useEffect(() => {
    return () => {
      fields.forEach((field) => field.input.state.reset(""));
      setErrors(false);
    };
  }, [params]);

  return (
    <IonPage className={styles.signupPage}>
      <HeaderNandemo />

      <IonContent fullscreen>
        <IonGrid className="ion-padding ion-margin-top">
          <IonRow>
            <IonCol size="12" className={styles.headingText}>
              <IonCardTitle>Sign up</IonCardTitle>
              <h5>Lets get to know each other</h5>
            </IonCol>
          </IonRow>

          <IonRow className="ion-margin-top ion-padding-top">
            <IonCol size="12">
              {fields.map((field) => {
                return <CustomField field={field} errors={errors} />;
              })}

              <IonButton
                color={"dark"}
                className="custom-button"
                expand="block"
                onClick={createAccount}
              >
                Create account
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter>
        {isMobileView && (
          <IonGrid className="ion-no-margin ion-no-padding">
            <Action
              message="Already got an account?"
              text="Login"
              link="/auth/nandemo/login"
            />
            <Wave />
          </IonGrid>
        )}

        {!isMobileView && (
          <Action
          message="Already got an account?"
          text="Login"
          link="/auth/nandemo/login"
        />
        )}
      </IonFooter>
    </IonPage>
  );
};

export default Signup;
