/* eslint-disable react/react-in-jsx-scope */
import { useState, Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Skeleton from "react-loading-skeleton";
import {
	IonContent,
	IonIcon,
	IonPage,
	IonTabBar,
	IonTabButton,
} from "@ionic/react";
import { clipboard, create } from "ionicons/icons";
import HeaderNandemo from "../components/common/Header";
import SubHeaderMobile from "../components/common/SubHeaderMobile";
import "./journalPage.css";
import { JOURNALS, CREATE } from "../constants/journals";
import AllJournals from "../components/journal/AllJournals";

const CreateJournal = lazy(() => import("../components/journal/CreateJournal"));

const JournalPage: React.FC = () => {
	const [journalTabState, setJournalTabState] = useState<string>(JOURNALS);

	return (
		<ErrorBoundary fallback={<div>Something went wrong in Journal App</div>}>
			<IonPage>
				<HeaderNandemo />

				<IonContent fullscreen>
					<SubHeaderMobile />

					{journalTabState === JOURNALS && <AllJournals />}

					{journalTabState === CREATE && (
						<Suspense
							fallback={
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
								</div>
							}
						>
							<CreateJournal />
						</Suspense>
					)}

					
				</IonContent>

				<div className="journal-tab-bar">
						<IonTabBar color={"dark"}>
							<IonTabButton
								tab="all-journals"
								onClick={() => setJournalTabState(JOURNALS)}
							>
								<IonIcon icon={clipboard} /> Journals
							</IonTabButton>
							<IonTabButton
								tab="create-or-edit"
								onClick={() => setJournalTabState(CREATE)}
							>
								<IonIcon icon={create} /> Create
							</IonTabButton>
						</IonTabBar>
					</div>
			</IonPage>
		</ErrorBoundary>
	);
};

export default JournalPage;
