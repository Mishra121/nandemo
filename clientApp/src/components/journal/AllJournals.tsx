/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import {
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	IonCardContent,
	IonButton,
	IonIcon,
} from "@ionic/react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { NDEMO_API_URL } from "../../constants/url";
import { AllJournalType, JournalType } from "../../types/types";
import { checkUserInfo } from "../../utilities/helpers/auth";
import request from "../../utilities/helpers/request";
import "./AllJournals.css";
import { arrowForwardCircle, arrowBackCircle } from "ionicons/icons";
import { fixedLengthString, isObjectEmpty } from "../../utilities/helpers";
import { formatDateString } from "../../utilities/dates";
import useWindowDimensions from "../../utilities/hooks/use-window-dimensions";

const AllJournals: React.FC = () => {
	const history = useHistory();
	const [currPage, setCurrPage] = useState<number>(1);
	const { width: windowWidth } = useWindowDimensions();
	const isMobileView = windowWidth ? windowWidth <= 600 : false;

	const parsedUserInfo = checkUserInfo();

	useEffect(() => {
		if (isObjectEmpty(parsedUserInfo)) {
			history.push("/auth/nandemo/login");
		}
	}, [parsedUserInfo?.user_info]);

	const { data: journalsData, isLoading: isLoadingJournals } = useQuery(
		`journalsData-${currPage}`,
		() =>
			request<AllJournalType>(
				NDEMO_API_URL + `/journals?page=${currPage}&limit=4`,
				{
					headers: {
						"Content-Type": "application/json",
						token: parsedUserInfo.token,
					},
					method: "GET",
				}
			)
				.then((res) => res)
				.catch((err) => console.log(err)),
		{
			refetchOnWindowFocus: false,
			enabled: parsedUserInfo?.token?.length > 0,
		}
	);

	const { data: journalsDataNextPage, isLoading: isLoadingJournalsNextPage } =
		useQuery(
			`journalsDataNext-${currPage}`,
			() =>
				request<AllJournalType>(
					NDEMO_API_URL + `/journals?page=${currPage + 1}&limit=4`,
					{
						headers: {
							"Content-Type": "application/json",
							token: parsedUserInfo.token,
						},
						method: "GET",
					}
				)
					.then((res) => res)
					.catch((err) => console.log(err)),
			{
				refetchOnWindowFocus: false,
				enabled: parsedUserInfo?.token?.length > 0,
			}
		);

	if (isLoadingJournals || isLoadingJournalsNextPage)
		return (
			<div style={{ width: "80%", margin: "0 auto", marginTop: "25px" }}>
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
		);

	if (journalsData?.error?.includes("expired")) {
		localStorage.removeItem("user_info");
		history.push("/auth/nandemo/login");
	}

	const allJournals = journalsData?.journals;
	const allJournalsNextPage = journalsDataNextPage?.journals;

	let showNextPageJournals = false;
	if (allJournalsNextPage?.length && allJournalsNextPage?.length > 0) {
		showNextPageJournals = true;
	}

	const loadNextPageJournals = () => {
		setCurrPage(currPage + 1);
	};

	const loadPreviousPageJournals = () => {
		setCurrPage(currPage - 1);
	};

	const handleCardClick = (journalId: string) => {
		console.log("handleCardClick clicked", { journalId });
		// setShowJournalById("56463654564563");
	};

	return (
		<div className="all-journal-container">
			{isMobileView && currPage > 1 && (
				<IonButton onClick={loadPreviousPageJournals} color="dark">
					<IonIcon slot="start" icon={arrowBackCircle}></IonIcon>
					Previous
				</IonButton>
			)}

			{isMobileView && showNextPageJournals && (
				<IonButton onClick={loadNextPageJournals} color="dark">
					Next
					<IonIcon slot="end" icon={arrowForwardCircle}></IonIcon>
				</IonButton>
			)}

			{allJournals?.map((journalData: JournalType, index: number) => (
				<IonCard
					key={`${journalData?.title}-${index}`}
					onClick={() => handleCardClick(journalData?.ID)}
				>
					<IonCardHeader>
						<IonCardTitle>
							{fixedLengthString(journalData?.title, 30)}
						</IonCardTitle>
						<IonCardSubtitle>
							{journalData?.created_at
								? formatDateString(new Date(journalData?.created_at))
								: ""}
						</IonCardSubtitle>
					</IonCardHeader>

					<IonCardContent>
						{fixedLengthString(journalData.description, 80)}
					</IonCardContent>
				</IonCard>
			))}

			{!isMobileView && currPage > 1 && (
				<IonButton onClick={loadPreviousPageJournals} color="dark">
					<IonIcon slot="start" icon={arrowBackCircle}></IonIcon>
					Previous
				</IonButton>
			)}

			{!isMobileView && showNextPageJournals && (
				<IonButton onClick={loadNextPageJournals} color="dark">
					Next
					<IonIcon slot="end" icon={arrowForwardCircle}></IonIcon>
				</IonButton>
			)}
		</div>
	);
};

export default AllJournals;
