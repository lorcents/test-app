'use client'
import { useParams,useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GlobalSpinner, useAuthContext } from "@/context/AuthContext";
import { User } from "firebase/auth";


interface Photo {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
  }
  

const PhotosPage =()=>{
const route = useRouter()
const { user, loading } = useAuthContext() as {user:User,loading:boolean}
const [Loading,setLoading] =useState(false)
  
const params = useParams();


const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const photosPerPage = 6;

  useLayoutEffect(() => {
    setLoading(true)
    const fetchPhotos = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${params.id}`);
      const data: Photo[] = await response.json();
      setPhotos(data);
      setLoading(false)
    };

    fetchPhotos();
  }, [params]);

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleBackToAlbums =()=>{
    route.back()
  }

  if (loading ) {
    return <GlobalSpinner />;
  }

  if (!user && !loading ) {
    route.replace('/')
    return
    
  } 

    return(
        <div className="w-full h-full p-4 md:m-4">
            <div className="mb-4">
            <button
              className="text-teal-500 font-bold flex items-center cursor-pointer"
              onClick={handleBackToAlbums}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Albums
            </button>
            <p className=""></p>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        
          {currentPhotos.map((photo) => (
            <Link key={photo.id} href={`/photo/${photo.id}`}>
              <div
                className="cursor-pointer border border-gray-300 p-4 mb-4 rounded transition-transform transition-bg hover:scale-105 hover:bg-teal-100"
              >
                <Image src={photo.thumbnailUrl} alt={photo.title} className="w-full h-auto" width={500} height={500} />
                <p className="text-sm mt-2">{photo.title}</p>
              </div>
          </Link>
          ))}
        </div>
  
        {/* Pagination */}
        <div className="mt-4">
          <ul className="flex justify-center space-x-2">
            {Array.from({ length: Math.ceil(photos.length / photosPerPage) }, (_, index) => (
              <li key={index}>
                <button
                  className={`px-3 py-1 ${
                    currentPage === index + 1 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
}

export default PhotosPage