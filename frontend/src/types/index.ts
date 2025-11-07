export interface IUser {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  googleId?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IScheduleItem {
  time: string;
  activity: string;
  description?: string;
}

export interface IGuest {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  confirmed: boolean;
  attended: boolean;
  companions: number;
  menuType: 'adult' | 'child';
  confirmationCode: string;
  confirmedAt?: string;
}

export interface ILocation {
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ITheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  backgroundColor: string;
}

export interface IMedia {
  photos?: string[];
  video?: string;
}

export interface ISettings {
  allowCompanions: boolean;
  requireMenuSelection: boolean;
  maxCompanions: number;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: ILocation;
  hosts: string[];
  schedule: IScheduleItem[];
  guests: IGuest[];
  theme: ITheme;
  media?: IMedia;
  settings: ISettings;
  userId: string; // Assuming userId is just the string ID
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
