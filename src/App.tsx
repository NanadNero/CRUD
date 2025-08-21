import { useState, useEffect } from 'react';
import './index.css';
import Button from './component/Button';
import LoadingIndicator from './component/LoadingIndicator';
import { eventApi } from './service/API';
import EventStats from './component/User';
import UserTable from './component/Table';
import AddUserForm from './AddUserForm';

interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

type CurrentView = 'list' | 'add' | 'detail';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentView, setCurrentView] = useState<CurrentView>('list');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading events...');
      const response = await eventApi.fetchEvents();
      console.log('API Response:', response);
      
      // Handle the Laravel API response structure
      if (response.success && response.data) {
        // Force a complete state reset to ensure re-render
        setEvents([...response.data]);
        console.log('Events loaded:', response.data);
      } else {
        console.warn('No events data or success false:', response);
        setEvents([]);
        if (!response.success) {
          setError(response.message || 'Failed to load events');
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setError('Failed to load events. Please check your API connection.');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = () => {
    setCurrentView('add');
  };

  const handleViewDetail = (eventId: number) => {
    setSelectedEventId(eventId);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedEventId(null);
  };

  const handleSaveEvent = async (eventData: Event) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Saving event:', eventData);
      const response = await eventApi.createEvent(eventData);
      console.log('Save response:', response);
      
      if (response.success) {
        // Reload events to get the latest data
        await loadEvents();
        setCurrentView('list');
        alert('Event berhasil disimpan!');
      } else {
        throw new Error(response.message || 'Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Gagal menyimpan event!');
      alert('Gagal menyimpan event!');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Deleting event:', eventId);
        const response = await eventApi.deleteEvent(eventId);
        console.log('Delete response:', response);
        
        if (response.success) {
          // Option 1: Optimistic update (faster UI)
          setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
          alert('Event berhasil dihapus!');
          
          // Option 2: Also reload from server to ensure consistency
          // Uncomment this if you want to be extra sure:
          // await loadEvents();
        } else {
          throw new Error(response.message || 'Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        setError('Gagal menghapus event!');
        alert('Gagal menghapus event!');
        // Reload events in case of error to ensure UI consistency
        await loadEvents();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditEvent = async (eventId: number, eventData: Event) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Updating event:', eventId, eventData);
      const response = await eventApi.updateEvent(eventId, eventData);
      console.log('Update response:', response);
      
      if (response.success) {
        // Option 1: Optimistic update (faster UI)
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, ...eventData, id: eventId }
              : event
          )
        );
        alert('Event berhasil diupdate!');
        
        // Option 2: Also reload from server to ensure consistency
        // Uncomment this if you want to be extra sure:
        // await loadEvents();
      } else {
        throw new Error(response.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Gagal mengupdate event!');
      alert('Gagal mengupdate event!');
      // Reload events in case of error to ensure UI consistency
      await loadEvents();
    } finally {
      setIsLoading(false);
    }
  };

  // Show error message if there's an error
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex">
        <div className="text-red-400">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          <button 
            onClick={() => setError(null)} 
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );

  if (currentView === 'add') {
    return (
      <div>
        {error && <ErrorMessage message={error} />}
        <AddUserForm
          onSave={handleSaveEvent}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  if (currentView === 'detail') {
    const selectedEvent = events.find(event => event.id === selectedEventId);
    return (
      <div className="container mx-auto p-4">
        {error && <ErrorMessage message={error} />}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Event Detail</h1>
            <Button
              variant="primary"
              onClick={handleBackToList}
              className="text-black-600 hover:text-red-900 px-2 py-1 border border-red-300 rounded text-xs font-medium transition-colors"
              >
              ← Back to List
            </Button>
          </div>
          
          {selectedEvent ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <p className="text-lg font-semibold">{selectedEvent.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-800">{selectedEvent.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <p className="text-gray-800">
                  {new Date(selectedEvent.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              {selectedEvent.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedEvent.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-500">Event not found</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className='font-bold text-3xl text-left'>Events Management</h1>
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddEvent}
          disabled={isLoading}
          className="text-black-500 hover:text-blue-900 px-2 py-1 border border-blue-300 rounded text-xs font-medium transition-colors"
        >
          + Add New Event
        </Button>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Loading Indicator */}
      <LoadingIndicator
        show={isLoading}
        message="Memproses data..."
      />

      {/* Events Table */}
      <UserTable
        events={events}
        onViewDetail={handleViewDetail}
        onDeleteEvent={handleDeleteEvent}
        onEditEvent={handleEditEvent}
        isLoading={isLoading}
      />

      {/* Events Stats */}
      <EventStats events={events} />
    </div>
  );
}

export default App;