import Axios from 'axios'

// Read token from localStorage
const token = localStorage.getItem('access_token')

export default Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json'
    }
})

const send_json = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json'
    }
})


// สร้าง Axios instance สำหรับ formData
const send_formdata  = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API,
    headers: {        
        'Authorization': token ? `Bearer ${token}` : '',    
    }
})
export { send_json, send_formdata};