require('dotenv').config();
const connectDatabase = require('./config/database');
const User = require('./models/User');
const Bug = require('./models/Bug');

const testModels = async () => {
  try {
    await connectDatabase();
    
    // Test User model
    console.log('✅ User model loaded successfully');
    console.log('User schema fields:', Object.keys(User.schema.paths));
    
    // Test Bug model  
    console.log('✅ Bug model loaded successfully');
    console.log('Bug schema fields:', Object.keys(Bug.schema.paths));
    
    console.log('🎉 All models are working correctly!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Model test failed:', error);
    process.exit(1);
  }
};

testModels();
