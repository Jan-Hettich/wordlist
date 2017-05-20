import axios from 'axios';

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
  const ms = (sp && sp.endsWith('d*')) ? 1000 : 0;
  return new Promise((resolve) => setTimeout(() => resolve(raw_response), ms));
}

function discardIfOutOfOrder(raw_response) {
  const {config: {url, params, requestNumber}} = raw_response;
  if (requestNumber <= lastResponse) {
    const request = JSON.stringify({url, params});
    throw new Error(`discarding response received out of order for:\n\t${request}`);
  }
  lastResponse = requestNumber;
  return raw_response;
}

// TODO: Parameterize the handling of sequencing errors with strategies:  ignore, discard, resequence.

export default apiSendRequest;
