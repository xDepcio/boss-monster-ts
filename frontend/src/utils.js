export const SFetch = (url, options) => {
    return fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            "ngrok-skip-browser-warning": "69420"
        }
    })
};
