export const generateConfirmationCode = (name: string, eventId: string): string => {
  // Get initials from name
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 3);
  
  // Get last 4 characters of event ID
  const eventCode = eventId.slice(-4).toUpperCase();
  
  // Generate random 2-digit number
  const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `${initials}${eventCode}${randomNum}`;
};

export const generateUniqueCode = (existingCodes: string[], name: string, eventId: string): string => {
  let code = generateConfirmationCode(name, eventId);
  let counter = 1;
  
  while (existingCodes.includes(code)) {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);
    
    const eventCode = eventId.slice(-4).toUpperCase();
    const randomNum = (Math.floor(Math.random() * 100) + counter).toString().padStart(2, '0');
    
    code = `${initials}${eventCode}${randomNum}`;
    counter++;
  }
  
  return code;
};