import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const receiptService = {
  // Generate and download receipt PDF
  generateReceipt: async (bookingData) => {
    try {
      // Create receipt HTML
      const receiptHTML = receiptService.createReceiptHTML(bookingData);
      
      // Create temporary container
      const container = document.createElement('div');
      container.innerHTML = receiptHTML;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '800px';
      document.body.appendChild(container);
      
      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary container
      document.body.removeChild(container);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Download PDF
      const fileName = `BookMyHostel_Receipt_${bookingData.transactionId || Date.now()}.pdf`;
      pdf.save(fileName);
      
      return { success: true, fileName };
    } catch (error) {
      console.error('Receipt generation failed:', error);
      throw new Error('Failed to generate receipt');
    }
  },

  // Create receipt HTML template
  createReceiptHTML: (bookingData) => {
    const currentDate = new Date().toLocaleDateString();
    const bookingDate = new Date(bookingData.createdAt || bookingData.bookingDate).toLocaleDateString();
    
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-sizing: border-box;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #0ea5e9;">
          <div style="display: inline-flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);">
              <div style="width: 40px; height: 40px; background: white; border-radius: 8px; position: relative;">
                <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 16px; background: #0ea5e9; border-radius: 2px 2px 0 0;"></div>
                <div style="position: absolute; bottom: 8px; left: 8px; width: 24px; height: 12px; background: #0ea5e9; border-radius: 0 0 2px 2px;"></div>
                <div style="position: absolute; bottom: 8px; left: 16px; width: 8px; height: 8px; background: white; border-radius: 1px;"></div>
              </div>
            </div>
            <div style="text-align: left;">
              <h1 style="font-size: 36px; font-weight: 800; margin: 0; background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2;">
                Book<span style="color: #06b6d4;">My</span>Hostel
              </h1>
              <p style="font-size: 16px; color: #64748b; margin: 4px 0 0 0; font-weight: 500;">Student Accommodation Platform</p>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; margin-top: 20px;">
            <h2 style="font-size: 28px; color: #1e293b; margin: 0; font-weight: 700;">BOOKING RECEIPT</h2>
            <p style="color: #64748b; margin: 8px 0 0 0; font-size: 16px;">Official Payment Confirmation</p>
          </div>
        </div>

        <!-- Receipt Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
          <div>
            <h3 style="color: #0ea5e9; font-size: 18px; margin-bottom: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
              <span style="margin-right: 8px; display: inline-block; width: 16px; height: 16px; background: #0ea5e9; border-radius: 2px;"></span> Receipt Information
            </h3>
            <div style="space-y: 12px;">
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 14px; display: block;">Receipt Number</span>
                <strong style="color: #1e293b; font-size: 16px;">${bookingData.transactionId || 'BMH' + Date.now()}</strong>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 14px; display: block;">Issue Date</span>
                <strong style="color: #1e293b; font-size: 16px;">${currentDate}</strong>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 14px; display: block;">Booking Date</span>
                <strong style="color: #1e293b; font-size: 16px;">${bookingDate}</strong>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style="color: #0ea5e9; font-size: 18px; margin-bottom: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
              <span style="margin-right: 8px; display: inline-block; width: 16px; height: 16px; background: #0ea5e9; border-radius: 50%;"></span> Student Information
            </h3>
            <div style="space-y: 12px;">
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 14px; display: block;">Student Name</span>
                <strong style="color: #1e293b; font-size: 16px;">${bookingData.studentName || 'N/A'}</strong>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 14px; display: block;">Email Address</span>
                <strong style="color: #1e293b; font-size: 16px;">${bookingData.studentEmail || 'N/A'}</strong>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 14px; display: block;">Phone Number</span>
                <strong style="color: #1e293b; font-size: 16px;">${bookingData.studentPhone || 'N/A'}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Details -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 30px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
          <h3 style="color: #0ea5e9; font-size: 20px; margin-bottom: 24px; font-weight: 700; text-align: center;">
            <span style="margin-right: 8px; display: inline-block; width: 20px; height: 20px; background: #0ea5e9; border-radius: 4px;"></span> Accommodation Details
          </h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="margin-bottom: 16px;">
                <span style="color: #64748b; font-size: 14px; display: block; margin-bottom: 4px;">Hostel Name</span>
                <strong style="color: #1e293b; font-size: 18px; font-weight: 700;">${bookingData.hostelName || bookingData.hostel || 'N/A'}</strong>
              </div>
              <div>
                <span style="color: #64748b; font-size: 14px; display: block; margin-bottom: 4px;">Room Type</span>
                <strong style="color: #1e293b; font-size: 16px;">${bookingData.roomName || bookingData.room || 'N/A'}</strong>
              </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="margin-bottom: 16px;">
                <span style="color: #64748b; font-size: 14px; display: block; margin-bottom: 4px;">Check-in Date</span>
                <strong style="color: #1e293b; font-size: 16px;">${new Date(bookingData.startDate || Date.now()).toLocaleDateString()}</strong>
              </div>
              <div>
                <span style="color: #64748b; font-size: 14px; display: block; margin-bottom: 4px;">Check-out Date</span>
                <strong style="color: #1e293b; font-size: 16px;">${new Date(bookingData.endDate || new Date().setMonth(new Date().getMonth() + 4)).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Summary -->
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
          <h3 style="font-size: 20px; margin-bottom: 24px; font-weight: 700; text-align: center; margin-top: 0;">
            <span style="margin-right: 8px; display: inline-block; width: 20px; height: 16px; background: white; border-radius: 2px;"></span> Payment Summary
          </h3>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; backdrop-filter: blur(10px);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2);">
              <span style="font-size: 16px;">Room Fee</span>
              <strong style="font-size: 16px;">UGX ${parseInt(bookingData.price || bookingData.amount || 0).toLocaleString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2);">
              <span style="font-size: 16px;">Service Fee</span>
              <strong style="font-size: 16px;">UGX 5,000</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; padding-top: 12px; border-top: 2px solid rgba(255,255,255,0.3);">
              <span>Total Amount Paid</span>
              <strong>UGX ${parseInt((bookingData.price || bookingData.amount || 0) + 5000).toLocaleString()}</strong>
            </div>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; display: inline-block;">
              <span style="font-size: 14px; opacity: 0.9;">Payment Method: </span>
              <strong style="font-size: 16px;">${bookingData.paymentMethod || 'Mobile Money'}</strong>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: #dcfce7; color: #166534; padding: 16px 32px; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 16px; border: 2px solid #bbf7d0;">
            <span style="margin-right: 8px; display: inline-block; width: 16px; height: 16px; background: #166534; border-radius: 50%;"></span> PAYMENT CONFIRMED
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 2px solid #e2e8f0; padding-top: 30px; text-align: center; color: #64748b;">
          <div style="margin-bottom: 20px;">
            <h4 style="color: #1e293b; margin-bottom: 12px; font-size: 16px;">Contact Information</h4>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> support@bookmyhostel.com</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> +256 700 123 456</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> Makerere University, Kampala, Uganda</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 20px;">
            <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
              This is an official receipt from BookMyHostel. Please keep this receipt for your records. 
              For any inquiries regarding this booking, please contact our support team with your receipt number.
            </p>
          </div>
          
          <p style="font-size: 12px; margin-top: 20px; color: #94a3b8;">
            Generated on ${currentDate} | BookMyHostel © ${new Date().getFullYear()}
          </p>
        </div>
      </div>
    `;
  }
};

export default receiptService;