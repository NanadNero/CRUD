import { useState } from 'react';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  address: string;
  IdentityNumber: number;
  birthDate: string;
  status: boolean;
}

interface AddUserFormProps {
  onSave: (user: User) => void;
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    address: '',
    IdentityNumber: 0,
    birthDate: '',
    status: true
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nama depan harus diisi';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nama belakang harus diisi';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat harus diisi';
    }

    if (!formData.IdentityNumber || formData.IdentityNumber <= 0) {
      newErrors.IdentityNumber = 'Nomor identitas harus diisi dengan angka positif';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Tanggal lahir harus diisi';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 17) {
        newErrors.birthDate = 'Umur minimal 17 tahun';
      }
      
      if (birthDate > today) {
        newErrors.birthDate = 'Tanggal lahir tidak boleh di masa depan';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Terjadi kesalahan saat menyimpan data user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      IdentityNumber: 0,
      birthDate: '',
      status: true
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Tambah User Baru</h1>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              title="Kembali ke daftar user"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">Silakan isi form di bawah untuk menambahkan user baru</p>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {}
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                Namamu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Masukkan nama depan"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {}
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Bapakmu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Masukkan nama belakang"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            {}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Rumahmu (Tagih pinjol sekalian)<span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Masukkan alamat lengkap..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {}
            <div>
              <label htmlFor="IdentityNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor HP kamu😋 (Random aj pls) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="IdentityNumber"
                name="IdentityNumber"
                value={formData.IdentityNumber || ''}
                onChange={handleInputChange}
                placeholder="Contoh: 123456"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.IdentityNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                min="1"
              />
              {errors.IdentityNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.IdentityNumber}</p>
              )}
            </div>

            {}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Pinjol kamu🤬<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.birthDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
              )}
            </div>

            {}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="status" className="text-sm text-gray-700">
                  User aktif (dapat menggunakan sistem)
                </label>
              </div>
            </div>

            {}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-black px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan User'}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Reset Form
              </button>
              
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-red-500 hover:bg-red-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Petunjuk Pengisian:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Semua field yang bertanda (*) wajib diisi. Kalo gk, nanti dijual di darkweb</li>
            <li>• Nomor identitas harus berupa angka positif. Angka romawi juga nanti di jual sama admin</li>
            <li>• Umur minimal 17 tahun. Kalau bocil nanti kita jual ginjalnya di darkweb juga</li>
            <li>• Pastikan alamat diisi dengan lengkap. Kalo nggak, nanti kaki mu kita jual di darkweb</li>
          </ul>
          <p className="text-sm text-blue-700 space-y-1"><i>Makasih ya kak Gak janji datanya gak bocor kek fufufafa hehe ups-</i></p>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;