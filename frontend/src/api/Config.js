export const API_IP = "172.18.4.49";

export const getApiUrl = (model) => `http://${API_IP}/Artemis/backend/api/models/${model}.php`;

export const getLoginUrl = () => `http://${API_IP}/Artemis/backend/login.php`;