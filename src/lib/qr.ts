import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export async function generateEventTicket(
  eventTitle: string,
  eventDate: string,
  eventTime: string,
  location: string,
  studentName: string,
  qrData: string,
  collegeColors: { primary: string; gradient: string }
): Promise<string> {
  // Create a temporary div for the ticket
  const ticketDiv = document.createElement('div');
  ticketDiv.style.width = '400px';
  ticketDiv.style.height = '600px';
  ticketDiv.style.background = `linear-gradient(135deg, ${collegeColors.primary}, ${collegeColors.gradient})`;
  ticketDiv.style.padding = '30px';
  ticketDiv.style.borderRadius = '20px';
  ticketDiv.style.color = 'white';
  ticketDiv.style.fontFamily = 'Arial, sans-serif';
  ticketDiv.style.position = 'absolute';
  ticketDiv.style.left = '-9999px';
  
  const qrCodeDataURL = await generateQRCode(qrData);
  
  ticketDiv.innerHTML = `
    <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h1 style="font-size: 24px; margin-bottom: 10px; font-weight: bold;">${eventTitle}</h1>
        <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px; margin: 20px 0;">
          <p style="margin: 8px 0; font-size: 16px;"><strong>Date:</strong> ${eventDate}</p>
          <p style="margin: 8px 0; font-size: 16px;"><strong>Time:</strong> ${eventTime}</p>
          <p style="margin: 8px 0; font-size: 16px;"><strong>Location:</strong> ${location}</p>
          <p style="margin: 8px 0; font-size: 16px;"><strong>Student:</strong> ${studentName}</p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <img src="${qrCodeDataURL}" style="width: 200px; height: 200px; background: white; padding: 15px; border-radius: 15px;" />
        <p style="margin-top: 15px; font-size: 14px; opacity: 0.9;">Scan for check-in</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(ticketDiv);
  
  try {
    const canvas = await html2canvas(ticketDiv, {
      backgroundColor: null,
      scale: 2
    });
    
    document.body.removeChild(ticketDiv);
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    document.body.removeChild(ticketDiv);
    throw error;
  }
}

export async function downloadTicketPDF(
  ticketImageData: string,
  eventTitle: string
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const imgWidth = 100;
  const imgHeight = 150;
  const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
  const y = 30;
  
  pdf.addImage(ticketImageData, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save(`${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ticket.pdf`);
}