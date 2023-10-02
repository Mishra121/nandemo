import {
  IonContent,
  IonPage,
  // IonPage,
  IonRouterLink,
} from "@ionic/react";
import HeaderNandemo from "../components/common/Header";
import SubHeaderMobile from "../components/common/SubHeaderMobile";
import "./expensePage.css";

const ExpenseManager: React.FC = () => {
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

export default ExpenseManager;
