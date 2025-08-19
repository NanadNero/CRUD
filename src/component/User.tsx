import React from 'react';

interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

interface EventStatsProps {
  events: Event[];
}

const EventStats: React.FC<EventStatsProps> = ({ events }) => {
  // Calculate stats
  const totalEvents = events.length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today;
  }).length;
  
  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate < today;
  }).length;
  
  // Get next upcoming event
  const nextEvent = events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const thisMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  }).length;

  const stats = [
    {
      title: 'Total Events',
      value: totalEvents,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Past Events',
      value: pastEvents,
      color: 'bg-gray-500',
      textColor: 'text-gray-600'
    },
    {
      title: 'This Month',
      value: thisMonthEvents,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Statistics</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Event Card */}
      {nextEvent && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            Next Upcoming Event
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 text-lg mb-2">{nextEvent.title}</h4>
            <p className="text-blue-700 mb-2">{nextEvent.description}</p>
            <p className="text-blue-600 text-sm">
              {new Date(nextEvent.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalEvents === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Yet</h3>
          <p className="text-gray-500 mb-4">You haven't created any events yet. Start by adding your first event!</p>
          <div className="text-sm text-gray-400">
            Click the "Add New Event" button to get started
          </div>
        </div>
      )}
      
      {/* Summary Text */}
      {totalEvents > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            You have <strong>{totalEvents}</strong> total events, with <strong>{upcomingEvents}</strong> upcoming and <strong>{pastEvents}</strong> completed.
            {thisMonthEvents > 0 && (
              <> This month you have <strong>{thisMonthEvents}</strong> events scheduled.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventStats;