import axios from 'axios'

const $axios = axios.create({
  baseURL: `${process.env.BASE_API_URL}/api`,
  withCredentials: true,
})

export default $axios
