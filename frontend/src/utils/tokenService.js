// utils/tokenService.js
const TOKEN_KEY = 'authToken'; // Consistent key

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const saveToken = (token) => {
  console.trace("🔍 saveToken called:", token); // <--- will log the full stack
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    const { id, username, account_type } = parseJwt(token);
    if (id) localStorage.setItem('user_id', id);
    if (account_type) localStorage.setItem('account_type', account_type);
    if (username) localStorage.setItem('username', username);
  }
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('account_type'); // ✅ match saved key
  localStorage.removeItem('user_id');
};

export const getUserRole = () => {
  return localStorage.getItem('account_type'); // ✅ match saved key
};

// JWT decode helper
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return {};
  }
};
