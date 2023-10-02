import { IonCol, IonRouterLink, IonRow } from "@ionic/react";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export const Action = (props: { message: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; link: string | undefined; text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (

    <IonRow className="ion-text-center ion-justify-content-center">
        <IonCol size="12">
            <p>
                { props.message }
                <IonRouterLink className="custom-link" routerLink={ props.link }> { props.text } &rarr;</IonRouterLink>
            </p>
        </IonCol>
    </IonRow>
);