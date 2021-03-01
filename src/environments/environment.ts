// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  SITE_NAME: 'EWO',
  // apiUrl: 'http://198.251.65.146:8900',
  apiUrl: 'http://localhost:8900',
  SITE_URL: 'http://localhost:4203',
  cookieDomain: 'localhost',
  WP_LINK: 'http://localhost/',
  WP_STORIES_LINK: 'http://192.168.64.2/stories/',
  DISSCUSSION_LINK: 'http://localhost:4567/',
  WP_API_URL: 'http://192.168.64.2/wp-apis.php',
  // WP_API_URL: 'http://jcsoftwaresolution.com/stories/wp-apis.php',
  notificationURL: 'http://localhost:4567/notifications',
  bucketURL: 'https://ewodemo.s3.amazonaws.com/',
  chatURL: 'http://localhost:4567/user',
  FACEBOOK_CLIENT_ID: '2704495453005792',
  GOOGLE_OAUTH_CLIENT_ID: '11022523496-vn1eop9jueo4sj67k93ceiluo06nu2ag.apps.googleusercontent.com',
  GOOGLE_OAUTH_API_KEY: 'AIzaSyDNkUirQqq6T0L0TqupvzdTwrZ9FPq380Q',
  GOOGLE_reCAPTCHA_KEY: '6Lffz80ZAAAAANKeCW-ou4lA0SaGUUvgcav0a2kI'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
