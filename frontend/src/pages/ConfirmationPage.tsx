import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsAPI, guestsAPI } from '../services/api';
import { IEvent, IGuest } from '../types';
import { Check, Download, QrCode, Users, UtensilsCrossed } from 'lucide-react';
import { generateInvitationPDF } from '../utils/pdfGenerator';

const ConfirmationPage = () => {
  const { eventId, guestId } = useParams<{ eventId: string; guestId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [companions, setCompanions] = useState(0);
  const [menuType, setMenuType] = useState<'adult' | 'child'>('adult');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');

  const { data: event, isLoading, isError, error: queryError } = useQuery<IEvent>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is missing');
      const response = await eventsAPI.getById(eventId);
      return response.data.data;
    },
    enabled: !!eventId,
  });

  const guest: IGuest | undefined = event?.guests.find(g => g._id === guestId);

  const confirmAttendanceMutation = useMutation({
    mutationFn: ({ eventId, guestId, data }: { eventId: string; guestId: string; data: { companions?: number; menuType?: string } }) =>
      guestsAPI.confirmAttendance(eventId, guestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] }); // Invalidate and refetch event data
      setIsConfirmed(true);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Error al confirmar asistencia');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando confirmación...</h2>
          <p className="text-gray-600">Por favor, espera un momento.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar la página</h2>
          <p className="text-gray-600">{queryError?.message || 'Ha ocurrido un error inesperado.'}</p>
        </div>
      </div>
    );
  }

  if (!event || !guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmación no disponible</h2>
          <p className="text-gray-600">Esta página de confirmación no existe o ha expirado.</p>
        </div>
      </div>
    );
  }

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmationCode !== guest.confirmationCode) {
      setError('Código de confirmación incorrecto');
      return;
    }

    await confirmAttendanceMutation.mutateAsync({
      eventId: event._id,
      guestId: guest._id,
      data: {
        companions,
        menuType
      }
    });
  };

  const generateInvitationCard = () => {
    if (event && guest) {
      generateInvitationPDF(event, guest);
    }
  };

  if (isConfirmed || guest.confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <Check className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Confirmación Exitosa!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Gracias, {guest.name}. Tu asistencia ha sido confirmada para {event.title}.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles de tu Confirmación:</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Evento:</span>
                  <span className="text-gray-900 font-medium">{event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(event.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Invitado:</span>
                  <span className="text-gray-900 font-medium">{guest.name}</span>
                </div>
                {event.settings.allowCompanions && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Acompañantes:</span>
                    <span className="text-gray-900 font-medium">{companions}</span>
                  </div>
                )}
                {event.settings.requireMenuSelection && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Menú:</span>
                    <span className="text-gray-900 font-medium capitalize">{menuType}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={generateInvitationCard}
                className="w-full flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${event.theme.primaryColor}, ${event.theme.secondaryColor})` 
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Descargar Tarjeta de Invitación PDF
              </button>
              
              <div className="text-sm text-gray-500">
                <p>Tu tarjeta incluirá un código QR para el acceso al evento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <QrCode className="h-12 w-12" style={{ color: event.theme.primaryColor }} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Confirmar Asistencia
            </h1>
            <h2 className="text-xl text-gray-600 mb-4">{event.title}</h2>
            <p className="text-gray-600">
              Hola {guest.name}, por favor confirma tu asistencia al evento
            </p>
          </div>

          <form onSubmit={handleConfirmation} className="space-y-6">
            {/* Confirmation Code */}
            <div>
              <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Confirmación
              </label>
              <input
                type="text"
                id="confirmationCode"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa tu código"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Código de ejemplo: {guest.confirmationCode}
              </p>
            </div>

            {/* Companions */}
            {event.settings.allowCompanions && (
              <div>
                <label htmlFor="companions" className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  ¿Vienes acompañado?
                </label>
                <select
                  id="companions"
                  value={companions}
                  onChange={(e) => setCompanions(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                >
                  <option value={0}>Solo/a</option>
                  {Array.from({ length: event.settings.maxCompanions }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Con {i + 1} acompañante{i + 1 > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Menu Selection */}
            {event.settings.requireMenuSelection && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UtensilsCrossed className="inline h-4 w-4 mr-1" />
                  Tipo de Menú
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="menuType"
                      value="adult"
                      checked={menuType === 'adult'}
                      onChange={(e) => setMenuType(e.target.value as 'adult' | 'child')}
                      className="text-purple-600"
                    />
                    <span>Adulto</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="menuType"
                      value="child"
                      checked={menuType === 'child'}
                      onChange={(e) => setMenuType(e.target.value as 'adult' | 'child')}
                      className="text-purple-600"
                    />
                    <span>Niño</span>
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-4 text-lg font-medium text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${event.theme.primaryColor}, ${event.theme.secondaryColor})` 
              }}
            >
              <Check className="mr-2 h-5 w-5" />
              Confirmar Asistencia
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;