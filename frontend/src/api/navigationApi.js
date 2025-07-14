import {apiClient} from "@/api/apiClient.js";

export const navigationApi = {
    getNavigationItems: () => apiClient.get('/navigation'),
    getAdminNavigationItems: () => apiClient.get('/navigation/admin'),
}