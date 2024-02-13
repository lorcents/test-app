// pages/index.tsx
'use client'
import React, { useState, useEffect } from 'react';
import UserList from '@/components/userList';
import AlbumList from '@/components/AlbumList';

interface User {
  id: number;
  name: string;
  albumCount: number;
}

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onUserClick: (user: User) => void;
}

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserAlbums, setSelectedUserAlbums] = useState<any[]>([]);

  const fetchUsers = async () => {
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
    setSelectedUser(usersWithAlbums[0]); // Select the first user by default
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

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex">
      <UserList users={users} selectedUser={selectedUser} onUserClick={handleUserClick} />
      <AlbumList albums={selectedUserAlbums} />
    </div>
  );
};

export default HomePage;
