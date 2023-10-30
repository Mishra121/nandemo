import { IonContent, IonPage } from "@ionic/react";
import { useParams } from "react-router";
import HeaderNandemo from "../components/common/Header";
import EditJournal from "../components/journal/EditJournal";

type EditSelectedJournalParams = {
	journalId: string;
};

const EditSelectedJournal = () => {
	const params = useParams<EditSelectedJournalParams>();
	const journalId = params?.journalId;

	return (
		<IonPage>
			<HeaderNandemo />

			<IonContent fullscreen>
				<EditJournal journalId={journalId} />
			</IonContent>
		</IonPage>
	);
};

export default EditSelectedJournal;
