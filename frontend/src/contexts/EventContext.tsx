import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Guest {
  id: string;
  name: string;
  phone: string;
  confirmed: boolean;
  attended: boolean;
  companions: number;
  menuType: 'adult' | 'child';
  confirmationCode: string;
}

export interface EventSchedule {
  time: string;
  activity: string;
  description?: string;
}

export interface EventTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  backgroundColor: string;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  hosts: string[];
  schedule: EventSchedule[];
  guests: Guest[];
  theme: EventTheme;
  media: {
    photos: string[];
    video?: string;
  };
  settings: {
    allowCompanions: boolean;
    requireMenuSelection: boolean;
    maxCompanions: number;
  };
  createdBy: string;
  createdAt: string;
}

interface EventContextType {
  events: EventData[];
  currentEvent: EventData | null;
  addEvent: (event: Omit<EventData, 'id' | 'createdAt'>) => void;
  updateEvent: (eventId: string, updates: Partial<EventData>) => void;
  getEvent: (eventId: string) => EventData | undefined;
  confirmAttendance: (eventId: string, guestId: string, data: any) => void;
  markAttended: (eventId: string, guestId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<EventData[]>([
    {
      id: 'event-1',
      title: 'Boda de Ana & Carlos',
      description: 'Celebramos nuestra unión en una ceremonia íntima rodeados de familia y amigos.',
      date: '2024-03-15T16:00:00',
      location: {
        name: 'Jardín Botánico de la Ciudad',
        address: 'Av. Principal 123, Ciudad',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      hosts: ['Ana García', 'Carlos Rodríguez'],
      schedule: [
        { time: '16:00', activity: 'Recepción de invitados', description: 'Cóctel de bienvenida' },
        { time: '17:00', activity: 'Ceremonia', description: 'Intercambio de votos' },
        { time: '18:00', activity: 'Fotografías', description: 'Sesión familiar y grupal' },
        { time: '19:30', activity: 'Cena', description: 'Menú de tres tiempos' },
        { time: '22:00', activity: 'Baile', description: 'Música en vivo y DJ' }
      ],
      guests: [
        {
          id: 'guest-1',
          name: 'María López',
          phone: '+573001234567',
          confirmed: true,
          attended: false,
          companions: 1,
          menuType: 'adult',
          confirmationCode: 'ML2024'
        },
        {
          id: 'guest-2',
          name: 'Pedro Martínez',
          phone: '+573007654321',
          confirmed: false,
          attended: false,
          companions: 0,
          menuType: 'adult',
          confirmationCode: 'PM2024'
        }
      ],
      theme: {
        primaryColor: '#8B5CF6',
        secondaryColor: '#EC4899',
        accentColor: '#F59E0B',
        fontFamily: 'Inter',
        backgroundColor: '#F9FAFB'
      },
      media: {
        photos: [
          'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
      },
      settings: {
        allowCompanions: true,
        requireMenuSelection: true,
        maxCompanions: 2
      },
      createdBy: '1',
      createdAt: '2024-01-15T10:00:00'
    }
  ]);
  
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);

  const addEvent = (eventData: Omit<EventData, 'id' | 'createdAt'>) => {
    const newEvent: EventData = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (eventId: string, updates: Partial<EventData>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  const getEvent = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  const confirmAttendance = (eventId: string, guestId: string, data: any) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          guests: event.guests.map(guest => {
            if (guest.id === guestId) {
              return {
                ...guest,
                confirmed: true,
                companions: data.companions,
                menuType: data.menuType
              };
            }
            return guest;
          })
        };
      }
      return event;
    }));
  };

  const markAttended = (eventId: string, guestId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          guests: event.guests.map(guest => {
            if (guest.id === guestId) {
              return { ...guest, attended: true };
            }
            return guest;
          })
        };
      }
      return event;
    }));
  };

  const value = {
    events,
    currentEvent,
    addEvent,
    updateEvent,
    getEvent,
    confirmAttendance,
    markAttended
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};