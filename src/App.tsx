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

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const response = await eventApi.fetchEvents();
      // Handle the Laravel API response structure
      if (response.success && response.data) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      alert('Failed to load events!');
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
    try {
      const response = await eventApi.createEvent(eventData);
      if (response.success) {
        await loadEvents();
        setCurrentView('list');
        alert('Event berhasil disimpan!');
      } else {
        throw new Error(response.message || 'Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Gagal menyimpan event!');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try {
        setIsLoading(true);
        const response = await eventApi.deleteEvent(eventId);
        if (response.success) {
          await loadEvents();
          alert('Event berhasil dihapus!');
        } else {
          throw new Error(response.message || 'Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Gagal menghapus event!');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditEvent = async (eventId: number, eventData: Event) => {
    setIsLoading(true);
    try {
      const response = await eventApi.updateEvent(eventId, eventData);
      if (response.success) {
        await loadEvents();
        alert('Event berhasil diupdate!');
      } else {
        throw new Error(response.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Gagal mengupdate event!');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentView === 'add') {
    return (
      <AddUserForm
        onSave={handleSaveEvent}
        onCancel={handleBackToList}
      />
    );
  }

  if (currentView === 'detail') {
    const selectedEvent = events.find(event => event.id === selectedEventId);
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Event Detail</h1>
            <Button
              variant="primary"
              onClick={handleBackToList}
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
        >
          + Add New Event
        </Button>
      </div>

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