import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonHeader,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getActiveAppName, isObjectEmpty } from "../../utilities/helpers";
import { checkUserInfo } from "../../utilities/helpers/auth";
import useWindowDimensions from "../../utilities/hooks/use-window-dimensions";
import "./HeaderNandemo.css";

const ActiveApp = ({
	activeAppName,
	redirectToHome,
}: {
	activeAppName: string;
	redirectToHome: () => void;
}) => (
	<p>
		<b>Active App</b>: {activeAppName}
		<IonButton
			style={{ marginLeft: "10px", marginTop: 0 }}
			color={"warning"}
			fill={"outline"}
			size={"small"}
			onClick={redirectToHome}
		>
			Go Home
		</IonButton>
	</p>
);

const authorizedPages = ["journal-app", "nandemo-select", "expense-manager"];

const HeaderNandemo: React.FC = () => {
	const history = useHistory();
	const { width: windowWidth } = useWindowDimensions();
	const isMobileView = windowWidth ? windowWidth <= 600 : false;
	const location = useLocation();
	const activeAppName = getActiveAppName(location.pathname);
	const showBackButton = location.pathname.includes("auth");
	const pushedFrom = history.location.state ?? {};
	let isPushedFromNoAuthZone = false;

	if (typeof pushedFrom === "object" && !isObjectEmpty(pushedFrom)) {
		if ("from" in pushedFrom) {
			isPushedFromNoAuthZone = pushedFrom?.from === "NO_AUTH";
		}
	}
	const parsedUserInfo = checkUserInfo();
	const isAuthorizedPage = authorizedPages?.find(
		(pageName) =>
			`/${pageName}` === location.pathname ||
			`/${pageName}/` === location.pathname
	);

	useEffect(() => {
		if (
			isObjectEmpty(parsedUserInfo) &&
			isAuthorizedPage &&
			isAuthorizedPage?.length > 0
		) {
			history.push("/auth/nandemo/login", { from: "NO_AUTH" });
		}
	}, [parsedUserInfo?.user_info]);

	const redirectToHome = () => {
		history.push("/nandemo-select");
	};

	return (
		<>
			<IonHeader data-testid="test-header-nandemo">
				<IonToolbar color={"dark"}>
					<IonTitle>
						<div className="header-nandemo">
							{showBackButton && !isPushedFromNoAuthZone && (
								<IonButtons color="white">
									<IonBackButton
										icon={arrowBack}
										text=""
										className="custom-back"
									/>
								</IonButtons>
							)}
							<p>NanDemo</p>

							<div className="active-app-content">
								{!isMobileView && activeAppName !== "" && (
									<div>
										<ActiveApp
											activeAppName={activeAppName}
											redirectToHome={redirectToHome}
										/>
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
