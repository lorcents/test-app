// pages/index.tsx
'use client'
import React, { useState, useEffect } from 'react';
import UserList from '@/components/userList';
import AlbumList from '@/components/AlbumList';
import { useAuthContext,GlobalSpinner } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { User } from 'firebase/auth';

interface UserInterface {
  id: number;
  name: string;
  albumCount?: number;
}

interface UserListProps {
  users: UserInterface[];
  selectedUser: UserInterface | null;
  onUserClick: (user: UserInterface) => void;
}

const HomePage = () => {
  const route = useRouter()
  const { user, loading } = useAuthContext() as {user:User,loading:boolean}
  const [Loading,setLoading] = useState(false)
 
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [selectedUserAlbums, setSelectedUserAlbums] = useState<any[]>([]);
  const [isExpanded, setExpanded] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();

    // Fetch albums for each user
    const usersWithAlbums = await Promise.all(
      data.map(async (user: any) => {
        const albumResponse = await fetch(`https://jsonplaceholder.typicode.com/albums?userId=${user.id}`);
        const albums = await albumResponse.json();

        return {
          ...user,
          albumCount: albums.length,
        };
      })
    );

    setUsers(usersWithAlbums);
    setSelectedUser(usersWithAlbums[0]);
     // Select the first user by default
     setLoading(false)
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUserAlbums = async () => {
      if (selectedUser) {
        const albumResponse = await fetch(`https://jsonplaceholder.typicode.com/albums?userId=${selectedUser.id}`);
        const albums = await albumResponse.json();
        setSelectedUserAlbums(albums);
      }
    };

    fetchUserAlbums();
  }, [selectedUser]);

  const handleUserClick = (user: UserInterface) => {
    setSelectedUser(user);
    handleToggleExpand()
  };

  const handleToggleExpand = () => {
    setExpanded(!isExpanded);
  };

  if (loading || Loading ) {
    return <GlobalSpinner />;
  }

  if (!user && !loading ) {
    route.replace('/')
    return
    
  }

  return (
    Loading ? GlobalSpinner :
   ( <div className="flex">
      <UserList users={users} selectedUser={selectedUser} onUserClick={handleUserClick} user={user} isExpanded={isExpanded} />
      <div>
        {/* Toggle button for UserList on mobile and tablet */}
        <button
          className="p-2 bg-teal-500 text-white rounded lg:hidden"
          onClick={handleToggleExpand}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <p className=" italic text-center font-bold text-2xl text-teal-500 my-4">
  {selectedUser?.name} Albums
   </p>
      <AlbumList albums={selectedUserAlbums} />
      </div>
      
    </div>)
  );
};

export default HomePage;
