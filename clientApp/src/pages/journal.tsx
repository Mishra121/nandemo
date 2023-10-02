import {
  IonContent,
  IonPage,
  IonRouterLink,
} from "@ionic/react";
import HeaderNandemo from "../components/common/Header";
import SubHeaderMobile from "../components/common/SubHeaderMobile";
import "./journalPage.css";

const JournalPage: React.FC = () => {
  return (
    <IonPage>
      <HeaderNandemo />

      <IonContent fullscreen>
        <SubHeaderMobile />

        <IonRouterLink routerLink={"/"}>Home</IonRouterLink>
      </IonContent>
    </IonPage>
  );
};

export default JournalPage;
