export const environment = {
  production: true
};

export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  databaseUrl: 'YOUR_DB_URL',
  authSignInUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
  authResetPasswordUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode',
  authRefreshTokenUrl: 'https://securetoken.googleapis.com/v1/token'
};