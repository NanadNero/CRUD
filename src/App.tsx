import { useState, useEffect } from 'react';
import './index.css';
import AddUserForm from './AddUserForm';
import Button from './component/Button';
import UserTable from './component/Table';
import UserStats from './component/User';
import LoadingIndicator from './component/LoadingIndicator';
import { userApi } from './service/API';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  address: string;
  IdentityNumber: number;
  birthDate: string;
  status: boolean;
}

type CurrentView = 'list' | 'add' | 'detail';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<CurrentView>('list');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
    loadUsers();
}, []);

const loadUsers = async () => {
    try {
      const data = await userApi.fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('Failed to load users!');
    }
};

const handleAddUser = () => {
    setCurrentView('add');
};

const handleViewDetail = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('detail');
};

const handleBackToList = () => {
    setCurrentView('list');
    setSelectedUserId(null);
};

const handleSaveUser = async (userData: User) => {
    setIsLoading(true);
    try {
      await userApi.createUser(userData);
      await loadUsers();
      setCurrentView('list');
      alert('Data user berhasil disimpan!');
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Gagal menyimpan data user!');
      throw error;
    } finally {
      setIsLoading(false);
    }
};

const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        setIsLoading(true);
        await userApi.deleteUser(userId);
        await loadUsers();
        alert('User berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Gagal menghapus user!');
      } finally {
        setIsLoading(false);
      }
    }
};

if (currentView === 'add') {
    return (
      <AddUserForm
        onSave={handleSaveUser}
        onCancel={handleBackToList}
      />
    );
}

if (currentView === 'detail') {
    return (
      <div className="container mx-auto p-4">
        <h1>User Detail - {selectedUserId}</h1>
        <Button 
          variant="primary"
          onClick={handleBackToList}
        >
          Back to List
        </Button>
      </div>
    );
}

return (
    <div className="container mx-auto p-4">
      {}
      <div className="flex justify-between items-center mb-6">
        <h1 className='font-bold text-3xl text-left'>Users Management</h1>
        <Button 
          variant="primary"
          size="lg"
          onClick={handleAddUser}
          disabled={isLoading}
        >
          + Add New User
        </Button>
      </div>

      {}
      <LoadingIndicator 
        show={isLoading}
        message="Memproses data..."
      />

      {}
      <UserTable
        users={users}
        onViewDetail={handleViewDetail}
        onDeleteUser={handleDeleteUser}
        isLoading={isLoading}
      />

      {}
      <UserStats users={users} />
    </div>
  );
}

export default App;