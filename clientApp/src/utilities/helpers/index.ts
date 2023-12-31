import { isPlatform } from "@ionic/react";

export const getActiveAppName = (pathName: string): string => {
	if (pathName.includes("journal-app")) return "Journal";
	if (pathName.includes("expense-manager")) return "BudgetMod";

	return "";
};

export function randomInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const fixedLengthString = (text: string, neededLength: number) => {
	if (text.length > neededLength) {
		const newText = text.slice(0, 80) + "...";
		return newText;
	}

	return text;
};

export const isObjectEmpty = (objectName: object) => {
	return (
		Object.keys(objectName).length === 0 && objectName.constructor === Object
	);
};

export const refreshPage = () => {
	window.location.reload();
};

export const isMobilePlatform = () => {
	const isIos = isPlatform("ios");
	const isAndroid = isPlatform("android");

	if (isIos || isAndroid) return true;

	return false;
};
