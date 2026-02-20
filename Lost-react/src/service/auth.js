import api from "./api";


// Login: Saves tokens to LocalStorage
export const login = async (email, password) => {
  const response = await api.post("/users/login/", { email, password });
  
  if (response.data.access) {
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      const userObj = {
          id: response.data.user_id,
          email: response.data.email,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          is_verified: response.data.is_verified
      };
      
      // 3. Save User Data
      localStorage.setItem("user", JSON.stringify(userObj));
  }
  return response.data;
};

// register
export const register = async (userData) => {
  const response = await api.post("/users/register/", userData);
  return response.data;
};

// Google Login: Saves tokens to LocalStorage
export const googleLogin = async (googleToken) => {
    const response = await api.post("/users/google-login/", { auth_token: googleToken });
    
    if (response.data.tokens) {
        localStorage.setItem("access", response.data.tokens.access);
        localStorage.setItem("refresh", response.data.tokens.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
};

// Logout: Clears LocalStorage
export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/login";
};