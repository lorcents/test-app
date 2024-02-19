// pages/photo/[id].tsx
'use client'
import { useParams,useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GlobalSpinner, useAuthContext } from '@/context/AuthContext';
import { User } from 'firebase/auth';
import { toast } from 'react-toastify';

interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const PhotoPage = () => {
const route = useRouter();
const { user, loading } = useAuthContext() as {user:User,loading:boolean}
  const [Loading,setLoading] = useState(false)
   
  const params = useParams();
 
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos/${params.id}`);
        const data = await response.json();
        setPhoto(data);
        setEditedTitle(data.title);
      } catch (error) {
        console.error('Error fetching photo:', error);
      }
    };

    if (params.id) {
      fetchPhoto();
    }
  }, [params]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
    
  };

  const handleBackToAlbums =() =>{
    route.replace('/home')

  }

  const handleSaveTitle = async () => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/photos/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editedTitle }),
      });
    } catch (error) {
      console.error('Error updating title:', error);
    }
    toast.success('successfully updated image title')
  };

  
  if (loading ||  !photo) {
    return <GlobalSpinner />;
  }

  if (!user && !loading ) {
    route.replace('/')
    return
    
  }

  return (
    <div className="flex flex-col items-center justify-center ">
         <div className="flex items-center mb-4 gap-8">
        <button
          className="text-teal-500 font-bold flex items-center cursor-pointer "
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
          Back to home
        </button>

        {/* Title */}
        <h3 className="ml-4 text-pretty">Title : {editedTitle}</h3>
      </div>
      {/* Image */}
      <div className="mb-4">
        <Image src={photo.url} alt={photo.title} width={500} height={500} />
      </div>

      {/* Editable title input and save button */}
      <div className="flex flex-col items-center">
        <label htmlFor="editTitle" className="mb-2">Edit Title:</label>
        <input
          id="editTitle"
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
          className="px-4 py-2 mb-2 border rounded w-full text-center"
        />
        <button
          onClick={handleSaveTitle}
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
        >
          Update Title
        </button>
      </div>
    </div>
  );
};

export default PhotoPage;
