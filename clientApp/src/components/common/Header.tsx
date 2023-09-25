import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPopover,
  IonContent,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { arrowDown } from "ionicons/icons";
import useWindowDimensions from "../../utilities/hooks/use-window-dimensions";
import "./HeaderNandemo.css";

const ActiveApp = ({ activeAppName }: { activeAppName: string }) => (
  <p>
    <b>Active App</b>: {activeAppName}
  </p>
);

const HeaderNandemo: React.FC = (props) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobileView = windowWidth ? windowWidth <= 600 : false;
  const activeAppName = "Budget";

  return (
    <>
      <IonHeader>
        <IonToolbar color={"dark"}>
          <IonTitle>
            <div className="header-nandemo">
              <p>NanDemo</p>

              <div className="active-app-content">
                {!isMobileView && (
                  <div>
                    <ActiveApp activeAppName={activeAppName} />
                  </div>
                )}

                {isMobileView && (
                  <div style={{ marginTop: "15px" }}>
                    <IonButton
                      color={"light"}
                      size={"small"}
                      id="click-trigger"
                    >
                      <IonIcon aria-hidden="true" icon={arrowDown} />
                    </IonButton>
                    <IonPopover trigger="click-trigger" triggerAction="click">
                      <IonContent class="ion-padding">
                        <ActiveApp activeAppName={activeAppName} />
                      </IonContent>
                    </IonPopover>
                  </div>
                )}
              </div>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default HeaderNandemo;
