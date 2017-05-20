import apiSendRequest from './Api';

function apiGetWords(startOfWord) {
  return apiSendRequest(formatRequest(startOfWord))
    .then((raw_response) => formatResponse(raw_response))
}

function formatRequest(startOfWord) {
  const params = startOfWord.length > 0 ? {sp: startOfWord + '*', max: 20} : {}
  return {
    method: 'get',
    baseURL: 'https://api.datamuse.com',
    url: '/words',
    params: params,
    responseType: 'json',
  }
}

function formatResponse(raw_response) {
  const words = raw_response.data.reduce((acc, {word}) => acc.concat(word), []);
  return {words};
}

export default apiGetWords;