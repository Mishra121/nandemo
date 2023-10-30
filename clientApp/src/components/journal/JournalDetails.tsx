import {
	IonGrid,
	IonRow,
	IonCardSubtitle,
	IonCol,
	IonCardTitle,
	IonBadge,
	IonButton,
	IonIcon,
} from "@ionic/react";
import { arrowBackSharp } from "ionicons/icons";
import { useHistory } from "react-router";
import { JournalType } from "../../types/types";
import { formatDateString } from "../../utilities/dates";
import { fixedLengthString } from "../../utilities/helpers";
import "./JournalDetails.css";

interface JournalDetailsProps {
	journalData: JournalType;
}

const JournalDetails = (props: JournalDetailsProps) => {
	const { journalData } = props;
	const history = useHistory();

	const {
		title = "",
		description,
		created_at,
		overall_mood,
		type: journalType,
	} = journalData;

	const handleJournalsBtnClick = () => {
		history.push("/journal-app/");
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
				<img
					src="https://ionicframework.com/blog/wp-content/uploads/2021/07/how-to-convince-your-boss_image_1aug2021.png"
					alt="post header"
					height={"310px"}
				/>

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
