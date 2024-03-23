/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
	IonButton,
	IonCardTitle,
	IonCol,
	IonContent,
	IonFooter,
	IonGrid,
	IonIcon,
	IonPage,
	IonRow,
	IonSpinner,
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
import { getGoogleUrl } from "../utilities/helpers/getGoogleUrl";
import { logoGoogle } from "ionicons/icons";
import useWindowDimensions from "../utilities/hooks/use-window-dimensions";

const Login = () => {
	const params = useParams();
	const history = useHistory();
	const { width: windowWidth } = useWindowDimensions();
	const isMobileView = windowWidth ? windowWidth <= 600 : false;

	const fromUrl =
		((history.location.state as any)?.from?.pathname as string) || "/";
	const fields = useLoginFields();
	const [errors, setErrors] = useState<any>(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isRequestingLogin, setIsRequestingLogin] = useState(false);

	const onLogin = () => {
		const errors = validateForm(fields);
		setErrors(errors);
		if (!errors.length) {
			setIsRequestingLogin(true);
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
			request<any>(NDEMO_API_URL + "/users-auth/login", requestOptions)
				.then((res) => {
					setIsRequestingLogin(false);
					if (res.user_info) {
						localStorage.setItem("user_info", JSON.stringify(res.user_info));
						history.push("/nandemo-select");
					} else {
						setIsOpen(true);
					}
				})
				.catch(() => {
					setIsRequestingLogin(false);
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
							<IonCardTitle style={{ color: "#000000" }}>Log in</IonCardTitle>
							<h5>Welcome back, hope you&apos;re doing well</h5>
						</IonCol>
					</IonRow>

					{!isMobileView && (
						<IonRow>
							<IonCol>
								<a href={getGoogleUrl(fromUrl)}>
									<IonButton color={"primary"} className="google-signin-button">
										<IonIcon slot="start" icon={logoGoogle}></IonIcon>
										Sign in with google
									</IonButton>
								</a>
							</IonCol>
						</IonRow>
					)}

					<IonRow className="ion-margin-top ion-padding-top">
						<IonCol size="12">
							{fields.map((field, index) => {
								return (
									<CustomField
										key={`custom-${index}`}
										field={field}
										errors={errors}
									/>
								);
							})}

							<IonButton
								color={"dark"}
								className="custom-button"
								expand="block"
								onClick={onLogin}
								disabled={isRequestingLogin}
							>
								{isRequestingLogin ? (
									<IonSpinner name="bubbles"></IonSpinner>
								) : (
									"Login"
								)}
							</IonButton>
							<br />
							<hr />
						</IonCol>
					</IonRow>
					{isMobileView && (
						<IonRow>
							<IonCol>
								<a href={getGoogleUrl(fromUrl)}>
									<IonButton color={"primary"} className="google-signin-button">
										<IonIcon slot="start" icon={logoGoogle}></IonIcon>
										Sign in with google
									</IonButton>
								</a>
							</IonCol>
						</IonRow>
					)}
				</IonGrid>
				<IonToast
					color={"danger"}
					isOpen={isOpen}
					message="something went wrong, please try again"
					onDidDismiss={() => setIsOpen(false)}
					duration={4000}
				></IonToast>

				{isMobileView && (
					<IonGrid className="ion-no-margin ion-no-padding">
					<Action
						message="Don't have an account?"
						text="Sign up"
						link="/auth/nandemo/signup"
					/>
					<Wave />
					</IonGrid>
				)}
			</IonContent>

			<IonFooter>
				{!isMobileView && (
					<Action
						message="Don't have an account?"
						text="Sign up"
						link="/auth/nandemo/signup"
					/>
				)}
			</IonFooter>
		</IonPage>
	);
};

export default Login;
