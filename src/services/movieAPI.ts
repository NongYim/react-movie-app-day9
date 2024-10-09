import http, { send_formdata } from '@/services/configAxios'

// Read All Movies
const getAllMovies = async() => {
    const response = await http.get('/Movie/GetMovies')
    return response.data
}

// Read All Genres
const getAllGenres = async() => {
    const response = await http.get('/Movie/genres')
    return response.data
}

// Read a Single Movie by ID พร้อม Genres
const getMovieByIdWithGenres = async (id: number) => {
    const response = await http.get(`/Movie/GetMovies/${id}`)
    return response.data
}


// Create a New Movie แบบ ส่งเป็น json
// const createMovie = async (movieData: {
//     title: string
//     release_date: string
//     runtime: number
//     mpaa_rating: string
//     description: string
//     image: string
//     genres_array: number[]
// }) => { 
//     const response = await http.post('/Movie/CreateMovies', movieData)
//     return response.data
// }
// Create a New Movie แบบ ส่งเป็น form data
const createMovie = async (formData: FormData) => {
    const response = await send_formdata.post('/Movie/CreateMovies', formData
    );
    return response.data;
};

//update an Existing Movie by ID
// const updateMovie = async (id:number,movieData: {
//     title: string
//     release_date: string
//     runtime: number
//     mpaa_rating: string
//     description: string
//     image: string
//     genres_array: number[]
// }) => { 
//     const response = await http.put(`/Movie/${id}`, movieData)
//     return response.data
// }

// update a New Movie แบบ ส่งเป็น form data
const updateMovie = async (id:number,formData: FormData) => {
    
    const response = await send_formdata.put(`/Movie/${id}`, formData)
    return response.data;
};


const deleteMovie = async(id:number) =>{

    const response = await http.delete(`/Movie/${id}`)
    return response.data
}



export {getAllMovies,createMovie,getAllGenres,getMovieByIdWithGenres,deleteMovie,updateMovie}