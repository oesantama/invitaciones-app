import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { EventData, Guest } from '../contexts/EventContext';

export const generateInvitationPDF = async (event: EventData, guest: Guest) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Generate QR Code
  const qrCodeData = `${window.location.origin}/invitation/${event.id}/${guest.id}`;
  const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
    width: 200,
    margin: 2,
    color: {
      dark: event.theme.primaryColor,
      light: '#FFFFFF'
    }
  });

  // Set background color
  pdf.setFillColor(event.theme.backgroundColor);
  pdf.rect(0, 0, 210, 297, 'F');

  // Header with gradient effect (simulated with rectangles)
  const headerHeight = 60;
  pdf.setFillColor(event.theme.primaryColor);
  pdf.rect(0, 0, 210, headerHeight, 'F');

  // Event title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(event.title, 180);
  pdf.text(titleLines, 105, 25, { align: 'center' });

  // Event description
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const descLines = pdf.splitTextToSize(event.description, 180);
  pdf.text(descLines, 105, 40, { align: 'center' });

  // Hosts
  pdf.setFontSize(10);
  pdf.text(`Con cariño: ${event.hosts.join(' & ')}`, 105, 50, { align: 'center' });

  // Guest welcome section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`¡Hola, ${guest.name}!`, 105, 80, { align: 'center' });

  // Event details box
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.rect(20, 90, 170, 80, 'S');

  // Date and time
  const eventDate = new Date(event.date);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Fecha y Hora:', 30, 105);
  pdf.setFont('helvetica', 'normal');
  pdf.text(eventDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }), 30, 115);
  pdf.text(eventDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  }), 30, 125);

  // Location
  pdf.setFont('helvetica', 'bold');
  pdf.text('Ubicación:', 30, 140);
  pdf.setFont('helvetica', 'normal');
  pdf.text(event.location.name, 30, 150);
  const addressLines = pdf.splitTextToSize(event.location.address, 80);
  pdf.text(addressLines, 30, 160);

  // Guest details
  if (guest.confirmed) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detalles de tu confirmación:', 110, 105);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Acompañantes: ${guest.companions}`, 110, 115);
    pdf.text(`Menú: ${guest.menuType === 'adult' ? 'Adulto' : 'Niño'}`, 110, 125);
    pdf.text(`Código: ${guest.confirmationCode}`, 110, 135);
  }

  // QR Code
  pdf.addImage(qrCodeDataURL, 'PNG', 140, 140, 40, 40);
  pdf.setFontSize(8);
  pdf.text('Escanea para acceder', 160, 185, { align: 'center' });

  // Schedule section
  if (event.schedule.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Cronograma del Evento', 105, 200, { align: 'center' });

    let yPos = 210;
    event.schedule.forEach((item, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${item.time} - ${item.activity}`, 30, yPos);
      
      if (item.description) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        const descLines = pdf.splitTextToSize(item.description, 150);
        pdf.text(descLines, 30, yPos + 5);
        yPos += 5 + (descLines.length * 3);
      }
      yPos += 10;
    });
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Generado por EventInvite', 105, 290, { align: 'center' });

  // Save the PDF
  const fileName = `Invitacion_${event.title.replace(/\s+/g, '_')}_${guest.name.replace(/\s+/g, '_')}.pdf`;
  pdf.save(fileName);
};