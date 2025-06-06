// utils/tokenService.js
const TOKEN_KEY = 'authToken'; // Consistent key

export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const saveToken = (token) => {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
    const { id, username, account_type } = parseJwt(token);
    if (id) sessionStorage.setItem('user_id', id);
    if (account_type) sessionStorage.setItem('account_type', account_type);
    if (username) sessionStorage.setItem('username', username);
  }
};

export const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem('account_type'); // ✅ match saved key
  sessionStorage.removeItem('user_id');
  sessionStorage.removeItem('username');
};

export const getUserRole = () => {
  return sessionStorage.getItem('account_type'); // ✅ match saved key
};

// JWT decode helper
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return {};
  }
};
