// components/UserList.tsx
'use client'
import React from 'react';

interface User {
  id: number;
  name: string;
  albumCount?: number;
  username?:string;
}

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onUserClick: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUser, onUserClick }) => {
  return (
    <div className="w-1/3 h-full md:overflow-y-auto border-r border-gray-300 p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className={`flex items-center cursor-pointer p-2 mb-2 rounded-full ${selectedUser && selectedUser.id === user.id ? 'bg-gray-200' : ''}`}
          onClick={() => onUserClick(user)}
        >
          {/* Replace the hardcoded avatar with a random avatar URL */}
          <img src={`https://i.pravatar.cc/40?u=${user.id}`} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs font-bold">{`@${user.username} `}</p>
            <p className="text-xs text-gray-500">{`${user.albumCount} albums`}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default UserList;
