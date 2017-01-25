import {
  isLoginActive as devIsLoginActive,
  startLogin as devStartLogin,
  continueLogin as devContinueLogin,
  getSelf as devGetSelf,
  getList as devGetList,
  createItem as devCreateItem,
  vote as devVote
} from "./api.dev";

const API_URL = "https://oswils44oj.execute-api.us-east-1.amazonaws.com/production/";
const GITHUB_CLIENT_ID = "4d355e2799cb8926c665";
const PRODUCTION_HOST = "webpack.js.org";

// You can test the production mode with a host entry,
// or by setting PRODUCTION_HOST to "localhost:3000" and stealing localStorage.voteAppToken from the production side.

export function isLoginActive() {
  if(window.location.host !== PRODUCTION_HOST)
    return devIsLoginActive();
  return /^\?code=([^&]*)&state=([^&]*)/.test(window.location.search);
}

export function startLogin(callbackUrl) {
  if(window.location.host !== PRODUCTION_HOST)
    return devStartLogin(callbackUrl);
  let state = "" + Math.random();
  window.localStorage.githubState = state;
  window.location = "https://github.com/login/oauth/authorize?client_id=" + GITHUB_CLIENT_ID + "&scope=user:email&state=" + state + "&allow_signup=false&redirect_uri=" + encodeURIComponent(callbackUrl);
  return Promise.resolve();
}

export function continueLogin() {
  if(window.location.host !== PRODUCTION_HOST)
    return devContinueLogin();
  const match = /^\?code=([^&]*)&state=([^&]*)/.exec(window.location.search);
  if(match) {
    return login(match[1], match[2]).then(result => {
      setTimeout(() => {
        let href = window.location.href;
        window.location = href.substr(0, href.length - window.location.search.length);
      }, 100);
      return result;
    });
  }
  return Promise.resolve();
}

function login(code, state) {
  if(state !== window.localStorage.githubState)
    return Promise.reject(new Error("Request state doesn't match (Login was triggered by 3rd party)"));
  delete window.localStorage.githubState;
  return fetch(API_URL + "/login", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      code,
      state
    })
  }).then((res) => res.json()).then(result => {
    return result.token;
  });
}

export function getSelf(token) {
  if(window.location.host !== PRODUCTION_HOST)
    return devGetSelf(token);
  return fetch(API_URL + "/self?token=" + token, {
    mode: "cors"
  }).then((res) => res.json());
}

export function getList(token, name) {
  if(window.location.host !== PRODUCTION_HOST)
    return devGetList(token, name);
  return fetch(API_URL + "/list/" + name + (token ? "?token=" + token : ""), {
    mode: "cors"
  }).then((res) => res.json());
}

export function createItem(token, list, title, description) {
  if(window.location.host !== PRODUCTION_HOST)
    return devCreateItem(token, list, title, description);
  return fetch(API_URL + "/list/" + list + "?token=" + token, {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      description
    }),
    method: "POST"
  }).then((res) => res.json());
}

export function vote(token, itemId, voteName, value) {
  if(window.location.host !== PRODUCTION_HOST)
    return devVote(token, itemId, voteName, value);
  return fetch(API_URL + "/vote/" + itemId + "/" + voteName + "?token=" + token, {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      count: value
    }),
    method: "POST"
  }).then((res) => res.json()).then(result => {
    return true;
  });
}
