import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { MapPin, Calendar, Clock, Users, Video, Image as ImageIcon, ArrowRight, MessageCircle } from 'lucide-react';
import { sendWhatsAppInvitation } from '../utils/whatsappSender';

const InvitationView = () => {
  const { eventId, guestId } = useParams();
  const { getEvent } = useEvent();
  const [event, setEvent] = useState(getEvent(eventId || ''));
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const guest = event?.guests.find(g => g.id === guestId);

  useEffect(() => {
    if (eventId) {
      const eventData = getEvent(eventId);
      setEvent(eventData);
    }
  }, [eventId, getEvent]);

  if (!event || !guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitación no encontrada</h2>
          <p className="text-gray-600">Esta invitación no existe o ha expirado.</p>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: event.theme.backgroundColor }}>
      {/* Header */}
      <div 
        className="relative bg-gradient-to-br text-white overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${event.theme.primaryColor}, ${event.theme.secondaryColor})` 
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: event.theme.fontFamily }}>
              {event.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-6">
              {event.description}
            </p>
            <div className="text-lg opacity-80">
              Con cariño, {event.hosts.join(' & ')}
            </div>
          </div>
        </div>
      </div>

      {/* Guest Welcome */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Hola, {guest.name}!
            </h2>
            <p className="text-gray-600">
              Nos complace invitarte a celebrar con nosotros
            </p>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date & Time */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 mr-3" style={{ color: event.theme.primaryColor }} />
              <h3 className="text-lg font-semibold text-gray-900">Fecha y Hora</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 capitalize">{formatDate(eventDate)}</p>
              <p className="text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                {formatTime(eventDate)}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 mr-3" style={{ color: event.theme.primaryColor }} />
              <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-900 font-medium">{event.location.name}</p>
              <p className="text-gray-600">{event.location.address}</p>
              <a
                href={`https://maps.google.com/?q=${event.location.coordinates.lat},${event.location.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm hover:underline mt-2"
                style={{ color: event.theme.primaryColor }}
              >
                Ver en Google Maps
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cronograma del Evento</h3>
          <div className="space-y-4">
            {event.schedule.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div 
                  className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: event.theme.accentColor }}
                >
                  {item.time}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.activity}</h4>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Gallery */}
        {(event.media.photos.length > 0 || event.media.video) && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Galería</h3>
            
            {/* Photos */}
            {event.media.photos.length > 0 && (
              <div className="mb-6">
                <div className="relative mb-4">
                  <img
                    src={event.media.photos[currentPhotoIndex]}
                    alt={`Foto ${currentPhotoIndex + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {event.media.photos.length > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                      {event.media.photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentPhotoIndex
                              ? 'bg-purple-600'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video */}
            {event.media.video && (
              <div>
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4"
                >
                  <Video className="h-5 w-5" />
                  <span>{showVideo ? 'Ocultar video' : 'Ver video del evento'}</span>
                </button>
                {showVideo && (
                  <video
                    src={event.media.video}
                    controls
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Confirmation CTA */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Confirma tu Asistencia
            </h3>
            <p className="text-gray-600 mb-6">
              Por favor, confirma si podrás acompañarnos en esta fecha especial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/confirm/${eventId}/${guestId}`}
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${event.theme.primaryColor}, ${event.theme.secondaryColor})` 
                }}
              >
                <Users className="mr-2 h-5 w-5" />
                Confirmar Asistencia
              </Link>
              <button
                onClick={() => sendWhatsAppInvitation(event, guest)}
                className="inline-flex items-center px-8 py-4 text-lg font-medium border-2 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                style={{ 
                  borderColor: event.theme.primaryColor,
                  color: event.theme.primaryColor
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Compartir por WhatsApp
              </button>
            </div>
            {guest.confirmed && (
              <p className="mt-4 text-green-600 font-medium">
                ✓ Ya has confirmado tu asistencia
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationView;