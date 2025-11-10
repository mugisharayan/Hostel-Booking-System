// Test script to verify backend integration
const testIntegration = async () => {
  const API_BASE = 'http://localhost:5000/api';
  
  console.log('🧪 Testing Backend Integration...\n');
  
  // Test 1: API Connectivity
  try {
    const response = await fetch(`${API_BASE}/test`);
    const data = await response.json();
    console.log('✅ API Connectivity:', data.message);
  } catch (error) {
    console.log('❌ API Connectivity:', error.message);
  }
  
  // Test 2: User Registration
  try {
    const testUser = {
      fullName: 'Test Student',
      email: `test${Date.now()}@student.mak.ac.ug`,
      phone: '0771234567',
      course: 'Computer Science',
      gender: 'male',
      role: 'student'
    };
    
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ User Registration: Success');
      console.log('   Token:', userData.token ? 'Generated' : 'Missing');
    } else {
      const error = await response.json();
      console.log('❌ User Registration:', error.message);
    }
  } catch (error) {
    console.log('❌ User Registration:', error.message);
  }
  
  console.log('\n🎯 Integration test complete!');
};

// Run if called directly
if (typeof window === 'undefined') {
  testIntegration();
}

export default testIntegration;