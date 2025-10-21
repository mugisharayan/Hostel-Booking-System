

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendPaymentConfirmation(payment, booking, student) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: 'Hostel Booking Payment Confirmation',
      html: this.generatePaymentEmailTemplate(payment, booking, student)
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendBookingConfirmation(booking, student) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: 'Hostel Booking Confirmation',
      html: this.generateBookingEmailTemplate(booking, student)
    };

    await this.transporter.sendMail(mailOptions);
  }

  generatePaymentEmailTemplate(payment, booking, student) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .token { background: #ffeb3b; padding: 10px; margin: 10px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${student.firstName},</p>
            <p>Your payment for hostel booking has been received successfully.</p>
            <p><strong>Booking Details:</strong></p>
            <p>Hostel: ${booking.hostel.name}</p>
            <p>Room: ${booking.room.roomNumber}</p>
            <p>Amount: ${payment.amount.toLocaleString()} UGX</p>
            <p>Transaction ID: ${payment.transactionId}</p>
            <div class="token">
              Verification Token: ${payment.verificationToken}
            </div>
            <p>Please keep this token safe for check-in.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateBookingEmailTemplate(booking, student) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${student.firstName},</p>
            <p>Your hostel booking has been confirmed.</p>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Check-in:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = EmailService;