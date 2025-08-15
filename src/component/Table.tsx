import React from 'react';
import Button from './Button';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  address: string;
  IdentityNumber: number;
  birthDate: string;
  status: boolean;
}

interface UserTableProps {
  users: User[];
  onViewDetail: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  isLoading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onViewDetail, 
  onDeleteUser, 
  isLoading 
}) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
      <div className="table w-full">
        <div className="table-row-group">
          {}
          <div className="table-row bg-gray-600">
            <div className="table-cell text-white px-6 py-4 text-lg font-semibold">Full Name</div>
            <div className="table-cell text-white px-6 py-4 text-lg font-semibold">Address</div>
            <div className="table-cell text-white px-6 py-4 text-lg font-semibold">Identity Number</div>
            <div className="table-cell text-white px-6 py-4 text-lg font-semibold">Birth Date</div>
            <div className="table-cell text-white px-6 py-4 text-lg font-semibold">Status</div>
            <div className="table-cell text-white px-6 py-4 text-lg font-semibold">Actions</div>
          </div>
          
          {}
          {users.length === 0 ? (
            <EmptyTableRow />
          ) : (
            users.map((user, index) => (
              <UserRow 
                key={user.id || index}
                user={user}
                onViewDetail={onViewDetail}
                onDeleteUser={onDeleteUser}
                isLoading={isLoading}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyTableRow: React.FC = () => (
  <div className="table-row">
    <div className="table-cell bg-gray-50 text-gray-500 px-6 py-12 text-center border-b">
      <div className="flex flex-col items-center">
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
        <p className="text-lg font-medium">No users found</p>
        <p className="text-sm">Click "Add New User" to create your first user</p>
      </div>
    </div>
    <div className="table-cell bg-gray-50 border-b"></div>
    <div className="table-cell bg-gray-50 border-b"></div>
    <div className="table-cell bg-gray-50 border-b"></div>
    <div className="table-cell bg-gray-50 border-b"></div>
    <div className="table-cell bg-gray-50 border-b"></div>
  </div>
);

interface UserRowProps {
  user: User;
  onViewDetail: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  isLoading: boolean;
}

const UserRow: React.FC<UserRowProps> = ({ user, onViewDetail, onDeleteUser, isLoading }) => (
  <div className="table-row hover:bg-gray-50 transition-colors">
    <div className="table-cell bg-white text-gray-800 px-6 py-4 text-md border-b font-medium">
      {user.firstName} {user.lastName}
    </div>
    <div className="table-cell bg-white text-gray-700 px-6 py-4 text-md border-b max-w-xs">
      <div className="truncate" title={user.address}>
        {user.address}
      </div>
    </div>
    <div className="table-cell bg-white text-gray-700 px-6 py-4 text-md border-b">
      {user.IdentityNumber}
    </div>
    <div className="table-cell bg-white text-gray-700 px-6 py-4 text-md border-b">
      {user.birthDate ? new Date(user.birthDate).toLocaleDateString('id-ID') : '-'}
    </div>
    <div className="table-cell bg-white text-gray-700 px-6 py-4 text-md border-b">
      <StatusBadge status={user.status} />
    </div>
    <div className="table-cell bg-white text-gray-700 px-6 py-4 text-md border-b">
      <div className="flex gap-2">
        <Button
          variant="success"
          size="sm"
          onClick={() => user.id && onViewDetail(user.id)}
          disabled={isLoading}
        >
          View
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => user.id && onDeleteUser(user.id)}
          disabled={isLoading}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
);

interface StatusBadgeProps {
  status: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
    status 
      ? 'bg-green-100 text-green-800 border border-green-200' 
      : 'bg-red-100 text-red-800 border border-red-200'
  }`}>
    {status ? 'Active' : 'Inactive'}
  </span>
);

export default UserTable;