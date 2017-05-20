import axios from 'axios';

function apiGetWords(startOfWord) {
  const params = startOfWord.length > 0 ? {sp: startOfWord + '*', max: 20} : {}
  const request = {
    method: 'get',
    baseURL: 'https://api.datamuse.com',
    url: '/words',
    params: params,
    responseType: 'json',
  }
  return apiSendRequest(request)
    .then((raw_response) => formatResponse(raw_response))
}

function formatResponse(raw_response) {
  return new Promise((resolve, reject) => {
    const words = raw_response.data.reduce((acc, {word}) => acc.concat(word), []);
    resolve({words});
  });
}

let lastRequest = 0;
let lastResponse = 0;

function apiSendRequest(request) {
  request = {...request, requestNumber: ++lastRequest};
  return axios(request)
    .then((raw_response) => artificialDelay(raw_response))
    .then((raw_response) => discardIfOutOfOrder(raw_response));
}

function artificialDelay(raw_response) {
  const {config: {params: {sp}}} = raw_response;
  const ms = sp.endsWith('d*') ? 1000 : 0;
  return new Promise((resolve) => setTimeout(() => resolve(raw_response), ms));
}

function discardIfOutOfOrder(raw_response) {
  return new Promise((resolve, reject) => {
    const {config: {params: {sp}, requestNumber}} = raw_response;
    if (requestNumber <= lastResponse) {
      throw new Error(`discarding response received out of order for: ${sp}`);
    }
    lastResponse = requestNumber;
    resolve(raw_response);
  });
}

export {apiGetWords};