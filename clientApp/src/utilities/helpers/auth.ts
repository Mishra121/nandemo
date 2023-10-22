export const checkUserInfo = () => {
	const userInfo = localStorage.getItem("user_info") ?? "{}";

	const parsedUserInfo = JSON.parse(userInfo);

	return parsedUserInfo;
};
