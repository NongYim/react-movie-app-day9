import Axios, { AxiosResponse } from 'axios'

// กำหนด interface สำหรับข้อมูลฟอร์ม
interface LoginData {
    email: string
    password: string
}


// กำหนดประเภทของข้อมูลที่รับกลับจาก response
// interface AuthResponse {
//     access_token: string
//     refresh_token: string
//     user: {
//         id: number
//         first_name: string
//         last_name: string
//         email: string
//     }
// }

interface AuthResponse {
    token: string
    refresh_token: Date
    userData: {
        userName: string
        email: string
        roles: string[]
     
    }
}


//สร้าง login function
// const authLogin = (data: LoginData): Promise<AxiosResponse<AuthResponse>> => {
//     return Axios.post<AuthResponse>('/login', data, {
//         baseURL: 'http://localhost:8081/api/Authenticate/',
//         headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//         },
//     })
// }

//VITE_BASE_URL_API เอามาจากไฟล์ .env
const authLogin = (data: LoginData): Promise<AxiosResponse<AuthResponse>> => {
    return Axios.post<AuthResponse>('/Authenticate/loginemail', data, {
        baseURL: import.meta.env.VITE_BASE_URL_API,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
}


// สร้าง logout function

//สร้าง Axios instance
const axiosInstance = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API, // กำหนด baseURL ที่นี่
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});
// สร้าง logout function
const authLogout = (): Promise<AxiosResponse> => { 
    
    return axiosInstance.post("/Authenticate/logoutemail"); // ใช้ axiosInstance
}

// const authLogout = (): Promise<AxiosResponse> => { 
//     console.log(import.meta.env.VITE_BASE_URL_API)
//     return Axios.post("/Authenticate/logoutemail", {
//       baseURL: import.meta.env.VITE_BASE_URL_API,
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     })
//   }
  



export {authLogin,authLogout}