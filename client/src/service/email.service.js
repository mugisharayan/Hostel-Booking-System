// Email Service for Room Assignment Notifications

class EmailService {
  constructor() {
    this.apiUrl = '/api/email'; // Your backend email API endpoint
  }

  // Generate secure access token
  generateAccessToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `RA-${timestamp}-${random}`;
  }

  // Send room assignment notification email
  async sendRoomAssignmentNotification(assignmentData) {
    const {
      student,
      room,
      accessToken,
      assignedBy,
      assignmentDate
    } = assignmentData;

    const emailPayload = {
      to: student.email,
      subject: `🏠 Room Assignment Confirmation - ${room.id}`,
      template: 'room-assignment',
      data: {
        studentName: student.name,
        studentId: student.studentId,
        roomNumber: room.id,
        hotel: room.hotel,
        floor: room.floor,
        roomType: room.type,
        accessToken: accessToken,
        assignedBy: assignedBy,
        assignmentDate: assignmentDate,
        checkInInstructions: 'Please present this access token at the reception desk during check-in.',
        supportEmail: 'accommodation@university.edu',
        supportPhone: '+256 700 000 000'
      }
    };

    try {
      // In production, this would make an actual API call to your email service
      const response = await this.mockEmailAPI(emailPayload);
      
      console.log('✅ Room assignment email sent successfully:', {
        to: student.email,
        room: room.id,
        token: accessToken
      });

      return {
        success: true,
        message: 'Email notification sent successfully',
        emailId: response.emailId
      };
    } catch (error) {
      console.error('❌ Failed to send room assignment email:', error);
      return {
        success: false,
        message: 'Failed to send email notification',
        error: error.message
      };
    }
  }

  // Mock email API for development/testing
  async mockEmailAPI(emailPayload) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate occasional failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Email service temporarily unavailable');
    }

    // Log email content for development
    console.log('📧 Mock Email Sent:', {
      to: emailPayload.to,
      subject: emailPayload.subject,
      content: this.generateEmailContent(emailPayload.data)
    });

    return {
      emailId: `email_${Date.now()}`,
      status: 'sent',
      timestamp: new Date().toISOString()
    };
  }

  // Generate email content for preview/logging (without token)
  generateEmailContent(data) {
    return `
Dear ${data.studentName},

Congratulations! Your room assignment has been confirmed.

🏠 ROOM DETAILS:
• Room Number: ${data.roomNumber}
• Hotel: ${data.hotel}
• Floor: ${data.floor}
• Room Type: ${data.roomType}

📅 Assignment Date: ${data.assignmentDate}
👤 Assigned By: ${data.assignedBy}

🔑 ACCESS TOKEN:
Your secure access token will be provided separately by the custodian.
Please contact the accommodation office to receive your token.

📋 CHECK-IN INSTRUCTIONS:
1. Visit the accommodation office to collect your access token
2. Present the token at reception during check-in
3. Bring your student ID for verification

📞 SUPPORT:
Email: ${data.supportEmail}
Phone: ${data.supportPhone}

Welcome to your new accommodation!

Best regards,
University Accommodation Services
    `;
  }

  // Send bulk assignment notifications
  async sendBulkAssignmentNotifications(assignments) {
    const results = [];
    
    for (const assignment of assignments) {
      try {
        const result = await this.sendRoomAssignmentNotification(assignment);
        results.push({
          studentId: assignment.student.studentId,
          ...result
        });
      } catch (error) {
        results.push({
          studentId: assignment.student.studentId,
          success: false,
          message: error.message
        });
      }
    }

    return results;
  }
}

export default new EmailService();