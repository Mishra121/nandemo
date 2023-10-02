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
  IonToast,
} from "@ionic/react";
import { useParams, useHistory } from "react-router";
import styles from "./Login.module.css";

import CustomField from "../components/auth/CustomField";
import { useLoginFields } from "../data/fields";
import { Action } from "../components/auth/Action";
import { Wave } from "../components/auth/Wave";
import { validateForm } from "../data/utils";
import HeaderNandemo from "../components/common/Header";
import request from "../utilities/helpers/request";
import { NDEMO_API_URL } from "../constants/url";

const Login = () => {
  const params = useParams();
  const history = useHistory();

  const fields = useLoginFields();
  const [errors, setErrors] = useState<any>(false);
  const [isOpen, setIsOpen] = useState(false);

  const onLogin = () => {
    const errors = validateForm(fields);
    setErrors(errors);

    if (!errors.length) {
      //  Submit your form here
      const email = fields[0]?.input?.state.value;
      const password = fields[1]?.input?.state.value;

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      };

      // TODO: add type and react query mutation
      // Also add the loading state maybe at submit button
      request<any>(NDEMO_API_URL + "/users-auth/login", requestOptions)
        .then((res) => {
          if (res.user_info) {
            localStorage.setItem("user_info", JSON.stringify(res.user_info));
            history.push("/nandemo-select");
          } else {
            setIsOpen(true);
          }
        })
        .catch((err) => {
          setIsOpen(true);
        });
    }
  };

  useEffect(() => {
    return () => {
      fields.forEach((field) => field.input.state.reset(""));
      setErrors(false);
    };
  }, [params]);

  return (
    <IonPage className={styles.loginPage}>
      <HeaderNandemo />

      <IonContent fullscreen>
        <IonGrid className="ion-padding ion-margin-top">
          <IonRow>
            <IonCol size="12" className={styles.headingText}>
              <IonCardTitle>Log in</IonCardTitle>
              <h5>Welcome back, hope you're doing well</h5>
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
                onClick={onLogin}
              >
                Login
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonToast
          color={"danger"}
          isOpen={isOpen}
          message="something went wrong, please try again"
          onDidDismiss={() => setIsOpen(false)}
          duration={4000}
        ></IonToast>
      </IonContent>

      <IonFooter>
        <IonGrid className="ion-no-margin ion-no-padding">
          <Action
            message="Don't have an account?"
            text="Sign up"
            link="/auth/nandemo/signup"
          />
          <Wave />
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};

export default Login;
