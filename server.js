console.log('Server file loaded!');
require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const testRoutes = require('./routes/tests');
const consultationRoutes = require('./routes/consultations');
const patientRoutes = require('./routes/patients');
const inventoryRoutes = require('./routes/inventory');
const reportsRoutes = require('./routes/reports');

console.log('authRoutes:', typeof authRoutes);
console.log('appointmentRoutes:', typeof appointmentRoutes);
console.log('testRoutes:', typeof testRoutes);
console.log('consultationRoutes:', typeof consultationRoutes);

// إعداد CORS للعمل على Replit و Netlify
app.use(cors({
  origin: [
    'http://localhost:5000',
    'https://aman-lab-frontend.onrender.com',
    'https://aman-lab.netlify.app',
    'https://amanlab.netlify.app',
    'https://idyllic-parfait-5b9b19.netlify.app',
    'https://profound-moonbeam-b35841.netlify.app',
    'https://0e9efd0d-1d54-4114-9814-ff59f51b6873-00-bksnesdt9vl8.kirk.replit.dev',
    'https://thunderous-marshmallow-5d9bfd.netlify.app',
    'https://877f5bf4b2c8.ngrok-free.app', // تمت الإضافة هنا
    'https://15f570b307ea.ngrok-free.app', // رابط ngrok الجديد
    'https://amanlab.netlify.app' // رابط Netlify
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// إنشاء HTTP server
const server = http.createServer(app);

// إعداد Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// تخزين المستخدمين المتصلين
const connectedUsers = new Map();

// معالجة اتصالات WebSocket
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    socket.userId = decoded.userId;
    socket.userRole = decoded.role;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId} (${socket.userRole})`);
  
  // تخزين المستخدم المتصل
  connectedUsers.set(socket.userId, {
    socketId: socket.id,
    role: socket.userRole
  });
  
  // انضمام المريض إلى غرفة خاصة به
  if (socket.userRole === 'patient') {
    socket.join(`patient_${socket.userId}`);
  }
  
  // انضمام الأدمن إلى غرفة الأدمن
  if (socket.userRole === 'admin') {
    socket.join('admin_room');
  }
  
  // استقبال رسالة جديدة
  socket.on('send_message', async (data) => {
    try {
      const { consultationId, text } = data;
      
      // حفظ الرسالة في قاعدة البيانات
      const Consultation = require('./models/Consultation');
      const consultation = await Consultation.findById(consultationId);
      
      if (!consultation) {
        socket.emit('error', { message: 'الاستشارة غير موجودة' });
        return;
      }
      
      const sender = socket.userRole === 'admin' ? 'admin' : 'patient';
      consultation.messages.push({ 
        sender, 
        text, 
        timestamp: new Date() 
      });
      await consultation.save();
      
      // إرسال الرسالة للمريض
      socket.to(`patient_${consultation.patientId}`).emit('new_message', {
        consultationId,
        message: {
          sender,
          text,
          timestamp: new Date()
        }
      });
      
      // إرسال الرسالة للأدمن
      socket.to('admin_room').emit('new_message', {
        consultationId,
        message: {
          sender,
          text,
          timestamp: new Date()
        }
      });
      
      socket.emit('message_sent', { success: true });
      
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'حدث خطأ أثناء إرسال الرسالة' });
    }
  });
  
  // استقبال طلب بدء استشارة جديدة
  socket.on('start_consultation', async (data) => {
    try {
      const { subject, message } = data;
      
      const Consultation = require('./models/Consultation');
      const consultation = new Consultation({
        patientId: socket.userId,
        subject,
        messages: [{ 
          sender: 'patient', 
          text: message, 
          timestamp: new Date() 
        }]
      });
      
      await consultation.save();
      
      // إرسال إشعار للأدمن
      socket.to('admin_room').emit('new_consultation', {
        consultation: {
          _id: consultation._id,
          subject,
          patientId: socket.userId,
          createdAt: consultation.createdAt
        }
      });
      
      socket.emit('consultation_started', { 
        consultationId: consultation._id 
      });
      
    } catch (error) {
      console.error('Start consultation error:', error);
      socket.emit('error', { message: 'حدث خطأ أثناء بدء الاستشارة' });
    }
  });
  
  // قطع الاتصال
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.userId);
  });
});

// إعداد MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('📊 Database:', mongoose.connection.name);
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('⚠️  Server will run without database connection');
  console.log('💡 To fix this:');
  console.log('   1. Install MongoDB locally, or');
  console.log('   2. Use MongoDB Atlas (free cloud database)');
});

// إعداد الـ routes
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', testRoutes);
app.use('/api', consultationRoutes);
app.use('/api', patientRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', reportsRoutes);

// route للتحقق من حالة السيرفر
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// route للصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({ 
    message: 'معمل أمان للتحاليل الطبية - API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/register, /api/login, /api/profile',
      appointments: '/api/appointments',
      tests: '/api/tests, /api/test-results',
      consultations: '/api/consultations'
    }
  });
});

// معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    message: 'حدث خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// معالجة الـ routes غير الموجودة
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route غير موجود',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 WebSocket enabled on port ${PORT}`);
});

// معالجة الأخطاء غير المتوقعة
process.on('uncaughtException', function (err) {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', function (err) {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// معالجة إغلاق السيرفر
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 Database connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 Database connection closed');
    process.exit(0);
  });
});