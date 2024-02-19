'use client'
import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';

interface Album {
  id: number;
  title: string;
  // Add other properties as needed
}

interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface AlbumListProps {
  albums: Album[];
}

const AlbumList: React.FC<AlbumListProps> = ({ albums }) => {
  const route = useRouter()
  

  const handleAlbumClick = async (albumId: number) => {
    route.push(`/album/${albumId}`)
  };




  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="w-full h-full p-4 md:ml-4">
       

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          
           { albums.map((album) => (
              <div
                key={album.id}
                className="cursor-pointer border border-gray-300 p-4 mb-4 rounded transition-transform transition-bg hover:scale-105 hover:bg-teal-100"
                onClick={() => handleAlbumClick(album.id)}
              >
                <p className="text-lg font-semibold">{album.title}</p>
                {/*  other album information   */}
              </div>
            ))
           }
        </div>

      </div>
    </div>
  );
};

export default AlbumList;
