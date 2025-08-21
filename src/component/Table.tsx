import React, { useState } from 'react';

interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

interface EventTableProps {
  events: Event[];
  onViewDetail: (eventId: number) => void;
  onDeleteEvent: (eventId: number) => void;
  onEditEvent: (eventId: number, eventData: Event) => void;
  isLoading: boolean;
}

const EventTable: React.FC<EventTableProps> = ({
  events,
  onViewDetail,
  onDeleteEvent,
  onEditEvent,
  isLoading
}) => {
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Event>({
    title: '',
    description: '',
    date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle edit button click
  const handleEditClick = (event: Event) => {
    console.log('Starting edit for event:', event);
    setEditingEventId(event.id || 0);
    
    // Format date for input field (YYYY-MM-DD)
    let formattedDate = event.date;
    if (event.date) {
      const date = new Date(event.date);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0];
      }
    }
    
    setEditFormData({
      title: event.title,
      description: event.description,
      date: formattedDate
    });
    
    console.log('Edit form data set to:', {
      title: event.title,
      description: event.description,
      date: formattedDate
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    console.log('Cancelling edit');
    setEditingEventId(null);
    setEditFormData({ title: '', description: '', date: '' });
  };

  // Handle save edit
  const handleSaveEdit = async (eventId: number) => {
    console.log('Saving edit for event ID:', eventId);
    console.log('Edit form data:', editFormData);
    
    // Validation
    if (!editFormData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!editFormData.description.trim()) {
      alert('Description is required');
      return;
    }
    
    if (!editFormData.date) {
      alert('Date is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onEditEvent(eventId, editFormData);
      console.log('Edit saved successfully');
      setEditingEventId(null);
      setEditFormData({ title: '', description: '', date: '' });
    } catch (error) {
      console.error('Error saving edit:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete with better confirmation
  const handleDeleteClick = async (event: Event) => {
    console.log('Delete clicked for event:', event);
    
    if (!event.id) {
      console.error('Cannot delete event without ID');
      alert('Cannot delete event: Invalid event ID');
      return;
    }
    
    const confirmMessage = `Are you sure you want to delete "${event.title}"?\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      console.log('Delete confirmed for event ID:', event.id);
      onDeleteEvent(event.id);
    } else {
      console.log('Delete cancelled');
    }
  };

  // Handle input change in edit form
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Edit field changed: ${name} = ${value}`);
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  // Check if event is upcoming or past
  const isUpcoming = (dateString: string) => {
    try {
      const eventDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    } catch (error) {
      console.error('Error checking if upcoming:', dateString, error);
      return false;
    }
  };

  if (isLoading && events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading events...</span>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h3>
        <p className="text-gray-500">Start by creating your first event!</p>
      </div>
    );
  }

  console.log('Rendering table with events:', events);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Events List ({events.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event, index) => (
              <tr 
                key={event.id || index} 
                className="hover:bg-gray-50 transition-colors"
              >
                {/* ID */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.id || 'N/A'}
                </td>

                {/* Title */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingEventId === event.id ? (
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Event title"
                      disabled={isSubmitting}
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                  )}
                </td>

                {/* Description */}
                <td className="px-6 py-4">
                  {editingEventId === event.id ? (
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Event description"
                      disabled={isSubmitting}
                    />
                  ) : (
                    <div className="text-sm text-gray-900 max-w-xs">
                      {event.description && event.description.length > 100 
                        ? `${event.description.substring(0, 100)}...` 
                        : event.description
                      }
                    </div>
                  )}
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingEventId === event.id ? (
                    <input
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">
                      {formatDate(event.date)}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    isUpcoming(event.date)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isUpcoming(event.date) ? '🟢 Upcoming' : '🔘 Past'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {editingEventId === event.id ? (
                    // Edit mode buttons
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(event.id!)}
                        className="text-green-600 hover:text-green-900 px-3 py-1 border border-green-300 rounded text-xs font-medium transition-colors disabled:opacity-50"
                        disabled={isSubmitting || isLoading}
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded text-xs font-medium transition-colors"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // Normal mode buttons
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewDetail(event.id!)}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 border border-blue-300 rounded text-xs font-medium transition-colors"
                        title="View Details"
                        disabled={isLoading || !event.id}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(event)}
                        className="text-yellow-600 hover:text-yellow-900 px-2 py-1 border border-yellow-300 rounded text-xs font-medium transition-colors"
                        disabled={isLoading || !event.id}
                        title="Edit Event"
                      >
                       Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(event)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 border border-red-300 rounded text-xs font-medium transition-colors"
                        disabled={isLoading || !event.id}
                        title="Delete Event"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTable;