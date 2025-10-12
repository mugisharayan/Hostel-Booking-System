
const axios = require('axios');
const { createPayment, fetchPaymentStatus, fetchBookingDetails } = require('HOSTEL-BOOKING-SYSTEMapi');

jest.mock('axios');

describe('API module', () => {
  let mockPost;
  let mockGet;

  beforeAll(() => {
    mockPost = jest.fn();
    mockGet = jest.fn();

    // Mock axios.create to return our fake post/get functions
    axios.create.mockReturnValue({
      post: mockPost,
      get: mockGet,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call POST /payments with payment data', async () => {
    const paymentData = { amount: 100, method: 'card' };
    mockPost.mockResolvedValue({ data: { success: true } });

    const result = await createPayment(paymentData);

    expect(mockPost).toHaveBeenCalledWith('/payments', paymentData);
    expect(result.data.success).toBe(true);
  });

  test('should call GET /payments/:id to fetch payment status', async () => {
    const paymentId = 'P001';
    mockGet.mockResolvedValue({ data: { id: paymentId, status: 'paid' } });

    const result = await fetchPaymentStatus(paymentId);

    expect(mockGet).toHaveBeenCalledWith(`/payments/${paymentId}`);
    expect(result.data.status).toBe('paid');
  });

  test('should call GET /bookings/:bookingId to fetch booking details', async () => {
    const bookingId = 'BD001';
    mockGet.mockResolvedValue({
      data: {
        id: bookingId,
        hostel: 'Olympia Hostel',
        room: 'A1',
        checkIn: '2023-10-01',
        checkOut: '2023-10-05',
      },
    });

    const result = await fetchBookingDetails(bookingId);

    expect(mockGet).toHaveBeenCalledWith(`/bookings/${bookingId}`);
    expect(result.data.hostel).toBe('Olympia Hostel');
    expect(result.data.room).toBe('A1');
    expect(result.data.checkIn).toBe('2023-10-01');
    expect(result.data.checkOut).toBe('2023-10-05');
  });
});
