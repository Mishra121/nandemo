import { IonPage, IonContent } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import HeaderNandemo from "../components/common/Header";

export default function SocialAuthPage() {
	const history = useHistory();
	const [authUpdated, setAuthUpdated] = useState(false);

	useEffect(() => {
		if (window !== undefined) {
			const search = window.location.search;
			const params = new URLSearchParams(search);

			const first_name = params.get("first_name") ?? "";
			const email = params.get("email") ?? "";
			const token = params.get("token") ?? "";
			const refresh_token = params.get("refresh_token") ?? "";
			const user_id = params.get("user_id") ?? "";

			const user_info = {
				first_name,
				email,
				token,
				refresh_token,
				user_id,
			};

			localStorage.setItem("user_info", JSON.stringify(user_info));
			setAuthUpdated(true);
		}

		if (authUpdated) {
			redirectToHome();
		}
	}, [authUpdated]);

	const redirectToHome = () => {
		history.push("/nandemo-select");
	};

	return (
		<IonPage>
			<HeaderNandemo />

			<IonContent fullscreen>
				<div className="container">
					<div>
						<div className="col-sm-12 ">
							<div className="col-sm-10 col-sm-offset-1  text-center">
								<div
									style={{ width: "80%", margin: "0 auto", marginTop: "25px" }}
								>
									<Skeleton height={45} />
									<br />
									<Skeleton height={45} />
									<br />
									<Skeleton height={45} />
									<br />
									<Skeleton height={45} />
									<br />
									<Skeleton height={45} />
									<br />
									<Skeleton height={45} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
}
