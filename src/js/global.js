"use strict";

  /* ------------------------+-------------------------------+
  |   .----.  .--.  .---.    |  CREATED BY TEAM JJS          |
  |   | {}  }/ {} \{_   _}   +-------------------------------+
  |   | .--'/  /\  \ | |     |  Joonas Kauppinen             |
  |   `-'   `-'  `-' `-'     |  "Jamie" GeonHui Yoon         |
  |   - a place for pets -   |  Samuli Virtanen              |
  +--------------------------+-------------------------------+
  | https://github.com/joonasmkauppinen/pat-project-backend  |
  | https://github.com/joonasmkauppinen/pat-project-frontend |
  +-------------------------------------------------------- */


/*
________________________________________________________________________________________________________

       _____ _    _          _   _  _____ ______   _______ _    _ ______  _____ ______   
      / ____| |  | |   /\   | \ | |/ ____|  ____| |__   __| |  | |  ____|/ ____|  ____|_ 
     | |    | |__| |  /  \  |  \| | |  __| |__       | |  | |__| | |__  | (___ | |__  (_)
     | |    |  __  | / /\ \ | . ` | | |_ |  __|      | |  |  __  |  __|  \___ \|  __|    
     | |____| |  | |/ ____ \| |\  | |__| | |____     | |  | |  | | |____ ____) | |____ _ 
      \_____|_|  |_/_/    \_\_| \_|\_____|______|    |_|  |_|  |_|______|_____/|______(_)             */


        const API_URL = 'https://backend-url/';   // public-server HTTPS address (or https address)
        const BASE_ADDR = '/pat-project-frontend/'; // if running in server root folder (path), set this to '/'

        // Display all the debug messages in the console
        const DEBUG_MODE = false;

        // Delay redirection for 2 seconds (only works in DEBUG_MODE
        const REDIRECT_DELAY = false;

        /* Redirect automatically from wrong page to right page if SESSION state is wrong. 
        Plase note: Does not make effect if DEBUG_MODE = false */
        const AUTO_REDIRECT = true;

/*______________________________________________________________________________________________________*/




let sessionExists = false;
let sessionID = '';
let sessionToken = '';
let sessionPermissions = [];
let sessionLoggedInUserID = -1;

const conLog = ( m ) => {
  // Print debug messages to the Console, if DEBUG_MODE is ACTIVE (TRUE).
  if ( DEBUG_MODE ) {
      console.log(m);
    }
  }

const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

const getJSON = async ( rMethod , request, rParams='', dataObject = {}, sendSessionInfo=1 ) => {

  return new Promise((resolve, reject) => {

    var d = new Date();
    var n = d.getTime();

    conLog({ function: 'getJSON'});
    conLog({ f: 'getJSON', method: rMethod, req: request, fullPath: API_URL + request + rParams + ( sendSessionInfo && sessionExists ? ( rParams == '' ? '?' : '&' ) + 'session_id=' + sessionID + '&session_token=' + sessionToken : '' ) });
    
    if ( sendSessionInfo ) {  
      dataObject.session_id    = sessionID;
      dataObject.session_token = sessionToken;
      }

    conLog(Object.assign({f: 'getJSON', description: 'ajax-response-data-object'}, dataObject));

    const dataParams = {
        method: rMethod,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      };
    
    dataParams.req_time = n;
    
    if ( rMethod != "GET" ) {
      dataParams.body = serialize(dataObject);
      }

    const response = fetch( API_URL + request + rParams + ( sendSessionInfo && sessionExists ? ( rParams == '' ? '?' : '&' ) + 'session_id=' + sessionID + '&session_token=' + sessionToken : '' ), dataParams).then( (r) => {
        resolve(r.json());
      });
    
    conLog({ f: 'getJSON', finished: 'TRUE'});
    
    });
  
  }
  
const isSession = () => sessionExists;

const isPermission = (p) => {
  if ( isSession() ) {
    if ( sessionPermissions.indexOf(p) == -1 ) {
      return false;
      }else{
      return true;
      }
    }else{
      conLog('[isPermission] WARNING!!! You should not call this function before session exists! ');
      return false;
    }
  }

const setCookie = (cname, cvalue, exdays) => {
  let d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
  }

const confirmDialog = async ( text ) => {
  return new Promise((resolve, reject) => {
    if ( confirm ( text ) ) {
      resolve('ok');
      }else{
      resolve('cancel');
      }
    });
  }

const alertDialog = ( text ) => {
  alert ( text );
};