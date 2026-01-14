// Quick test to check error handling
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const TestModel = mongoose.model('Test', testSchema);

// Test validation error
async function testValidation() {
  try {
    const doc = new TestModel({});
    await doc.validate();
  } catch (error) {
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Is ValidationError:', error.name === 'ValidationError');
  }
}

testValidation();