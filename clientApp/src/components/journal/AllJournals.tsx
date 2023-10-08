import { useEffect, useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { NDEMO_API_URL } from "../../constants/url";
import { AllJournalType, JournalType } from "../../types/types";
import { checkUserInfo } from "../../utilities/helpers/auth";
import request from "../../utilities/helpers/request";
import "./AllJournals.css";
import { arrowForwardCircle, arrowBackCircle } from "ionicons/icons";
import { fixedLengthString, isObjectEmpty } from "../../utilities/helpers";
import { formatDateString } from "../../utilities/dates";

const AllJournals: React.FC = () => {
  const history = useHistory();
  const [currPage, setCurrPage] = useState<number>(1);
  const [showJournalById, setShowJournalById] = useState<boolean | string>(
    false
  );
  const parsedUserInfo = checkUserInfo();

  useEffect(() => {
    if (isObjectEmpty(parsedUserInfo)) {
      history.push("/auth/nandemo/login");
    }
  }, [parsedUserInfo?.user_info]);

  const {
    data: journalsData,
    isLoading: isLoadingJournals,
    refetch: refetchJournalsData,
  } = useQuery(
    `journalsData-${currPage}`,
    () =>
      request<AllJournalType>(
        NDEMO_API_URL + `/journals?page=${currPage}&limit=4`,
        {
          headers: {
            "Content-Type": "application/json",
            token: parsedUserInfo.token,
          },
          method: "GET",
        }
      )
        .then((res) => res)
        .catch((err) => console.log(err)),
    {
      refetchOnWindowFocus: false,
      enabled: parsedUserInfo?.token?.length > 0,
    }
  );

  const {
    data: journalsDataNextPage,
    isLoading: isLoadingJournalsNextPage,
    refetch: refetchJournalsNextPage,
  } = useQuery(
    `journalsDataNext-${currPage}`,
    () =>
      request<AllJournalType>(
        NDEMO_API_URL + `/journals?page=${currPage + 1}&limit=4`,
        {
          headers: {
            "Content-Type": "application/json",
            token: parsedUserInfo.token,
          },
          method: "GET",
        }
      )
        .then((res) => res)
        .catch((err) => console.log(err)),
    {
      refetchOnWindowFocus: false,
      enabled: parsedUserInfo?.token?.length > 0,
    }
  );

  if (isLoadingJournals || isLoadingJournalsNextPage)
    return (
      <div style={{ width: "80%", margin: "0 auto", marginTop: "25px" }}>
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
    );

  if (journalsData?.error?.includes("expired")) {
    localStorage.removeItem("user_info");
    history.push("/auth/nandemo/login");
  }

  const allJournals = journalsData?.journals;
  const allJournalsNextPage = journalsDataNextPage?.journals;

  let showNextPageJournals = false;
  if (allJournalsNextPage?.length && allJournalsNextPage?.length > 0) {
    showNextPageJournals = true;
  }

  const loadNextPageJournals = () => {
    setCurrPage(currPage + 1);
  };

  const loadPreviousPageJournals = () => {
    setCurrPage(currPage - 1);
  };

  const handleCardClick = () => {
    console.log("handleCardClick clicked");
    setShowJournalById("56463654564563");
  };

  if (showJournalById !== false) {
    return (
      <div>
        <h1>{showJournalById}</h1>
      </div>
    );
  }

  return (
    <div className="all-journal-container">
      {allJournals?.map((journalData: JournalType, index: number) => (
        <IonCard
          key={`${journalData?.title}-${index}`}
          onClick={handleCardClick}
        >
          <IonCardHeader>
            <IonCardTitle>
              {fixedLengthString(journalData?.title, 30)}
            </IonCardTitle>
            <IonCardSubtitle>
              {journalData?.created_at
                ? formatDateString(new Date(journalData?.created_at))
                : ""}
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            {fixedLengthString(journalData.description, 80)}
          </IonCardContent>
        </IonCard>
      ))}

      {currPage > 1 && (
        <IonButton onClick={loadPreviousPageJournals} color="dark">
          <IonIcon slot="start" icon={arrowBackCircle}></IonIcon>
          Previous
        </IonButton>
      )}

      {showNextPageJournals && (
        <IonButton onClick={loadNextPageJournals} color="dark">
          Next
          <IonIcon slot="end" icon={arrowForwardCircle}></IonIcon>
        </IonButton>
      )}
    </div>
  );
};

export default AllJournals;
