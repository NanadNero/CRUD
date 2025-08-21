const API_BASE_URL = 'http://127.0.0.1:8000/api';

console.log('API.ts loaded, API_BASE_URL:', API_BASE_URL);

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

const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  if (options.body) {
    console.log('Request Body:', options.body);
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    });
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    const text = await response.text();
    console.log('Raw Response Text:', text);
    
    // Handle empty responses (common for DELETE)
    if (!text) {
      console.log('Empty response (normal for DELETE)');
      return {
        success: response.ok,
        message: response.ok ? 'Operation successful' : `HTTP ${response.status}`,
        data: undefined
      };
    }
    
    let data;
    try {
      data = JSON.parse(text);
      console.log('Parsed JSON:', data);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return {
        success: false,
        message: 'Invalid JSON response from server',
        errors: parseError
      };
    }
    
    // Your Laravel API returns: { success: boolean, message: string, data: any }
    // This matches your frontend expectations, so we can return it directly
    return {
      success: data.success || response.ok,
      message: data.message || (response.ok ? 'Success' : 'Error'),
      data: data.data,
      errors: data.errors
    };
    
  } catch (error) {
    console.error('Network Error:', error);
    return {
      success: false,
      message: 'Network error: Cannot connect to server',
      errors: error
    };
  }
};

export const eventApi = {
  // GET /api/events - Fetch all events
  fetchEvents: async (): Promise<ApiResponse<Event[]>> => {
    console.log('Fetching all events...');
    const result = await apiRequest<Event[]>('/events', {
      method: 'GET',
    });
    
    // Handle Laravel response format where data might be an object with events array
    if (result.success && result.data) {
      // If data is an array, use it directly
      if (Array.isArray(result.data)) {
        console.log('Events fetched (array format):', result.data);
        return result;
      }
      // If data is an object with events property, extract it
      else if (result.data && typeof result.data === 'object' && 'events' in result.data) {
        console.log('Events fetched (object format):', result.data);
        return {
          ...result,
          data: (result.data as any).events
        };
      }
    }
    
    console.log('Final fetch result:', result);
    return result;
  },

  // GET /api/events/{id} - Fetch single event
  fetchEvent: async (id: number): Promise<ApiResponse<Event>> => {
    console.log(`Fetching event with ID: ${id}`);
    return await apiRequest<Event>(`/events/${id}`, {
      method: 'GET',
    });
  },

  // POST /api/events - Create new event
  createEvent: async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Event>> => {
    console.log('Creating new event:', eventData);
    const result = await apiRequest<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    console.log('Create event result:', result);
    return result;
  },

  // PUT /api/events/{id} - Update event
  updateEvent: async (id: number, eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
    console.log(`Updating event ID ${id} with data:`, eventData);
    
    // Clean the data - remove undefined values and system fields
    const cleanData = Object.fromEntries(
      Object.entries(eventData).filter(([key, value]) => 
        value !== undefined && 
        key !== 'id' && 
        key !== 'created_at' && 
        key !== 'updated_at'
      )
    );
    
    console.log('Cleaned data for update:', cleanData);
    
    const result = await apiRequest<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cleanData),
    });
    
    console.log('Update event result:', result);
    return result;
  },

  // DELETE /api/events/{id} - Delete event
  deleteEvent: async (id: number): Promise<ApiResponse<null>> => {
    console.log(`Deleting event with ID: ${id}`);
    
    const result = await apiRequest<null>(`/events/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Delete event result:', result);
    return result;
  },
};

export const {
  fetchEvents,
  fetchEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = eventApi;