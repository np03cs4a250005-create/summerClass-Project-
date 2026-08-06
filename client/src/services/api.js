const BASE_URL = 'http://localhost:5000/api';

/**
 * Native fetch API client wrapper to connect React Frontend with Express + SQLite Backend
 */
async function fetchAPI(endpoint, method = 'GET', body = null, headers = {}) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers,
        },
    };

    if (body) {
        config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        let data = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = text ? { message: text } : null;
        }

        if (!response.ok) {
            const error = new Error(data?.error || `Request failed with status ${response.status}`);
            error.response = { status: response.status, data };
            throw error;
        }

        return { data, status: response.status };
    } catch (err) {
        if (!err.response) {
            err.response = { status: 500, data: { error: err.message || 'Network Error connecting to backend' } };
        }
        throw err;
    }
}

export const authAPI = {
    login: (data) => fetchAPI('/auth/login', 'POST', data),
    signup: (data) => fetchAPI('/auth/signup', 'POST', data),
};

export const eventsAPI = {
    getAll: () => fetchAPI('/events', 'GET'),
    getById: (id) => fetchAPI(`/events/${id}`, 'GET'),
    create: (data) => fetchAPI('/events', 'POST', data),
    update: (id, data) => fetchAPI(`/events/${id}`, 'PUT', data),
    duplicate: (id) => fetchAPI(`/events/${id}/duplicate`, 'POST'),
    delete: (id) => fetchAPI(`/events/${id}`, 'DELETE'),
};

export const venuesAPI = {
    getAll: () => fetchAPI('/venues', 'GET'),
    create: (data) => fetchAPI('/venues', 'POST', data),
    delete: (id) => fetchAPI(`/venues/${id}`, 'DELETE'),
};

export const attendeesAPI = {
    getAll: () => fetchAPI('/attendees', 'GET'),
    create: (data) => fetchAPI('/attendees', 'POST', data),
    delete: (id) => fetchAPI(`/attendees/${id}`, 'DELETE'),
};

export const ticketsAPI = {
    getAll: () => fetchAPI('/tickets', 'GET'),
    create: (data) => fetchAPI('/tickets', 'POST', data),
};

export const registrationsAPI = {
    getAll: () => fetchAPI('/registrations', 'GET'),
    create: (data) => fetchAPI('/registrations', 'POST', data),
    approve: (id) => fetchAPI(`/registrations/${id}/approve`, 'PATCH'),
};

export const tasksAPI = {
    getAll: () => fetchAPI('/tasks', 'GET'),
    create: (data) => fetchAPI('/tasks', 'POST', data),
    updateProgress: (id, data) => fetchAPI(`/tasks/${id}/progress`, 'PATCH', data),
};

export const feedbackAPI = {
    getAll: () => fetchAPI('/feedback', 'GET'),
    create: (data) => fetchAPI('/feedback', 'POST', data),
    reply: (id, reply) => fetchAPI(`/feedback/${id}/reply`, 'POST', { reply }),
};

export const chatAPI = {
    getAll: () => fetchAPI('/chat', 'GET'),
    send: (message) => fetchAPI('/chat', 'POST', message),
};

export const financeAPI = {
    getAll: () => fetchAPI('/finance', 'GET'),
    addExpense: (data) => fetchAPI('/finance/expenses', 'POST', data),
};

export const logsAPI = {
    getAll: () => fetchAPI('/logs', 'GET'),
};

export const emailAPI = {
    send: (data) => fetchAPI('/email/send', 'POST', data),
    broadcast: (data) => fetchAPI('/email/broadcast', 'POST', data),
};

export default {
    get: (url) => fetchAPI(url, 'GET'),
    post: (url, data) => fetchAPI(url, 'POST', data),
    put: (url, data) => fetchAPI(url, 'PUT', data),
    patch: (url, data) => fetchAPI(url, 'PATCH', data),
    delete: (url) => fetchAPI(url, 'DELETE'),
};
