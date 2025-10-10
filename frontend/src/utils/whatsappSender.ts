import { EventData, Guest } from '../contexts/EventContext';

export const sendWhatsAppInvitation = (event: EventData, guest: Guest) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const invitationUrl = `${window.location.origin}/invitation/${event.id}/${guest.id}`;
  
  const message = `🎉 *${event.title}* 🎉

¡Hola ${guest.name}!

${event.hosts.join(' & ')} te invita${event.hosts.length > 1 ? 'n' : ''} cordialmente a celebrar:

📅 *Fecha:* ${formattedDate}
🕐 *Hora:* ${formattedTime}
📍 *Lugar:* ${event.location.name}
${event.location.address}

${event.description}

Para confirmar tu asistencia y ver todos los detalles del evento, haz clic en el siguiente enlace:
${invitationUrl}

Tu código de confirmación es: *${guest.confirmationCode}*

¡Esperamos verte allí! 💕

_Enviado desde EventInvite_`;

  // Clean phone number (remove spaces, dashes, parentheses)
  const cleanPhone = guest.phone.replace(/[\s\-\(\)]/g, '');
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  
  // Open WhatsApp
  window.open(whatsappUrl, '_blank');
};

export const sendBulkWhatsAppInvitations = (event: EventData, guests: Guest[]) => {
  guests.forEach((guest, index) => {
    setTimeout(() => {
      sendWhatsAppInvitation(event, guest);
    }, index * 2000); // 2 second delay between each message
  });
};