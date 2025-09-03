const mongoose = require('mongoose');
require('dotenv').config();

const connectDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('📍 Environment:', process.env.NODE_ENV || 'development');
    
    // Validate MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    // ✅ FIXED: Removed all deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // ✅ Only use these modern, supported options:
      maxPoolSize: 10,              // Maximum number of connections
      serverSelectionTimeoutMS: 5000,  // How long to try selecting a server
      socketTimeoutMS: 45000,       // How long a send or receive on a socket can take
      family: 4                     // Use IPv4, skip trying IPv6
    });

    console.log(`🎉 MongoDB Atlas Connected Successfully!`);
    console.log(`📊 Database Host: ${conn.connection.host}`);
    console.log(`📋 Database Name: ${conn.connection.name}`);
    console.log(`🔗 Connection State: Connected ✅`);
    
    // Test the connection with a ping
    try {
      await mongoose.connection.db.admin().ping();
      console.log('🏓 Database Ping: Success ✅');
    } catch (pingError) {
      console.warn('🏓 Database Ping: Failed (but connection established)');
    }
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error('Error message:', error.message);
    
    // Provide helpful error diagnosis
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication Error: Check your username and password');
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      console.error('🌐 Network Error: Check your internet connection and IP whitelist');
    } else if (error.message.includes('MONGODB_URI')) {
      console.error('⚙️ Configuration Error: Check your .env file');
    }
    
    process.exit(1);
  }

  // Connection event listeners
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Atlas connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('🔌 MongoDB Atlas disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB Atlas reconnected');
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
    console.log(`📤 ${signal} received. Closing MongoDB Atlas connection...`);
    try {
      await mongoose.connection.close();
      console.log('🔌 MongoDB Atlas connection closed gracefully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
};

module.exports = connectDatabase;
