// components/AlbumList.tsx
'use client'
import React from 'react';

interface Album {
  id: number;
  title: string;
  // Add other properties as needed
}

interface AlbumListProps {
  albums: Album[];
}

const AlbumList: React.FC<AlbumListProps> = ({ albums }) => {
  return (
    <div className="w-2/3 h-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="cursor-pointer border border-gray-300 p-4 mb-4 rounded"
            // Handle album click here
          >
            <p className="text-lg font-semibold">{album.title}</p>
            {/* Add other album information as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;
