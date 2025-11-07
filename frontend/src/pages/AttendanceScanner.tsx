import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsAPI, guestsAPI } from '../services/api';
import { IEvent, IGuest } from '../types';
import { ArrowLeft, QrCode, CheckCircle, AlertCircle, Camera } from 'lucide-react';

const AttendanceScanner = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [attendanceResult, setAttendanceResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: event, isLoading, isError, error } = useQuery<IEvent>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is missing');
      const response = await eventsAPI.getById(eventId);
      return response.data.data;
    },
    enabled: !!eventId,
  });

  const markAttendedMutation = useMutation({
    mutationFn: ({ eventId, guestId }: { eventId: string; guestId: string }) =>
      guestsAPI.markAttended(eventId, guestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] }); // Invalidate and refetch event data
    },
  });

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara. Por favor, permite el acceso y vuelve a intentar.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleManualInput = (code: string) => {
    setScanResult(code);
    processAttendance(code);
  };

  const processAttendance = async (code: string) => {
    if (!event) return;

    const guest = event.guests.find(g => g.confirmationCode === code);
    
    if (guest) {
      if (guest.confirmed) {
        if (!guest.attended) {
          try {
            await markAttendedMutation.mutateAsync({ eventId: event._id, guestId: guest._id });
            setAttendanceResult({
              success: true,
              guest: guest,
              message: 'Asistencia registrada exitosamente'
            });
          } catch (mutationError: any) {
            console.error('Error marking attendance:', mutationError);
            setAttendanceResult({
              success: false,
              guest: guest,
              message: mutationError.response?.data?.error?.message || 'Error al registrar asistencia'
            });
          }
        } else {
          setAttendanceResult({
            success: false,
            guest: guest,
            message: 'Este invitado ya registró su asistencia'
          });
        }
      } else {
        setAttendanceResult({
          success: false,
          guest: guest,
          message: 'Este invitado no ha confirmado su asistencia'
        });
      }
    } else {
      setAttendanceResult({
        success: false,
        guest: null,
        message: 'Código QR no válido para este evento'
      });
    }

    setTimeout(() => {
      setAttendanceResult(null);
      setScanResult('');
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando escáner...</h2>
          <p className="text-gray-600">Obteniendo detalles del evento.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el evento</h2>
          <p className="text-gray-600">{error?.message || 'Ha ocurrido un error inesperado.'}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Evento no encontrado</h2>
          <p className="text-gray-600">Este evento no existe o no tienes permisos para acceder.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Escáner de Asistencia</h1>
              <p className="text-gray-600">{event.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scanner Interface */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center mb-6">
            <QrCode className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Registrar Asistencia
            </h2>
            <p className="text-gray-600">
              Escanea el código QR de la invitación o ingresa el código manualmente
            </p>
          </div>

          {/* Camera Section */}
          <div className="mb-6">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 relative">
              {isScanning ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="opacity-75">Toca "Iniciar Escáner" para activar la cámara</p>
                  </div>
                </div>
              )}
              
              {/* Scanner overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-purple-500 rounded-lg animate-pulse"></div>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setIsScanning(!isScanning)}
                className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                  isScanning
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isScanning ? 'Detener Escáner' : 'Iniciar Escáner'}
              </button>
            </div>
          </div>

          {/* Manual Input */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Ingreso Manual</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={scanResult}
                onChange={(e) => setScanResult(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ingresa el código de confirmación"
              />
              <button
                onClick={() => handleManualInput(scanResult)}
                disabled={!scanResult.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                Verificar
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Códigos de ejemplo: {event.guests.map(g => g.confirmationCode).join(', ')}
            </p>
          </div>
        </div>

        {/* Result Display */}
        {attendanceResult && (
          <div className={`bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 ${
            attendanceResult.success ? 'border-green-500' : 'border-red-500'
          }`}>
            <div className="flex items-center">
              {attendanceResult.success ? (
                <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-500 mr-4" />
              )}
              <div>
                <h3 className={`text-lg font-semibold ${
                  attendanceResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {attendanceResult.success ? '¡Éxito!' : 'Error'}
                </h3>
                <p className="text-gray-600">{attendanceResult.message}</p>
                {attendanceResult.guest && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p><strong>Invitado:</strong> {attendanceResult.guest.name}</p>
                    <p><strong>Acompañantes:</strong> {attendanceResult.guest.companions}</p>
                    <p><strong>Menú:</strong> {attendanceResult.guest.menuType}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas del Evento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {event.guests.filter(g => g.confirmed).length}
              </div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {event.guests.filter(g => g.attended).length}
              </div>
              <div className="text-sm text-gray-600">Asistieron</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {event.guests.filter(g => g.confirmed && !g.attended).length}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceScanner;