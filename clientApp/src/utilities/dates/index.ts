export const formatDateString = (date: Date) => {
	const yyyy = date.getFullYear();
	const mm = date.getMonth() + 1;
	const dd = date.getDate();
	let strMM = String(mm);
	let strDD = String(dd);

	if (dd < 10) strDD = "0" + dd;
	if (mm < 10) strMM = "0" + mm;

	const formattedDate = strDD + "/" + strMM + "/" + yyyy;

	return formattedDate;
};
