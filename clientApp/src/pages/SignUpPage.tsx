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
	IonSpinner,
	IonToast,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";

import CustomField from "../components/auth/CustomField";
import { useSignupFields } from "../data/fields";
import { Action } from "../components/auth/Action";
import { Wave } from "../components/auth/Wave";

import { validateForm } from "../data/utils";
import styles from "./Signup.module.css";
import HeaderNandemo from "../components/common/Header";
import useWindowDimensions from "../utilities/hooks/use-window-dimensions";
import { NDEMO_API_URL } from "../constants/url";
import request from "../utilities/helpers/request";

const Signup = () => {
	const history = useHistory();
	const params = useParams();
	const fields = useSignupFields();
	const { width: windowWidth } = useWindowDimensions();
	const isMobileView = windowWidth ? windowWidth <= 600 : false;

	const [isOpen, setIsOpen] = useState(false);
	const [errors, setErrors] = useState<
		boolean | { id: unknown; message: string }[]
	>(false);
	const [isRequestingSignUp, setIsRequestingSignUp] = useState(false);

	const createAccount = () => {
		const errors = validateForm(fields);
		setErrors(errors);

		if (!errors.length) {
			setIsRequestingSignUp(true);
			//  Submit your form here
			const first_name = fields[0]?.input?.state.value;
			const last_name = fields[1]?.input?.state.value;
			const email = fields[2]?.input?.state.value;
			const password = fields[3]?.input?.state.value;

			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					first_name,
					last_name,
					email,
					password,
				}),
			};

			// TODO: add type and react query mutation
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			request<any>(NDEMO_API_URL + "/users-auth/signup", requestOptions)
				.then((res) => {
					setIsRequestingSignUp(false);
					if (res.InsertedID) {
						history.push("/auth/nandemo/login", { from: "NO_AUTH" });
					} else {
						setIsOpen(true);
					}
				})
				.catch(() => {
					setIsRequestingSignUp(false);
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
		<IonPage className={styles.signupPage}>
			<HeaderNandemo />

			<IonContent fullscreen>
				<IonGrid className="ion-padding ion-margin-top">
					<IonRow>
						<IonCol size="12" className={styles.headingText}>
							<IonCardTitle style={{ color: "#000000" }}>Sign up</IonCardTitle>
							<h5>Lets get to know each other</h5>
						</IonCol>
					</IonRow>

					<IonRow className="ion-margin-top ion-padding-top">
						<IonCol size="12">
							{fields.map((field, index) => {
								return (
									<CustomField
										key={`custom-sign-${index}`}
										field={field}
										errors={errors}
									/>
								);
							})}

							<IonButton
								color={"dark"}
								className="custom-button"
								expand="block"
								disabled={isRequestingSignUp}
								onClick={createAccount}
							>
								{isRequestingSignUp ? (
									<IonSpinner name="bubbles"></IonSpinner>
								) : (
									"Create account"
								)}
							</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>

				<IonToast
					color={"danger"}
					isOpen={isOpen}
					message="something went wrong, please try again later"
					onDidDismiss={() => setIsOpen(false)}
					duration={4000}
				></IonToast>

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
			</IonContent>

			<IonFooter>
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
