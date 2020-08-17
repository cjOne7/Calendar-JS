const msalConfig = {
    auth: {
      clientId: 'f5d0e761-bd4f-43c0-a71c-691c02e3ce45',
      redirectUri: 'http://localhost:8080'
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
      forceRefresh: false
    }
  };
  
  const loginRequest = {
    scopes: [
      'openid',
      'profile',
      'user.read',
      'calendars.readwrite'
    ]
  }