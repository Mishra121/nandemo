// Make the `request` function generic
// to specify the return data type:
export default function request<TResponse>(
	url: string,
	config: RequestInit = {}
	// This function is async, it will return a Promise:
): Promise<TResponse> {
	return fetch(url, config)
		.then((response) => response.json())
		.then((data) => data as TResponse);
}
