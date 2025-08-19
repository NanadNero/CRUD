// service/API.ts

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

// Generic API request function
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

export const eventApi = {
  // GET /api/events - Fetch all events
  fetchEvents: async (): Promise<ApiResponse<Event[]>> => {
    return await apiRequest<Event[]>('/events', {
      method: 'GET',
    });
  },

  // GET /api/events/{id} - Fetch single event
  fetchEvent: async (id: number): Promise<ApiResponse<Event>> => {
    return await apiRequest<Event>(`/events/${id}`, {
      method: 'GET',
    });
  },

  // POST /api/events - Create new event
  createEvent: async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Event>> => {
     console.log('Sending event data:', eventData);
    return await apiRequest<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // PUT /api/events/{id} - Update event
  updateEvent: async (id: number, eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
    return await apiRequest<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // DELETE /api/events/{id} - Delete event
  deleteEvent: async (id: number): Promise<ApiResponse<null>> => {
    return await apiRequest<null>(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// You can also export individual functions if needed
export const {
  fetchEvents,
  fetchEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = eventApi;