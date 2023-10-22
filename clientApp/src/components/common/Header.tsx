import {
	IonBackButton,
	IonButtons,
	IonHeader,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useLocation } from "react-router-dom";
import { getActiveAppName } from "../../utilities/helpers";
import useWindowDimensions from "../../utilities/hooks/use-window-dimensions";
import "./HeaderNandemo.css";

const ActiveApp = ({ activeAppName }: { activeAppName: string }) => (
	<p>
		<b>Active App</b>: {activeAppName}
	</p>
);

const HeaderNandemo: React.FC = () => {
	const { width: windowWidth } = useWindowDimensions();
	const isMobileView = windowWidth ? windowWidth <= 600 : false;
	const location = useLocation();
	const activeAppName = getActiveAppName(location.pathname);
	const showBackButton = location.pathname.includes("auth");

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
