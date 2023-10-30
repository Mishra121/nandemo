import {
	IonButton,
	IonContent,
	IonFooter,
	IonIcon,
	IonPage,
	IonRow,
	IonToast,
	useIonActionSheet,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { shareOutline, hammerSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import HeaderNandemo from "../components/common/Header";
import JournalDetails from "../components/journal/JournalDetails";
import { NDEMO_API_URL } from "../constants/url";
import { JournalDataResponse } from "../types/types";
import { isObjectEmpty } from "../utilities/helpers";
import { checkUserInfo } from "../utilities/helpers/auth";
import request from "../utilities/helpers/request";

type SelectedJournalParams = {
	journalId: string;
};

const SelectedJournal = () => {
	const params = useParams<SelectedJournalParams>();
	const journalId = params?.journalId;
	const [present] = useIonActionSheet();
	const [result, setResult] = useState<OverlayEventDetail>();
	const [isCopiedMsgOpen, setIsCopiedMsgOpen] = useState(false);
	const history = useHistory();

	const { data: journalData, isLoading: isLoadingJournal } = useQuery(
		`journal-${journalId}`,
		() =>
			request<JournalDataResponse>(NDEMO_API_URL + `/journals/${journalId}`, {
				headers: {
					"Content-Type": "application/json",
				},
				method: "GET",
			})
				.then((res) => res)
				.catch((err) => console.log(err)),
		{
			refetchOnWindowFocus: false,
		}
	);

	const parsedUserInfo = checkUserInfo();

	const authorizedUserId = !isObjectEmpty(parsedUserInfo)
		? parsedUserInfo?.user_id
		: "NOT_AUTHORIZED";
	const journalCreatorId = journalData?.journal_data?.user_id;

	const userCanEdit = journalCreatorId === authorizedUserId;

	const journalShareUrl = window.location.href ?? "";

	useEffect(() => {
		async function copyTextToClipboard(text: string) {
			setIsCopiedMsgOpen(true);
			if ("clipboard" in navigator) {
				return await navigator.clipboard.writeText(text);
			} else {
				return document.execCommand("copy", true, text);
			}
		}

		if (result?.data?.action === "share") {
			copyTextToClipboard(journalShareUrl);
		}
	}, [result]);

	const handleJournalEditBtnClick = () => {
		history.push("/journal-app/edit/" + journalId);
	};

	return (
		<IonPage>
			<HeaderNandemo />

			<IonContent fullscreen>
				<div className="journal-detail-container">
					<>
						{isLoadingJournal && (
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
							</div>
						)}
						{!isLoadingJournal && journalData && (
							<JournalDetails journalData={journalData?.journal_data} />
						)}
					</>
				</div>

				<IonToast
					color={"medium"}
					isOpen={isCopiedMsgOpen}
					message="copied to clipboard."
					onDidDismiss={() => setIsCopiedMsgOpen(false)}
					duration={2500}
				></IonToast>
			</IonContent>
			<IonFooter className="view-post-footer">
				<IonRow className="post-footer ion-align-self-center ion-justify-content-between">
					<div style={{ marginTop: "12px" }}>
						<IonButton
							fill="clear"
							color="primary"
							onClick={() =>
								present({
									header: "Link to share page",
									// subHeader: "Example subheader",
									buttons: [
										{
											text: "Copy Link",
											data: {
												action: "share",
											},
										},
										{
											text: "Cancel",
											role: "cancel",
											data: {
												action: "cancel",
											},
										},
									],
									onDidDismiss: ({ detail }) => setResult(detail),
								})
							}
						>
							<IonIcon icon={shareOutline} style={{ marginRight: "4px" }} />{" "}
							Share
						</IonButton>
					</div>

					<div>
						{userCanEdit && (
							<IonButton
								fill="outline"
								color="primary"
								className="journal-edit"
								onClick={handleJournalEditBtnClick}
							>
								Edit
								<IonIcon slot="end" icon={hammerSharp}></IonIcon>
							</IonButton>
						)}
					</div>
				</IonRow>
			</IonFooter>
		</IonPage>
	);
};

export default SelectedJournal;
