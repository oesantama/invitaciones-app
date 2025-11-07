import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '../services/api';
import { IEvent, IGuest } from '../types';

import { 
  Calendar, 
  Plus, 
  Users, 
  UserCheck, 
  UserX, 
  Settings, 
  LogOut, 
  QrCode,
  PieChart,
  Eye,
  Send
} from 'lucide-react';
import { sendBulkWhatsAppInvitations } from '../utils/whatsappSender';
import StatsCard from '../components/StatsCard'; // Import StatsCard

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  const { data: events, isLoading, isError, error } = useQuery<IEvent[]>({ // Type events as IEvent[]
    queryKey: ['events'],
    queryFn: async () => {
      const response = await eventsAPI.getAll();
      return response.data.data;
    },
    enabled: !!user, // Only fetch if user is logged in
  });

  const userEvents: IEvent[] = events?.filter(event => event.userId === user?._id) || [];
  const currentEvent: IEvent | undefined = selectedEvent ? userEvents.find(e => e._id === selectedEvent) : userEvents[0];

  const getEventStats = (event: IEvent) => {
    const confirmed = event.guests.filter((g: IGuest) => g.confirmed).length;
    const pending = event.guests.filter((g: IGuest) => !g.confirmed).length;
    const attended = event.guests.filter((g: IGuest) => g.attended).length;
    
    return { confirmed, pending, attended, total: event.guests.length };
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-lg font-semibold">Cargando eventos...</div>;
  }

  if (isError) {
    return <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-red-600">Error al cargar eventos: {error?.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Bienvenido, {user?.name}
              </div>
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
              Acciones Rápidas
            </h2>
            <Link
              to="/admin/create"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Nuevo Evento
            </Link>
          </div>
        </div>

        {userEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes eventos creados
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primer evento para gestionar invitaciones
            </p>
            <Link
              to="/admin/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200"
            >
              <Plus className="mr-2 h-5 w-5" />
              Crear Mi Primer Evento
            </Link>
          </div>
        ) : (
          <>
            {/* Event Selector */}
            {userEvents.length > 1 && (
              <div className="mb-8">
                <label htmlFor="eventSelect" className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Evento
                </label>
                <select
                  id="eventSelect"
                  value={selectedEvent || userEvents[0]?._id}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {userEvents.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentEvent && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {(() => {
                    const stats = getEventStats(currentEvent);
                    return (
                      <>
                        <StatsCard
                          title="Total Invitados"
                          value={stats.total}
                          icon={<Users className="h-6 w-6" />}
                          color="blue"
                        />
                        <StatsCard
                          title="Confirmados"
                          value={stats.confirmed}
                          icon={<UserCheck className="h-6 w-6" />}
                          color="green"
                        />
                        <StatsCard
                          title="Pendientes"
                          value={stats.pending}
                          icon={<UserX className="h-6 w-6" />}
                          color="yellow"
                        />
                        <StatsCard
                          title="Asistieron"
                          value={stats.attended}
                          icon={<PieChart className="h-6 w-6" />}
                          color="purple"
                        />
                      </>
                    );
                  })()}
                </div>

                {/* Event Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {currentEvent.title}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/invitation/${currentEvent._id}/${currentEvent.guests[0]?._id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Vista Previa
                    </Link>
                    <Link
                      to={`/admin/scanner/${currentEvent._id}`}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      Escáner QR
                    </Link>
                    <button 
                      onClick={() => sendBulkWhatsAppInvitations(currentEvent, currentEvent.guests.filter(g => !g.confirmed))}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Enviar por WhatsApp
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar
                    </button>
                  </div>
                </div>

                {/* Guest List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Lista de Invitados
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invitado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acompañantes
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Menú
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Asistencia
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentEvent.guests.map((guest: IGuest) => (
                          <tr key={guest._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {guest.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {guest.phone}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                guest.confirmed
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {guest.confirmed ? 'Confirmado' : 'Pendiente'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {guest.companions}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {guest.confirmed ? guest.menuType : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                guest.attended
                                  ? 'bg-purple-100 text-purple-800'
                                  : guest.confirmed
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {guest.attended 
                                  ? 'Asistió' 
                                  : guest.confirmed 
                                  ? 'No asistió' 
                                  : '-'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;