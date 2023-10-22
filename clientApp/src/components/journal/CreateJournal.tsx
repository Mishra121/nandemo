/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-mixed-spaces-and-tabs */
import {
	IonItem,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonButton,
	IonIcon,
	IonToast,
	IonSpinner,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { SetStateAction, useState } from "react";
import { useMutation } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { CREATE_JOURNAL_HEADING } from "../../constants/journals";
import { NDEMO_API_URL } from "../../constants/url";
import { refreshPage } from "../../utilities/helpers";
import { checkUserInfo } from "../../utilities/helpers/auth";
import "./CreateJournal.css";

const CreateJournal: React.FC = () => {
	const [editorValue, setEditorValue] = useState("");
	const [titleValue, setTitleValue] = useState("");
	const [moodValue, setMoodValue] = useState("");
	const [typeValue, setTypeValue] = useState("");
	const [isCreateValidationErrorOpen, setIsCreateValidationErrorOpen] =
		useState(false);
	const [isAddJournalErrorToastOpen, setIsAddJournalErrorToastOpen] =
		useState(false);

	const parsedUserInfo = checkUserInfo();

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

	interface Journal {
		title: string;
		description: string;
		overall_mood: string;
		type: string;
	}

	const postJournal = async (journalBody: Journal): Promise<Journal> => {
		const response = await fetch(NDEMO_API_URL + "/journal/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: parsedUserInfo.token,
			},
			body: JSON.stringify(journalBody),
		});
		if (!response.ok) {
			throw new Error("Failed to create new journal");
		}
		return await response.json();
	};

	const { mutate: addJournal, isLoading: loadingAddJournal } = useMutation(
		postJournal,
		{
			onSuccess: () => {
				// Success actions
				refreshPage();
			},
			onError: (error) => {
				// Error actions
				console.error(error);
				setIsAddJournalErrorToastOpen(true);
			},
		}
	);

	const handleSubmitJournal = () => {
		if (
			editorValue === "" ||
			editorValue === "<p><br></p>" ||
			titleValue === "" ||
			moodValue === "" ||
			typeValue === ""
		) {
			setIsCreateValidationErrorOpen(true);
			return;
		}

		addJournal({
			title: titleValue,
			description: editorValue,
			overall_mood: moodValue,
			type: typeValue?.toUpperCase(),
		});
	};

	return (
		<div className="create-journal-container">
			<h2>{CREATE_JOURNAL_HEADING}</h2>

			<IonItem>
				<IonInput
					onIonInput={handleTitleChange}
					label="Title"
					placeholder="Enter journal title"
				></IonInput>
			</IonItem>

			<IonItem style={{ maxWidth: "500px" }}>
				<IonSelect
					onIonChange={handleMoodChange}
					label="Overall Mood"
					placeholder="Select your mood"
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
				>
					<IonSelectOption value="Personal">Personal</IonSelectOption>
					<IonSelectOption value="Work">Work</IonSelectOption>
					<IonSelectOption value="Others">Others</IonSelectOption>
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
				onClick={handleSubmitJournal}
				disabled={loadingAddJournal}
			>
				{loadingAddJournal ? (
					<IonSpinner name="bubbles"></IonSpinner>
				) : (
					<>
						Create the Journal{" "}
						<IonIcon
							style={{ marginLeft: "6px" }}
							icon={addCircleOutline}
						></IonIcon>
					</>
				)}
			</IonButton>

			<IonToast
				color={"danger"}
				isOpen={isCreateValidationErrorOpen}
				message="please add all the required journal details."
				onDidDismiss={() => setIsCreateValidationErrorOpen(false)}
				duration={3300}
			></IonToast>

			<IonToast
				color={"danger"}
				isOpen={isAddJournalErrorToastOpen}
				message="unable to add journal, please try later."
				onDidDismiss={() => setIsAddJournalErrorToastOpen(false)}
				duration={3300}
			></IonToast>
		</div>
	);
};

export default CreateJournal;
