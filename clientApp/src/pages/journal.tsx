import {
  IonContent,
  IonPage,
} from "@ionic/react";
import { Link } from "react-router-dom";
import HeaderNandemo from "../components/common/Header";
import SubHeaderMobile from "../components/common/SubHeaderMobile";
import "./journalPage.css";

const JournalPage: React.FC = () => {
  return (
    <IonPage>
      <HeaderNandemo />

      <IonContent fullscreen>
        <SubHeaderMobile />

        <Link to={"/"}>Home</Link>
      </IonContent>
    </IonPage>
  );
};

export default JournalPage;
