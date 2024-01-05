import {
	IonGrid,
	IonRow,
	IonCardSubtitle,
	IonCol,
	IonCardTitle,
	IonBadge,
	IonButton,
	IonIcon,
	IonButtons,
	IonContent,
	IonHeader,
	IonItem,
	IonModal,
	IonToolbar,
} from "@ionic/react";
import { arrowBackSharp, cloudUploadSharp } from "ionicons/icons";
import { ChangeEvent, useRef, useState } from "react";
import { useHistory } from "react-router";
import { NDEMO_API_URL } from "../../constants/url";
import { JournalType } from "../../types/types";
import { formatDateString } from "../../utilities/dates";
import {
	fixedLengthString,
	isObjectEmpty,
	refreshPage,
} from "../../utilities/helpers";
import { checkUserInfo } from "../../utilities/helpers/auth";
import "./JournalDetails.css";

interface JournalDetailsProps {
	journalData: JournalType;
	userCanEdit?: boolean;
	journalId: string;
}

const JournalDetails = (props: JournalDetailsProps) => {
	const { journalData, userCanEdit = false, journalId } = props;
	const history = useHistory();

	const modal = useRef<HTMLIonModalElement>(null);
	const [imageFile, setFile] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isImageUploading, setIsImageUploading] = useState(false);

	const {
		title = "",
		description,
		created_at,
		overall_mood,
		type: journalType,
		attachment = "",
	} = journalData;

	const parsedUserInfo = checkUserInfo();
	const userToken = !isObjectEmpty(parsedUserInfo) ? parsedUserInfo?.token : "";

	const handleJournalsBtnClick = () => {
		history.push("/journal-app/");
	};

	function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			setSelectedFile(e.target.files[0]);
			setFile(URL.createObjectURL(e.target.files[0]));
		}
	}

	function onWillDismiss() {
		setSelectedFile(null);
		setFile("");
	}

	const fileUploadHandler = () => {
		setIsImageUploading(true);
		if (selectedFile) {
			const formData = new FormData();
			formData.append("file", selectedFile);

			fetch(NDEMO_API_URL + `/journal/upload-img/${journalId}`, {
				method: "POST",
				body: formData,
				headers: {
					token: userToken,
				},
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					setIsImageUploading(false);
					modal.current?.dismiss();

					if (data?.refresh == true) {
						refreshPage();
					}
				})
				.catch(() => {
					setIsImageUploading(false);
					modal.current?.dismiss();
					alert("Error uploading image");
				});
		}
	};

	return (
		<div>
			{/* */}
			<div>
				<IonButton
					fill="clear"
					color="primary"
					onClick={handleJournalsBtnClick}
				>
					<IonIcon slot="start" icon={arrowBackSharp}></IonIcon> Journals
				</IonButton>
			</div>
			<>
				{attachment.length > 0 && (
					<img src={attachment} alt="image for this post" height={"310px"} />
				)}
				{attachment === "" && userCanEdit && (
					<div
						className="image-upload-container"
						title="upload an image if needed"
					>
						<IonButton size={"small"} id="open-modal-image">
							<IonIcon icon={cloudUploadSharp} style={{ marginRight: "4px" }} />
							Upload Image
						</IonButton>
					</div>
				)}

				<IonModal
					ref={modal}
					trigger="open-modal-image"
					onWillDismiss={() => onWillDismiss()}
				>
					<IonHeader>
						<IonToolbar>
							<IonButtons slot="start">
								<IonButton onClick={() => modal.current?.dismiss()}>
									Cancel
								</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonHeader>
					<IonContent className="ion-padding">
						{!isImageUploading && (
							<>
								<IonItem>
									<h4>Add Image:</h4>
									<input
										type="file"
										onChange={handleImageChange}
										style={{ marginLeft: "6px", marginTop: "5px" }}
									/>
								</IonItem>
								<div>
									{imageFile && selectedFile && (
										<>
											<img src={imageFile} height={"310px"} />
											<IonButton onClick={fileUploadHandler}>
												Confirm Upload
											</IonButton>
										</>
									)}
								</div>
							</>
						)}

						{isImageUploading && <h4>Uploading Please Wait...</h4>}
					</IonContent>
				</IonModal>

				<IonGrid className="ion-padding-start ion-padding-end">
					<IonRow className="ion-align-items-center ion-justify-content-between">
						<IonRow className="ion-align-items-center ion-justify-content-between">
							<IonCardSubtitle
								color={"medium"}
								className="ion-no-margin ion-no-padding ion-margin-start"
							>
								{created_at ? formatDateString(new Date(created_at)) : ""}
							</IonCardSubtitle>
						</IonRow>
					</IonRow>

					<IonRow>
						<IonCol size="12">
							<IonCardTitle color={"dark"} className="post-title">
								{fixedLengthString(title, 45)}
							</IonCardTitle>
						</IonCol>
						<IonBadge color="primary" style={{ marginRight: "6px" }}>
							{overall_mood}
						</IonBadge>
						<IonBadge color="primary">{journalType}</IonBadge>
					</IonRow>

					<IonRow className="description-row">
						<IonCol size="12">
							<div dangerouslySetInnerHTML={{ __html: description }}></div>
						</IonCol>
					</IonRow>
				</IonGrid>
			</>
		</div>
	);
};

export default JournalDetails;
