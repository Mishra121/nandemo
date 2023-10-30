import {
	IonItem,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonButton,
	IonIcon,
	IonSpinner,
} from "@ionic/react";
import { arrowBackSharp, hammerSharp } from "ionicons/icons";
import { SetStateAction, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import { useHistory } from "react-router";
import { EDIT_JOURNAL_HEADING } from "../../constants/journals";
import { NDEMO_API_URL } from "../../constants/url";
import { JournalDataResponse } from "../../types/types";
import { refreshPage } from "../../utilities/helpers";
// import { refreshPage } from "../../utilities/helpers";
import { checkUserInfo } from "../../utilities/helpers/auth";
import request from "../../utilities/helpers/request";

interface EditJournalProps {
	journalId: string;
}

const EditJournal = (props: EditJournalProps) => {
	const history = useHistory();
	const journalId = props.journalId;

	const handleRedirectToDetailsPage = () => {
		history.push("/journal-app/" + journalId);
		refreshPage();
	};

	const parsedUserInfo = checkUserInfo();

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

	const journalDetails = journalData?.journal_data;
	const journalEditorValue = journalDetails?.description ?? "";
	const journalTitleValue = journalDetails?.title ?? "";
	const journalMoodValue = journalDetails?.overall_mood ?? "";
	const journalTypeValue = journalDetails?.type ?? "";

	const [editorValue, setEditorValue] = useState(journalEditorValue);
	const [titleValue, setTitleValue] = useState(journalTitleValue);
	const [moodValue, setMoodValue] = useState(journalMoodValue);
	const [typeValue, setTypeValue] = useState(journalTypeValue);
	const [edited, setEdited] = useState(false);

	useEffect(() => {
		if (edited) {
			handleRedirectToDetailsPage();
		}
	}, [edited]);

	interface Journal {
		title: string;
		description: string;
		overall_mood: string;
		type: string;
	}

	const editJournalCall = async (journalBody: Journal): Promise<Journal> => {
		const response = await fetch(NDEMO_API_URL + `/journal/${journalId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				token: parsedUserInfo.token,
			},
			body: JSON.stringify(journalBody),
		});
		if (!response.ok) {
			throw new Error("Failed to edit journal");
		}
		return await response.json();
	};

	const { mutate: editJournalMutate, isLoading: loadingEditJournal } =
		useMutation(editJournalCall, {
			onSuccess: () => {
				setEdited(true);
			},
			onError: (error) => {
				// Error actions
				console.error(error);
				setEdited(true);
			},
		});

	const onChangeReactQuillEditor = (value: SetStateAction<string>) => {
		setEditorValue(value);
	};

	const handleTitleChange = (ev: Event) => {
		const titleVal = (ev.target as HTMLIonInputElement).value as string;
		setTitleValue(titleVal);
	};

	const handleMoodChange = (e: { detail: { value: unknown } }) => {
		const moodVal = e.detail.value;
		if (typeof moodVal === "string") {
			setMoodValue(moodVal);
		}
	};

	const handleTypeChange = (e: { detail: { value: unknown } }) => {
		const typeVal = e.detail.value;
		if (typeof typeVal === "string") {
			setTypeValue(typeVal);
		}
	};

	const handleSubmitEditButton = () => {
		editJournalMutate({
			title: titleValue,
			description: editorValue,
			overall_mood: moodValue,
			type: typeValue?.toUpperCase(),
		});
	};

	if (isLoadingJournal) {
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
			</div>
		);
	}

	return (
		<div className="create-journal-container">
			<div>
				<IonButton
					fill="clear"
					color="primary"
					onClick={() => history.goBack()}
				>
					<IonIcon slot="start" icon={arrowBackSharp}></IonIcon> Go Back
				</IonButton>
			</div>

			<h2>{EDIT_JOURNAL_HEADING}</h2>

			<IonItem>
				<IonInput
					onIonInput={handleTitleChange}
					label="Title"
					placeholder="Enter journal title"
					value={titleValue}
				></IonInput>
			</IonItem>

			<IonItem style={{ maxWidth: "500px" }}>
				<IonSelect
					onIonChange={handleMoodChange}
					label="Overall Mood"
					placeholder="Select your mood"
					value={moodValue}
				>
					<IonSelectOption value="GOOD">Good</IonSelectOption>
					<IonSelectOption value="BAD">Bad</IonSelectOption>
					<IonSelectOption value="HAPPY">Happy</IonSelectOption>
					<IonSelectOption value="NONE">No Idea</IonSelectOption>
				</IonSelect>
			</IonItem>

			<IonItem style={{ maxWidth: "500px" }}>
				<IonSelect
					onIonChange={handleTypeChange}
					label="Journal Type"
					placeholder="Select Type"
					value={typeValue}
				>
					<IonSelectOption value="PERSONAL">Personal</IonSelectOption>
					<IonSelectOption value="WORK">Work</IonSelectOption>
					<IonSelectOption value="OTHERS">Others</IonSelectOption>
				</IonSelect>
			</IonItem>

			<br />

			<ReactQuill
				className="react-quill-div"
				value={editorValue}
				onChange={(value) => onChangeReactQuillEditor(value)}
				theme="snow"
			/>

			<br />

			<IonButton
				color="dark"
				onClick={handleSubmitEditButton}
				disabled={loadingEditJournal}
			>
				{loadingEditJournal ? (
					<IonSpinner name="bubbles"></IonSpinner>
				) : (
					<>
						Edit the Journal{" "}
						<IonIcon style={{ marginLeft: "6px" }} icon={hammerSharp}></IonIcon>
					</>
				)}
			</IonButton>
		</div>
	);
};

export default EditJournal;
