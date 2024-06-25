import Cookies from 'universal-cookie';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

async function customFetch(url, method, formData, headers = {}) {
  try {
    const cookies = new Cookies(null, { path: '/' });
    const token = await cookies.get('token');
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
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
      const data = await response.json();
      return { data, status: response.status };
    }
    return { data: response, status: response.status };
  } catch (err) {
    console.error('Fetch error: ', err);
    throw err;
  }
}

export default customFetch;
