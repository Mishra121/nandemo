import {
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonContent,
	IonPage,
	IonThumbnail,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { ErrorBoundary } from "react-error-boundary";

import request from "../utilities/helpers/request";
import { RandomQuotes } from "../types/types";
import HeaderNandemo from "../components/common/Header";

import "./nandemoShellPage.css";
import { randomInteger } from "../utilities/helpers";
import { NDEMO_API_URL } from "../constants/url";
import { useEffect } from "react";
import { checkUserInfo } from "../utilities/helpers/auth";

const nandemoAppOptions = [
	{
		name: "Your Profile",
		description: "profile section coming soon...",
		url: "",
	},
	{
		name: "Journal It",
		description: "your easy helper to maintain daily activities",
		url: "/journal-app",
	},
	{
		name: "Budget It",
		description: "user friendly expense manager at service",
		url: "/expense-manager",
	},
	{
		name: "Random Thoughts",
		description: "Discipline is the bridge between goals and accomplishment",
		url: "",
	},
];

const NandemoShell: React.FC = () => {
	const history = useHistory();

	useEffect(() => {
		const parsedUserInfo = checkUserInfo();

		if (!parsedUserInfo.token) {
			history.push("/auth/nandemo/login");
		}
	}, []);

	const { data: randomQuotesData } = useQuery(
		"quoteData",
		() =>
			request<RandomQuotes>(NDEMO_API_URL + "/random-quote").then((res) => res),
		{
			refetchOnWindowFocus: false,
		}
	);

	const randomQuotesDataLen = randomQuotesData ? randomQuotesData.length : 1;
	const quoteIndex = randomInteger(0, randomQuotesDataLen - 1);

	const randomQuote: string =
		randomQuotesDataLen > 1
			? randomQuotesData?.[quoteIndex]?.text ?? ""
			: "Discipline is the bridge between goals and accomplishment";

	const redirectToModule = (url: string) => {
		if (url !== "") {
			history.push(url);
		}
	};

	return (
		<ErrorBoundary fallback={<div>Something went wrong in NandemoShell</div>}>
			<IonPage>
				<HeaderNandemo />

				<IonContent fullscreen={true}>
					<div className="nandemoshell-heading">
						<h4>
							Select one of the app to use from the nandemo selection panel.
						</h4>
					</div>

					<div className="nandemoshell-selection">
						{nandemoAppOptions.map((nandemoAppOption, index) => (
							<div
								onClick={() => redirectToModule(nandemoAppOption.url)}
								className="nandemoshell_selection__card"
								key={`nandemoshell_selection__card_${index}`}
							>
								<IonCard
									color={
										nandemoAppOption.name !== "Random Thoughts"
											? "dark"
											: "tertiary"
									}
								>
									<IonCardHeader>
										<div className="nandemoshell_selection__cardheader">
											{nandemoAppOption.name !== "Random Thoughts" && (
												<IonThumbnail>
													<img
														alt="Silhouette of mountains"
														src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
													/>
												</IonThumbnail>
											)}
											<IonCardTitle style={{ marginTop: "8px" }}>
												{nandemoAppOption.name}
											</IonCardTitle>
										</div>
									</IonCardHeader>

									<div className="nandemoshell_selection__cardcontent">
										<IonCardContent>
											{nandemoAppOption.name !== "Random Thoughts"
												? nandemoAppOption.description
												: randomQuote}
										</IonCardContent>
									</div>
								</IonCard>
							</div>
						))}
					</div>
				</IonContent>
			</IonPage>
		</ErrorBoundary>
	);
};

export default NandemoShell;
