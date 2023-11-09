/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import {
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	// IonCardContent,
	IonButton,
	IonPicker,
	IonIcon,
	IonNote,
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
import {
	arrowForwardCircle,
	arrowBackCircle,
	alertCircleOutline,
} from "ionicons/icons";
import { fixedLengthString } from "../../utilities/helpers";
import { formatDateString } from "../../utilities/dates";
import useWindowDimensions from "../../utilities/hooks/use-window-dimensions";
import { JOURNAL_MONTHS } from "../../constants/journals";

const AllJournals: React.FC = () => {
	const history = useHistory();
	const [currPage, setCurrPage] = useState<number>(1);
	const [selectedMonthYear, setSelectedMonthYear] = useState({
		month: 0,
		year: 0,
	});
	const [removeMonthFilter, setRemoveMonthFilter] = useState(false);
	const { width: windowWidth } = useWindowDimensions();
	const isMobileView = windowWidth ? windowWidth <= 600 : false;
	const monthYearUrlAddon =
		selectedMonthYear?.month !== 0 && selectedMonthYear?.year != 0
			? `&month=${selectedMonthYear?.month}&year=${selectedMonthYear?.year}`
			: "";

	const parsedUserInfo = checkUserInfo();

	const {
		data: journalsData,
		isLoading: isLoadingJournals,
		refetch: refetchJornalsData,
	} = useQuery(
		`journalsData-${currPage}`,
		() =>
			request<AllJournalType>(
				NDEMO_API_URL +
					`/journals?page=${currPage}&limit=4` +
					monthYearUrlAddon,
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

	const {
		data: journalsDataNextPage,
		isLoading: isLoadingJournalsNextPage,
		refetch: refetchJournalsDataNextPage,
	} = useQuery(
		`journalsDataNext-${currPage}`,
		() =>
			request<AllJournalType>(
				NDEMO_API_URL +
					`/journals?page=${currPage + 1}&limit=4` +
					monthYearUrlAddon,
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

	useEffect(() => {
		if (selectedMonthYear?.month > 0) {
			setCurrPage(1);
			refetchJornalsData();
			refetchJournalsDataNextPage();
		}
	}, [selectedMonthYear?.month]);

	useEffect(() => {
		if (removeMonthFilter) {
			refetchJornalsData();
			refetchJournalsDataNextPage();
			setRemoveMonthFilter(false);
		}
	}, [removeMonthFilter, setRemoveMonthFilter, setSelectedMonthYear]);

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
		history.push("/journal-app/" + journalId);
	};

	const handleMonthSelectedJournals = (month: string | number) => {
		const today_date = new Date();
		const year = today_date.getFullYear();

		setSelectedMonthYear({ month: Number(month), year });
	};

	const handleRemoveMonthFilter = () => {
		setRemoveMonthFilter(true);
		setSelectedMonthYear({ month: 0, year: 0 });
		setCurrPage(1);
	};

	return (
		<div className="all-journal-container">
			<>
				<IonButton color={"secondary"} id="open-picker">
					Filter Month
				</IonButton>
				<IonPicker
					trigger="open-picker"
					columns={[
						{
							name: "months",
							options: JOURNAL_MONTHS,
						},
					]}
					buttons={[
						{
							text: "Cancel",
							role: "cancel",
						},
						{
							text: "Confirm",
							handler: (value) => {
								handleMonthSelectedJournals(value.months.value);
							},
						},
					]}
				></IonPicker>
			</>

			{selectedMonthYear?.month > 0 && selectedMonthYear?.year !== 0 && (
				<IonButton color={"warning"} onClick={handleRemoveMonthFilter}>
					Remove Filter
				</IonButton>
			)}

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

			{(allJournals === null || allJournals?.length === 0) && (
				<div className="no-journal-found">
					<IonIcon icon={alertCircleOutline}></IonIcon>
					<IonNote color="dark">No journal found</IonNote>
				</div>
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
