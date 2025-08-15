import React from 'react';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  address: string;
  IdentityNumber: number;
  birthDate: string;
  status: boolean;
}

interface UserStatsProps {
  users: User[];
}

const UserStats: React.FC<UserStatsProps> = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status).length;
  const inactiveUsers = users.filter(user => !user.status).length;

  if (totalUsers === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center text-gray-600">
        <StatItem 
          label="Total Users" 
          value={totalUsers} 
          textColor="text-gray-800" 
        />
        <StatItem 
          label="Active Users" 
          value={activeUsers} 
          textColor="text-green-600" 
        />
        <StatItem 
          label="Inactive Users" 
          value={inactiveUsers} 
          textColor="text-red-600" 
        />
      </div>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: number;
  textColor: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, textColor }) => (
  <p>
    {label}: <span className={`font-semibold ${textColor}`}>{value}</span>
  </p>
);

export default UserStats;