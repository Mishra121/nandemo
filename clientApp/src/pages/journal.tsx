import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
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
import CreateJournal from "../components/journal/CreateJournal";

const JournalPage: React.FC = () => {
  const [journalTabState, setJournalTabState] = useState<string>(JOURNALS);

  return (
    <ErrorBoundary fallback={<div>Something went wrong in Journal App</div>}>
      <IonPage>
        <HeaderNandemo />

        <IonContent fullscreen>
          <SubHeaderMobile />

          {journalTabState === JOURNALS && <AllJournals />}

          {journalTabState === CREATE && <CreateJournal />}

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
        </IonContent>
      </IonPage>
    </ErrorBoundary>
  );
};

export default JournalPage;
