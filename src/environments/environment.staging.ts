// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  proxyUrl: 'https://app.stacksmarket.co/proxy/?url=',
  production: false,
  hj: '2650014',
  debug: true,
  appType: 'localApplication',
  mapApiKey: 'AIzaSyBXJToKANuBXhKFNtmTjbtM1DRxbqc_0zQ',
  builderAdmin: 'https://builder.staging.stacksmarket.co/wp-json/v4/',
  auth0: {
    domain: 'dev-l6eo3m2i7ghn6zve.us.auth0.com',
    clientId: 'uJLwMewpZiBmyjnNsj6KF1PLP1wyQHBo',
    audience: 'https://my-api.com',
    authorizationParams: {
      redirectUrl: window.location.origin,
    },
  },
  firebaseConfig: {
    apiKey: 'AIzaSyA00BUWrxC6HeXoI18rKFXRavTEeZwuu2s',
    authDomain: 'neat-planet-378416.firebaseapp.com',
    databaseURL: 'https://neat-planet-378416-default-rtdb.firebaseio.com',
    projectId: 'neat-planet-378416',
    storageBucket: 'neat-planet-378416.appspot.com',
    messagingSenderId: 'stacksSenderId',
    appId: '1:339787967114:web:75ab124244232034241b73',
    measurementId: 'G-RJRCW3EKC5',
  },
};