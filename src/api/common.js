import fetch from './fetch';
export default {
  clientAirport(params){//起运地&目的地
    return fetch.post('/clientAirport/list',params)
  },
}
