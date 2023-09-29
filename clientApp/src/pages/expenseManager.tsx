import {
  IonContent,
  IonPage,
  // IonPage,
} from "@ionic/react";
import { Link } from "react-router-dom";
import HeaderNandemo from "../components/common/Header";
import SubHeaderMobile from "../components/common/SubHeaderMobile";
import "./expensePage.css";

const ExpenseManager: React.FC = () => {
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

export default ExpenseManager;
