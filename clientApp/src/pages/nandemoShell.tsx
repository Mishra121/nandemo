import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage,
  IonThumbnail,
} from "@ionic/react";
import HeaderNandemo from "../components/common/Header";

import { useHistory } from "react-router-dom";

import "./nandemoShellPage.css";

const NandemoShell: React.FC = () => {
  const history = useHistory();

  const nandemoAppOptions = [
    {
      name: "Your Profile",
      description: "profile section coming soon...",
      url: "",
    },
    {
      name: "Journal It",
      description: "your easy helper to maintain daily activities",
      url: "/journal-app",
    },
    {
      name: "Budget It",
      description: "user friendly expense manager at service",
      url: "/expense-manager",
    },
    {
      name: "Random Thoughts",
      description: "Discipline is the bridge between goals and accomplishment",
      url: "",
    },
  ];

  const redirectToModule = (url: string) => {
    if (url !== "") {
      history.push(url);
    }
  };

  return (
    <IonPage>
      <HeaderNandemo />

      <IonContent fullscreen={true}>
        <div className="nandemoshell-heading">
          <h4>
            Select one of the app to use from the nandemo selection panel.
          </h4>
        </div>

        <div className="nandemoshell-selection">
          {nandemoAppOptions.map((nandemoAppOption) => (
            <div
              onClick={() => redirectToModule(nandemoAppOption.url)}
              className="nandemoshell_selection__card"
            >
              <IonCard
                color={
                  nandemoAppOption.name !== "Random Thoughts"
                    ? "dark"
                    : "tertiary"
                }
              >
                <IonCardHeader>
                  <div className="nandemoshell_selection__cardheader">
                    {nandemoAppOption.name !== "Random Thoughts" && (
                      <IonThumbnail>
                        <img
                          alt="Silhouette of mountains"
                          src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
                        />
                      </IonThumbnail>
                    )}
                    <IonCardTitle style={{ marginTop: "8px" }}>
                      {nandemoAppOption.name}
                    </IonCardTitle>
                  </div>
                </IonCardHeader>

                <div className="nandemoshell_selection__cardcontent">
                  <IonCardContent>
                    {nandemoAppOption.description}
                  </IonCardContent>
                </div>
              </IonCard>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NandemoShell;
