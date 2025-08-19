import { useState } from 'react';

interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

interface AddEventFormProps {
  onSave: (event: Event) => Promise<void>;
  onCancel: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Event>({
    title: '',
    description: '',
    date: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.title.trim()) {
      newErrors.title = 'Judul event harus diisi';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Judul event minimal 3 karakter';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi event harus diisi';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Deskripsi event minimal 10 karakter';
    }

    if (!formData.date) {
      newErrors.date = 'Tanggal event harus diisi';
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      if (eventDate < today) {
        newErrors.date = 'Tanggal event tidak boleh di masa lalu';
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
      console.error('Error saving event:', error);
      alert('Terjadi kesalahan saat menyimpan data event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      date: ''
    });
    setErrors({});
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Tambah Event Baru</h1>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              title="Kembali ke daftar event"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">Silakan isi form di bawah untuk menambahkan event baru</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Event <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul event..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Event <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Jelaskan tentang event ini..."
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Event <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={getTodayDate()}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-black px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Event'}
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
            <li>• Semua field yang bertanda (*) wajib diisi</li>
            <li>• Judul event minimal 3 karakter</li>
            <li>• Deskripsi event minimal 10 karakter</li>
            <li>• Tanggal event tidak boleh di masa lalu</li>
          </ul>
          <p className="text-sm text-blue-700 mt-2">
            <i>Pastikan semua informasi event sudah benar sebelum disimpan!</i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddEventForm;