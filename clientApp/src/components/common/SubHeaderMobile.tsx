import { IonButton, IonContent, IonIcon, IonPopover } from "@ionic/react";
import { arrowDown } from "ionicons/icons";
import { useLocation } from "react-router";
import { getActiveAppName } from "../../utilities/helpers";
import useWindowDimensions from "../../utilities/hooks/use-window-dimensions";

export default function SubHeaderMobile() {
  const { width: windowWidth } = useWindowDimensions();
  const isMobileView = windowWidth ? windowWidth <= 600 : false;
  const location = useLocation();
  const activeAppName = getActiveAppName(location.pathname);
  return (
    <>
      {isMobileView && activeAppName !== "" && (
        <div style={{ marginTop: "15px", marginLeft: "55px" }}>
          <IonButton color={"warning"} size={"small"} onClick={() => {}}>
            <p>
              <b>Active Screen</b>: {activeAppName}
            </p>
          </IonButton>
        </div>
      )}
    </>
  );
}
