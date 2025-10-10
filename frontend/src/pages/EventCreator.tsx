import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvent, EventData } from '../contexts/EventContext';
import { ArrowLeft, Save, Plus, Trash2, Upload, Download, Send } from 'lucide-react';
import { processExcelFile, downloadExcelTemplate, GuestImportData } from '../utils/excelProcessor';
import { generateUniqueCode } from '../utils/codeGenerator';
import { sendBulkWhatsAppInvitations } from '../utils/whatsappSender';

const EventCreator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addEvent } = useEvent();

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: {
      name: '',
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    hosts: [''],
    schedule: [{ time: '', activity: '', description: '' }],
    guests: [{ name: '', phone: '', confirmationCode: '' }],
    theme: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#EC4899',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
      backgroundColor: '#F9FAFB'
    },
    media: {
      photos: [],
      video: ''
    },
    settings: {
      allowCompanions: true,
      requireMenuSelection: true,
      maxCompanions: 2
    }
  });

  const [isImporting, setIsImporting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedGuests = eventData.guests.map(guest => ({
      id: `guest-${Date.now()}-${Math.random()}`,
      name: guest.name,
      phone: guest.phone,
      confirmed: false,
      attended: false,
      companions: 0,
      menuType: 'adult' as const,
      confirmationCode: guest.confirmationCode || generateUniqueCode(
        eventData.guests.map(g => g.confirmationCode).filter(Boolean),
        guest.name,
        `event-${Date.now()}`
      )
    }));

    const newEvent: Omit<EventData, 'id' | 'createdAt'> = {
      ...eventData,
      guests: processedGuests,
      createdBy: user?.id || '1'
    };

    addEvent(newEvent);
    navigate('/admin');
  };

  const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const importedGuests = await processExcelFile(file);
      const existingCodes = eventData.guests.map(g => g.confirmationCode).filter(Boolean);
      
      const processedGuests = importedGuests.map(guest => ({
        name: guest.name,
        phone: guest.phone,
        confirmationCode: generateUniqueCode(existingCodes, guest.name, `event-${Date.now()}`)
      }));

      setEventData(prev => ({
        ...prev,
        guests: [...prev.guests, ...processedGuests]
      }));

      alert(`Se importaron ${importedGuests.length} invitados exitosamente`);
    } catch (error) {
      alert('Error al importar el archivo: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const addHost = () => {
    setEventData(prev => ({
      ...prev,
      hosts: [...prev.hosts, '']
    }));
  };

  const removeHost = (index: number) => {
    setEventData(prev => ({
      ...prev,
      hosts: prev.hosts.filter((_, i) => i !== index)
    }));
  };

  const updateHost = (index: number, value: string) => {
    setEventData(prev => ({
      ...prev,
      hosts: prev.hosts.map((host, i) => i === index ? value : host)
    }));
  };

  const addScheduleItem = () => {
    setEventData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { time: '', activity: '', description: '' }]
    }));
  };

  const removeScheduleItem = (index: number) => {
    setEventData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const updateScheduleItem = (index: number, field: string, value: string) => {
    setEventData(prev => ({
      ...prev,
      schedule: prev.schedule.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addGuest = () => {
    setEventData(prev => ({
      ...prev,
      guests: [...prev.guests, { name: '', phone: '', confirmationCode: '' }]
    }));
  };

  const removeGuest = (index: number) => {
    setEventData(prev => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index)
    }));
  };

  const updateGuest = (index: number, field: string, value: string) => {
    setEventData(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => 
        i === index ? { 
          ...guest, 
          [field]: value,
          // Auto-generate confirmation code when name changes
          ...(field === 'name' && value ? {
            confirmationCode: generateUniqueCode(
              prev.guests.map(g => g.confirmationCode).filter(Boolean),
              value,
              `event-${Date.now()}`
            )
          } : {})
        } : guest
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Evento</h1>
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Evento
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Evento
                </label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Boda de Ana & Carlos"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Descripción del evento..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={eventData.date}
                  onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Hosts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Anfitriones</h2>
              <button
                type="button"
                onClick={addHost}
                className="flex items-center text-sm text-purple-600 hover:text-purple-700"
              >
                <Plus className="mr-1 h-4 w-4" />
                Agregar Anfitrión
              </button>
            </div>
            <div className="space-y-3">
              {eventData.hosts.map((host, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => updateHost(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nombre del anfitrión"
                    required
                  />
                  {eventData.hosts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHost(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Lugar
                </label>
                <input
                  type="text"
                  value={eventData.location.name}
                  onChange={(e) => setEventData(prev => ({
                    ...prev,
                    location: { ...prev.location, name: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Jardín Botánico"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={eventData.location.address}
                  onChange={(e) => setEventData(prev => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Dirección completa"
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Cronograma</h2>
              <button
                type="button"
                onClick={addScheduleItem}
                className="flex items-center text-sm text-purple-600 hover:text-purple-700"
              >
                <Plus className="mr-1 h-4 w-4" />
                Agregar Actividad
              </button>
            </div>
            <div className="space-y-4">
              {eventData.schedule.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actividad
                    </label>
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) => updateScheduleItem(index, 'activity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nombre de la actividad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateScheduleItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Descripción opcional"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guests */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Invitados</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={downloadExcelTemplate}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Plantilla Excel
                </button>
                <label className="flex items-center text-sm text-green-600 hover:text-green-700 cursor-pointer">
                  <Upload className="mr-1 h-4 w-4" />
                  {isImporting ? 'Importando...' : 'Importar Excel'}
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelImport}
                    className="hidden"
                    disabled={isImporting}
                  />
                </label>
                <button
                  type="button"
                  onClick={addGuest}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-700"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Agregar Manual
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {eventData.guests.length > 0 ? eventData.guests.map((guest, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={guest.name}
                      onChange={(e) => updateGuest(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nombre completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => updateGuest(index, 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+573001234567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código
                    </label>
                    <input
                      type="text"
                      value={guest.confirmationCode}
                      onChange={(e) => updateGuest(index, 'confirmationCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Código único"
                      readOnly
                    />
                  </div>
                  <div className="flex items-end">
                    {eventData.guests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuest(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay invitados agregados</p>
                  <p className="text-sm">Usa "Importar Excel" o "Agregar Manual" para comenzar</p>
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuraciones</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Permitir acompañantes
                </label>
                <input
                  type="checkbox"
                  checked={eventData.settings.allowCompanions}
                  onChange={(e) => setEventData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allowCompanions: e.target.checked }
                  }))}
                  className="h-4 w-4 text-purple-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Requerir selección de menú
                </label>
                <input
                  type="checkbox"
                  checked={eventData.settings.requireMenuSelection}
                  onChange={(e) => setEventData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, requireMenuSelection: e.target.checked }
                  }))}
                  className="h-4 w-4 text-purple-600 rounded"
                />
              </div>
              {eventData.settings.allowCompanions && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de acompañantes
                  </label>
                  <select
                    value={eventData.settings.maxCompanions}
                    onChange={(e) => setEventData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, maxCompanions: Number(e.target.value) }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreator;