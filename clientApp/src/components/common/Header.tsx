import {
	IonBackButton,
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

const ActiveApp = ({ activeAppName }: { activeAppName: string }) => (
	<p>
		<b>Active App</b>: {activeAppName}
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
			history.push("/auth/nandemo/login");
		}
	}, [parsedUserInfo?.user_info]);

	return (
		<>
			<IonHeader>
				<IonToolbar color={"dark"}>
					<IonTitle>
						<div className="header-nandemo">
							{showBackButton && (
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
										<ActiveApp activeAppName={activeAppName} />
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
