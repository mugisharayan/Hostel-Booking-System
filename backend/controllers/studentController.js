const Student = require('../models/Student');

const signupStudent = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const student = new Student({
      name,
      email,
      phone
    });
    
    await student.save();
    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
};

module.exports = {
  signupStudent
};