import BackLayout from '@/components/layouts/BackLayout'
import { getAllMovies, createMovie, getAllGenres, getMovieByIdWithGenres,deleteMovie,updateMovie } from '@/services/movieAPI'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import Swal from 'sweetalert2'


//สร้าง Type สำหรับข้อมูลภาพยนตร์ เพื่อที่จะได้ไม่ต้องกำ any
//ใช้ type หรือ interface ก็ได้
type Movie = {
    id: number
    title: string
    release_date: string
    runtime: number
    mpaa_rating: string
    description: string
    image: string
}

// interface Movie  {
//     id: number
//     title: string
//     release_date: string
//     runtime: number
//     mpaa_rating: string
//     description: string
//     image: string
// }


// สร้าง Type สำหรับไว้รับข้อมูลจาก Form
type MovieFormInput = {
    id?: number
    title: string
    release_date: string
    runtime: number
    mpaa_rating: string
    description: string
    image: string
    genres_array: number[]
    //genres_array: Array<number>; // อาร์เรย์ของประเภท (ใช้ List แทน number[])
}

// สร้าง Type สำหรับไว้รับข้อมูลจาก Genres
type Genre = {
    id: number
    genre: string
    checked: boolean
}

function Movies() {

    document.title = 'Movies'

    //สร้างตัวแปรไว้เก็บข้อมุล Genres
    const [genresOptions, setGenresOptions] = useState<Genre[]>([])

    //สร้างตัวแปรเพื่อเก็บ ID ของหนังที่ต้องการแก้ไข
    const [editingMovieId, setEditingMovieId] = useState<number | null>(null)






    //สร้างตัวแปรแบบ State ไว้เก็บข้อมูล Mivies
    //const [movies ,setMovies] = useState<any[]>([])
    const [movies, setMovies] = useState<Movie[]>([])

    //สร้างตัวแปรไว้เปิด/ปิด modal
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    //สร้างตัวแปร useForm สำหรับใช้งาน Form
    const { register, handleSubmit, formState: { errors }, reset } = useForm<MovieFormInput>()

    // สร้างตัวแปรเก็บข้อมูล Genres
    // const genresOptions = [
    //     { id: 1, name: 'Action' },
    //     { id: 2, name: 'Adventure' },
    //     { id: 3, name: 'Comedy' },
    //     { id: 4, name: 'Drama' },
    //     { id: 5, name: 'Horror' },
    //     { id: 6, name: 'Mystery' },
    //     { id: 7, name: 'Sci-Fi' },
    //     { id: 8, name: 'Thriller' },


    // ]




    //สร้างฟังก์ชันเพื่อดึงข้อมูลภาพยนตร์ทั้งหมด
    const fetchMovies = async () => {
        const movies: Movie[] = await getAllMovies()

        //เราต้อง set ค่าลงใน state เวลามีการเปลี่ยนค่ามันจะได้อัพเดท
        setMovies(movies)
        console.log(movies)

    }
    //สร้างฟังก์ชันเพื่อดึงข้อมูล Genre ทั้งหมด
    const fetchGenres = async () => {
        const genres: Genre[] = await getAllGenres()

        //เราต้อง set ค่าลงใน state เวลามีการเปลี่ยนค่ามันจะได้อัพเดท
        setGenresOptions(genres)
        console.log(genres)

    }

    // เรียกใช้ฟังก์ชัน fetchMovies เมื่อ Component ถูกโหลด
    useEffect(() => {
        fetchGenres() // เรียกใช้ฟังก์ชัน fetchGenres เพื่อโหลด Genres จาก API
        fetchMovies() // เรียกใช้ฟังก์ชัน fetchMovies เพื่อโหลด Movies จาก API
    }, [])


    //สร้างฟังก์ชันสำหรับเปิดหน้า Edit Movie
    const handleEditMovie = async (id: number) => {

        //อ่านข้อมูลภาพยนตร์จาก API โดยใช้ ID
        const movieData = await getMovieByIdWithGenres(id)
        //ถ้าอ่าน api แล้วมีค่าเข้า if

        if(movieData.movie) {
           
                 // set ค่า editingMovieId เพื่อเปิด Modal
        setEditingMovieId(id)

        //ความหมายคือ movieData.movie.genres_array || [] ถ้าไม่มีค่า ให้เป็น array ว่างๆ 
        const movieGenresArray = movieData.movie.genres_array || []

            // กำหนด ชนิดให้กับ genre
            const updatedGenres = movieData.genres.map((genre: Genre) => ({
                ...genre,
                checked: movieGenresArray.includes(genre.id) // เช็คว่า genres ไหนที่ถูกเลือกไว้
            }))   
            
            setGenresOptions(updatedGenres) //อัปเดต genres ที่มีการเช็คถูกไว้

            // Reset ค่าใน Form ให้เป็นข้อมูลภาพยนต์ที่อ่านมาจาก API
            reset({
                title: movieData.movie.title,
                release_date: movieData.movie.release_date.split('T')[0], // แปลงวันที่ให้ตรงกับ input type="date"
                runtime: movieData.movie.runtime,
                mpaa_rating: movieData.movie.mpaa_rating,
                description: movieData.movie.description,
                image: movieData.movie.image,
                genres_array: movieGenresArray // ใช้ genres_array ที่มีอยู่ใน Movie
            })
        



            
        //เปิด Modal
        setModalIsOpen(true)

        }


   
    }

    // สร้างฟังก์ชันสำหรับลบข้อมูลภาพยนต์
    const handleDelete = async (id: number) => {
        // แสดง SweetAlert เพื่อให้ผู้ใช้ยืนยันก่อนลบ
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        })
    
        // ถ้าผู้ใช้กดยืนยันการลบ
        if (result.isConfirmed) {
            try {
                // เรียกใช้ API เพื่อลบหนังตาม ID
                await deleteMovie(id)
    
                // โหลดข้อมูลหนังใหม่หลังจากลบเสร็จ
                await fetchMovies()
    
                // แสดง SweetAlert เพื่อบอกว่าลบเสร็จแล้ว
                Swal.fire(
                    'Deleted!',
                    'Your movie has been deleted.',
                    'success'
                )
            } catch (error) {
                // ถ้าเกิดข้อผิดพลาด แสดงข้อความแจ้งเตือน
                Swal.fire(
                    'Error!',
                    'There was a problem deleting the movie.',
                    'error'
                )
                console.error("Failed to delete the movie", error)
            }
        }
    }    



    //ฟังก์ชันสำหรับเปิดหน้า Add Movie
    const handleAddMovie = () => {

        // รีเซ็ตค่า genresOptions ทั้งหมดให้ไม่มีการเลือก
        const resetGenres = genresOptions.map(genre => ({
            ...genre,
            checked: false // เคลียร์ค่า checked ของทุก genre
        }))

        setGenresOptions(resetGenres) // อัปเดตค่า genresOptions หลังรีเซ็ต

        // รีเซ็ตฟอร์มให้เป็นค่าเริ่มต้น
        reset({
            title: "",
            release_date: "",
            runtime: 0,
            mpaa_rating: "",
            description: "",
            image: "",
            genres_array: []
        });

        // reset ค่า editingMovieI
        setEditingMovieId(null)

        //console.log('Add Movie')
        setModalIsOpen(true)


        //reset ค่าใน Form
        //reset()

        console.log(modalIsOpen)
    }

    // สร้างฟังก์ชันสำหรับ Submit Form
    const onSubmit: SubmitHandler<MovieFormInput> = async (data) => {
        try {

            console.log(data)
            // แปลง release_date เป็นรูปแบบ "2006-01-02T15:04:05Z07:00"
            const releaseDate = new Date(data.release_date).toISOString()

            // แปลง runtime เป็นตัวเลข (number)
            const runtime = parseInt(data.runtime as unknown as string, 10)

            // แปลง genres_array จาก string เป็น number
            const genresArray = data.genres_array.map(genre => parseInt(genre as unknown as string, 10))

            // สร้างข้อมูลภาพยนต์ใหม่ ส่งแบบ json
            //เช็คว่าเป็นการแก้ไขหรือเพิ่ม 
            let movieData
            if (editingMovieId) { //edit
                 movieData = {
                    //const movieData  = {
        
                         id: editingMovieId || undefined,
                        title: data.title,
                        release_date: releaseDate,
                        runtime: runtime,
                        mpaa_rating: data.mpaa_rating,
                        description: data.description,
                        image: data.image,
                        genres_array: genresArray
                    }
            }else{
                 movieData = {
                    //const movieData  = {
                               
                        title: data.title,
                        release_date: releaseDate,
                        runtime: runtime,
                        mpaa_rating: data.mpaa_rating,
                        description: data.description,
                        image: data.image,
                        genres_array: genresArray
                    }
            }


            console.log(movieData)
            //เรียกใช้ API เพื่อบันทุกข้อมูลลงภาพยนตร์
            //  await createMovie(movieData)



            //แปลงข้อมูล json เป็น formdata เพราะว่า api ใช้ formdata
            const formData: any = new FormData()
            // วนลูปดูค่าที่อยู่ใน formProduct
            for (let key in movieData) {
                // เช็คให้แน่ใจว่าเป็น property ของ object
                if (movieData.hasOwnProperty(key)) {

                    const typedKey = key as keyof MovieFormInput; // ระบุประเภทคีย์ให้ชัดเจน



                    // หาก genres_array เป็นอาร์เรย์ ให้แปลงเป็น JSON int
                    // หาก genres_array เป็นอาร์เรย์ ให้เพิ่มค่าทีละค่า
                    if (Array.isArray(movieData[typedKey])) {
                        movieData[typedKey].forEach((value: number) => {
                            formData.append(key, value); // เพิ่มค่า int เป็น string
                        });
                    } else {
                        formData.append(typedKey, movieData[typedKey]);
                    }
                }
            }
            // วนลูปดูค่าที่อยู่ใน formData
            for (var pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1])
            }
            //จบบบบแปลงข้อมูล json เป็น formdata เพราะว่า api ใช้ formdata



            //เช็ึคว่าเป็นการแก้ไขหรือเพิ่มข้อมูล
            //  await createMovie(movieData)
            //await createMovie(formData)

            // เช็คว่าเป็นการแก้ไขหรือเพิ่มข้อมูล
            // เรียกใช้ API เพื่อบันทึกข้อมูลหนังใหม่ หรืออัปเดตข้อมูลหนังที่มีอยู่แล้ว
            if (editingMovieId) {
                await updateMovie(editingMovieId, formData)
                // แสดง popup แจ้งเตือนว่าการแก้ไขสำเร็จ
                Swal.fire({
                    title: 'Updated!',
                    text: 'The movie has been updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
            } else {
                await createMovie(formData)
                // แสดง Alert บันทึกข้อมูลสำเร็จ
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'The movie has been saved successfully.',
                    confirmButtonText: 'OK'
                })
            }
            

            // แสดง Alert บันทึกข้อมูลสำเร็จ
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'The movie has been saved successfully.',
                confirmButtonText: 'OK'
            })


            // //ดึงข้อมูลภาพยนตร์
            fetchMovies()

            // //reset ค่าใน Form
            reset()

            // เครียร์ค่า ID หลังบันทึกเสร็จ
            setEditingMovieId(null)

            // //ปิด modal
            setModalIsOpen(false)

        } catch (error) {
            console.error("Failed to save the movie", error)

        }

    }

    //สร้างฟังก์ชันาสำหรับ ปิด modal
    const handleCloseModal = () => {


        // reset ค่า editingMovieI
        setEditingMovieId(null)
        
        
        setModalIsOpen(false)
        //reset ค่าใน Form
        reset()
    }





    return (
        <BackLayout>
            <section className="text-gray-600 mb-4">
                {/* Modal สำหรับเพิ่มภาพยนต์ */}
                {
                    modalIsOpen && (
                        // <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                        //     <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                        //         <h2 className="text-xl font-bold mb-4">Add New Movie</h2>
                        //         <form onSubmit={handleSubmit(onSubmit)}>

                        //             <label className="block mb-2 text-gray-700">Title</label>
                        //             <input
                        //                 type="text"
                        //                 placeholder="Title"
                        //                 {...register('title', { required: "Title is required" })}
                        //                 className="border p-2 w-full mb-4"
                        //             />
                        //             {errors.title && <p className="text-red-500  mb-4">{errors.title.message}</p>}

                        //             <label className="block mb-2 text-gray-700">Release Date</label>
                        //             <input
                        //                 type="date"
                        //                 {...register('release_date', { required: "Release Date is required" })}
                        //                 className="border p-2 w-full mb-4"
                        //                 onChange={(e) => {
                        //                     const date = new Date(e.target.value)
                        //                     const formattedDate = date.toISOString().split('T')[0]
                        //                     return formattedDate
                        //                 }}
                        //             />
                        //             {errors.release_date && <p className="text-red-500 mb-4">{errors.release_date.message}</p>}

                        //             <label className="block mb-2 text-gray-700">Runtime (min)</label>
                        //             <input
                        //                 type="number"
                        //                 placeholder="Runtime"
                        //                 {...register('runtime', { required: "Runtime is required", min: { value: 1, message: "Runtime must be at least 1 minute" } })}
                        //                 className="border p-2 w-full mb-4"
                        //             />
                        //             {errors.runtime && <p className="text-red-500 mb-4">{errors.runtime.message}</p>}

                        //             <label className="block mb-2 text-gray-700">MPAA Rating</label>
                        //             <input
                        //                 type="text"
                        //                 placeholder="MPAA Rating"
                        //                 {...register('mpaa_rating', { required: "MPAA Rating is required" })}
                        //                 className="border p-2 w-full mb-4"
                        //             />
                        //             {errors.mpaa_rating && <p className="text-red-500 mb-4">{errors.mpaa_rating.message}</p>}

                        //             <label className="block mb-2 text-gray-700">Description</label>
                        //             <textarea
                        //                 placeholder="Description"
                        //                 {...register('description', { required: "Description is required" })}
                        //                 className="border p-2 w-full mb-4"
                        //             />
                        //             {errors.description && <p className="text-red-500 mb-4">{errors.description.message}</p>}

                        //             <label className="block mb-2 text-gray-700">Image Path</label>
                        //             <input
                        //                 type="text"
                        //                 placeholder="Image Path"
                        //                 {...register('image', { required: "Image path is required" })}
                        //                 className="border p-2 w-full mb-4"
                        //             />
                        //             {errors.image && <p className="text-red-500 mb-4">{errors.image.message}</p>}

                        //             <label className="block mb-2 text-gray-700">Genres</label>
                        //             <select
                        //                 multiple
                        //                 {...register('genres_array', { required: "At least one genre must be selected" })}
                        //                 className="border p-2 w-full mb-4"
                        //             >
                        //                 {genresOptions.map((genre) => (
                        //                     <option key={genre.id} value={genre.id}>{genre.name}</option>
                        //                 ))}
                        //             </select>
                        //             {errors.genres_array && <p className="text-red-500">{errors.genres_array.message}</p>}


                        //             <div className="flex justify-end">
                        //                 <button
                        //                     type="submit"
                        //                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        //                 >
                        //                     Save
                        //                 </button>
                        //                 <button
                        //                     type="button"
                        //                     className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        //                     onClick={() => setModalIsOpen(false)}
                        //                 >
                        //                     Cancel
                        //                 </button>
                        //             </div>
                        //         </form>
                        //     </div>
                        // </div>
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto">
                            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg sm:px-4 sm:mx-4 sm:mt-10 mb-10 relative">
                                <button
                                    className="absolute top-8 right-8 text-gray-600 hover:text-gray-900"
                                    onClick={handleCloseModal}
                                >
                                    <FontAwesomeIcon icon={faTimes} size="lg" />
                                </button>
                                <h2 className="text-xl font-bold mb-4">
                                    {/* Add New Movie */}
                                    {editingMovieId ? "Edit Movie" : "Add New Movie"}
                                </h2>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Grid สำหรับฟิลด์ด้านบน 4 ฟิลด์ */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-2 text-gray-700 text-sm">Title</label>
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                {...register('title', { required: "Title is required" })}
                                                className="border p-2 w-full mb-2"
                                            />
                                            {errors.title && <p className="text-red-500 mb-2 text-xs">{errors.title.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-gray-700 text-sm">Release Date</label>
                                            <input
                                                type="date"
                                                {...register('release_date', { required: "Release Date is required" })}
                                                className="border p-2 w-full mb-2"
                                            />
                                            {errors.release_date && <p className="text-red-500 mb-2 text-xs">{errors.release_date.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-gray-700 text-sm">Runtime (min)</label>
                                            <input
                                                type="number"
                                                placeholder="Runtime"
                                                {...register('runtime', { required: "Runtime is required", min: { value: 1, message: "Runtime must be at least 1 minute" } })}
                                                className="border p-2 w-full mb-2"
                                            />
                                            {errors.runtime && <p className="text-red-500 mb-2 text-xs">{errors.runtime.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-gray-700 text-sm">MPAA Rating</label>
                                            <input
                                                type="text"
                                                placeholder="MPAA Rating"
                                                {...register('mpaa_rating', { required: "MPAA Rating is required" })}
                                                className="border p-2 w-full mb-2"
                                            />
                                            {errors.mpaa_rating && <p className="text-red-500 mb-2 text-xs">{errors.mpaa_rating.message}</p>}
                                        </div>
                                    </div>

                                    {/* ฟิลด์ Description */}
                                    <label className="block mt-4 mb-2 text-gray-700 text-sm">Description</label>
                                    <textarea
                                        placeholder="Description"
                                        {...register('description', { required: "Description is required" })}
                                        className="border p-2 w-full mb-2 h-36"
                                    />
                                    {errors.description && <p className="text-red-500 mb-2 text-xs">{errors.description.message}</p>}

                                    {/* 0Genres */}
                                    <label className="block mb-2 text-gray-700 text-sm">Genres</label>
                                    <div className="grid grid-cols-2 gap-0 mb-2">
                                        {genresOptions.map((genre) => (
                                            <div key={genre.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"  // ระยะห่าง check bok กับข้อความ
                                                    id={`genre-${genre.id}`}
                                                    value={genre.id}
                                                    checked={genre.checked}
                                                    {...register('genres_array', {
                                                        validate: value => value.length > 0 || "Please select at least one genre"
                                                    })}
                                                    //กรณีตอน edit ต้องใส่ onchang ด้วย เพื่อให้่เอาค่าที่ติ๊กอันใหม่ด้วย
                                                onChange={(e) => {
                                                    const updatedGenres = genresOptions.map(g =>
                                                        g.id === genre.id ? { ...g, checked: e.target.checked } : g
                                                    );
                                                    setGenresOptions(updatedGenres); // อัปเดตสถานะ checked ของ genre
                                                }}
                                                />
                                                <label htmlFor={`genre-${genre.id}`} className="cursor-pointer">{genre.genre}</label>
                                                {/* <label htmlFor={`genre-${genre.id}`} className="cursor-pointer">{genre.name}</label> */}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.genres_array && <p className="text-red-500 mb-2 text-xs">{errors.genres_array.message}</p>}

                                    <div className="flex justify-center mt-6">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                        >
                                            {/* Save Movie */}
                                            {editingMovieId ? "Update Movie" : "Save Movie"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>


                    )
                }

                {/* ส่วนหัว tile ของหน้า page นี้ */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl text-black">Movies</h1>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddMovie}>
                            Add Movie
                        </button>
                    </div>
                </div>

                {/* ตารางแสดงผลข้อมูลภาพยนต์ */}
                <div className="bg-white overflow-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="w-1/12 text-left py-3 px-4 uppercase font-semibold text-sm">Cover</th>
                                <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Title</th>
                                <th className="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Release Date</th>
                                <th className="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Runtime (min)</th>
                                <th className="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Rating</th>
                                <th className="w-36 text-left py-3 px-4 uppercase font-semibold text-sm">Manage</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                movies.map((movie) => (
                                    <tr key={movie.id} className="border-b border-gray-200">
                                        <td className="text-left py-3 px-4">
                                            {movie.image ? <img src={'https://image.tmdb.org/t/p/w200' + movie.image} alt={movie.title} className="w-20 h-auto" /> : "No Image"}
                                        </td>
                                        <td className="text-left py-3 px-4">{movie.title || "N/A"}</td>
                                        <td className="text-left py-3 px-4">{movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "N/A"}</td>
                                        <td className="text-left py-3 px-4">{movie.runtime > 0 ? movie.runtime : "N/A"}</td>
                                        <td className="text-left py-3 px-4">{movie.mpaa_rating || "N/A"}</td>
                                        <td className="text-left py-3 px-4 w-28">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mr-2 rounded"
                                                onClick={() => handleEditMovie(movie.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            
                                                onClick={()=>handleDelete(movie.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BackLayout>
    )
}

export default Movies