import { Platform } from 'react-native';

// Production API URL (your VPS)
const PROD_API_URL = 'http://168.231.124.16/api';

// Development API URL
const DEV_API_URL = Platform.select({
    android: 'http://10.0.2.2:5000/api',
    ios: 'http://localhost:5000/api',
    default: 'http://localhost:5000/api',
});

// Use production URL in release builds, dev URL in development
export const BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

class ApiClient {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
    }

    async get(endpoint: string, params?: any) {
        let url = endpoint;
        if (params) {
            const query = Object.keys(params)
                .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
                .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
                .join('&');
            if (query) {
                url += (url.includes('?') ? '&' : '?') + query;
            }
        }
        return this.request(url, 'GET');
    }

    async post(endpoint: string, data: any) {
        return this.request(endpoint, 'POST', data);
    }

    async patch(endpoint: string, data: any) {
        return this.request(endpoint, 'PATCH', data);
    }

    async delete(endpoint: string) {
        return this.request(endpoint, 'DELETE');
    }

    private async request(endpoint: string, method: string, data?: any) {
        const headers: any = {};

        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        console.log(`API Request: ${method} ${BASE_URL}${endpoint}`);

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method,
                headers,
                body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'API request failed');
            }

            return responseData;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

export const api = new ApiClient();
