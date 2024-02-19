'use client'
// components/UserList.tsx
import React, { useState } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface UserInterface {
  id: number;
  name: string;
  albumCount?: number;
  username?: string;
}

interface UserListProps {
  users: UserInterface[];
  selectedUser: UserInterface | null;
  onUserClick: (user: UserInterface) => void;
  user: User;
  isExpanded:Boolean;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUser, onUserClick, user ,isExpanded}) => {
  const route = useRouter();
  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      // Redirect to the login page
      route.replace('/');
    } catch (error: any) {
      // Handle any errors during logout
      toast.error('Error during logout:', error.message);
    }
  };

  const handleUserClick = (clickedUser: UserInterface) => {
    // Execute the provided onUserClick callback
    onUserClick(clickedUser);
  };

  return (
    <div className={`relative min-w-[33.33%] max-w-[33.33%] ${isExpanded ? 'md:max-w-[66.66%]' : 'hidden md:block'} `}>

      {/* UserList overlay that slides in from the left on mobile and tablet */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform ease-in-out ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:overflow-auto border-r border-gray-300 p-4`}
      >
        <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center cursor-pointer p-2 mb-2 rounded-full ${selectedUser && selectedUser.id === user.id ? 'bg-gray-200' : ''}`}
              onClick={() => handleUserClick(user)} // Call handleUserClick instead of onUserClick directly
            >
              <Image src={`https://i.pravatar.cc/40?u=${user.id}`} alt="Avatar" className="w-8 h-8 rounded-full mr-2" width={500} height={500} />
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs font-bold">{`@${user.username} `}</p>
                <p className="text-xs text-gray-500">{`${user.albumCount} albums`}</p>
              </div>
            </div>
          ))}
        </div>

        {/* UserProfilePanel at the bottom within the same div */}
        {user && (
          <div className=" bg-white p-4 border-t border-gray-300 flex items-center justify-between">
            <div className="flex items-center">
              <Image src={user.photoURL || `https://i.pravatar.cc/40?u=${user.uid}`} alt="Avatar" className="w-8 h-8 rounded-full mr-2" width={500} height={500}/>
              <div>
                <p className="text-sm font-semibold">{user.displayName}</p>
                <p className="text-xs font-bold">{`@${user.email} `}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-red-500 text-xs font-bold">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
