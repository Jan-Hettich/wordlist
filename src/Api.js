import axios from 'axios';

// Next step:  break this into specific (get words) and generic (send/receive/delay/etc.) parts


function apiGetWords(startOfWord) {
  return apiSendRequest(startOfWord)
    .then((raw_response) => delay(raw_response, 1000, () => startOfWord.endsWith('d')))
    .then((raw_response) => apiResponse(raw_response));
}

let lastRequest = 0;
let lastResponse = 0;

function apiSendRequest(startOfWord) {
  const params = startOfWord.length > 0 ? {sp: startOfWord + '*', max: 20} : {}
  return axios({
    method: 'get',
    baseURL: 'https://api.datamuse.com',
    url: '/words',
    params: params,
    responseType: 'json',
    requestNumber: ++lastRequest,
  });
}

function delay(_, ms, condition) {
  ms = condition() ? ms : 0;
  return new Promise((resolve) => setTimeout(() => resolve(_), ms));
}

function apiResponse(raw_response) {
  console.log("raw_response: ", raw_response);
  return new Promise((resolve, reject) => {
    try {
      checkResponseOrder(raw_response);
      const words = raw_response.data.reduce((acc, {word}) => acc.concat(word), []);
      resolve({words});
    }
    catch (error) {
      reject(error);
    }
  });
}

function checkResponseOrder({config: {params: {sp}, requestNumber}}) {
  if (requestNumber <= lastResponse) {
    throw new Error(`discarding response received out of order for: ${sp}`);
  }
  return lastResponse = requestNumber;
}

export {apiGetWords};