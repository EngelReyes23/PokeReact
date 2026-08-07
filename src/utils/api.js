const API_URL = 'https://pokeapi.co/api/v2'

const createAPI = (baseURL) => {
  return new Proxy(
    {},
    {
      get: (_, endpoint) => {
        let url = `${baseURL}/${endpoint}`

        return async (name = '', queryParams = '', options = {}) => {
          if (['next', 'previous'].includes(endpoint)) url = name
          else url += `/${name}`

          url += `?${new URLSearchParams(queryParams).toString()}`

          const res = await fetch(url, options)
          return res.json()
        }
      }
    }
  )
}

export const api = createAPI(API_URL)
