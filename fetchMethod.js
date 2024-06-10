import Cookies from 'universal-cookie';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

async function customFetch(url, method, formData, headers = {}) {
  try {
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get('token');

    const defaultHeaders = {
      authorization: token,
    };

    const mergedHeaders = { ...defaultHeaders, ...headers };

    const response = await fetch(`${apiUrl}${url}`, {
      method,
      headers: mergedHeaders,
      body: formData,
    });

    if (response.status === 401) {
      cookies.remove('token');
      window.location.href = '/login';
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response;
  } catch (err) {
    console.error('Fetch error: ', err);
    throw err;
  }
}

export default customFetch;
