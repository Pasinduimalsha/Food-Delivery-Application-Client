import axios from "axios";

// To avoid CORS errors locally, we rely on standard Vite Proxy routing by sending requests relative to localhost (`""`) in development. 
// In production or true builds, it uses the hardcoded explicit URL.
const API_BASE_URL = "http://98.83.117.74:8081/";

const apiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


const getErrorMessage = (error) => {
    if (error.response) {
        return error.response.data.message || "Server error";
    } else if (error.request) {
        return "No response from server";
    } else {
        return "Request failed";
    }
};

// apiService.interceptors.request.use(async (config) => {
//     try {
//         const { store } = ReduxStore;
//         const token = store.getState().user.token;

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     } catch (error) {
//         console.error("Error while setting Authorization header:", error);
//         throw new Error("Failed to set Authorization header");
//     }
// });

apiService.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const errorMessage = getErrorMessage(error);

        // if (error.response && error.response.status === 403) {
        //     return Promise.reject("Session is expired, Please log in again");
        // }

        console.error("API request failed:", errorMessage);
        return Promise.reject(errorMessage);
    }
);

export default apiService;
