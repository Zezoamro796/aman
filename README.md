# معمل أمان للتحاليل الطبية

## 📋 نظرة عامة

نظام إدارة شامل لمعمل التحاليل الطبية يتيح للمرضى حجز المواعيد ومتابعة نتائج التحاليل، وللمديرين إدارة المواعيد والتحاليل والاستشارات الطبية.

## 🚀 المميزات

### للمرضى
- ✅ تسجيل حساب جديد وتسجيل الدخول
- ✅ حجز مواعيد للتحاليل الطبية
- ✅ متابعة حالة المواعيد
- ✅ تحميل نتائج التحاليل
- ✅ إرسال استشارات طبية
- ✅ الدردشة المباشرة مع الطاقم الطبي

### للمديرين
- ✅ لوحة تحكم شاملة
- ✅ إدارة المواعيد (تأكيد، إلغاء، تعديل)
- ✅ رفع نتائج التحاليل
- ✅ إدارة الاستشارات الطبية
- ✅ إحصائيات مفصلة
- ✅ إرسال رسائل SMS للمرضى

## 🛠️ التقنيات المستخدمة

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- تصميم متجاوب (Responsive Design)
- واجهة مستخدم عربية سهلة الاستخدام

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT للمصادقة
- bcrypt لتشفير كلمات المرور

## 📁 هيكل المشروع

```
lab-management-system/
├── index.html              # الواجهة الرئيسية
├── backend/                # ملفات الباكند
│   ├── server.js           # السيرفر الرئيسي
│   ├── package.json        # تبعيات المشروع
│   ├── .env               # متغيرات البيئة
│   ├── models/            # نماذج قاعدة البيانات
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   ├── Test.js
│   │   ├── TestResult.js
│   │   └── Consultation.js
│   ├── routes/            # مسارات API
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   ├── tests.js
│   │   └── consultations.js
│   ├── createAdmin.js     # إنشاء مستخدم مدير
│   ├── seedData.js        # بيانات تجريبية
│   └── README.md          # دليل الباكند
└── README.md              # هذا الملف
```

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js (الإصدار 14 أو أحدث)
- MongoDB Atlas (أو MongoDB محلي)
- متصفح ويب حديث

### خطوات التثبيت

1. **استنساخ المشروع**
   ```bash
   git clone <repository-url>
   cd lab-management-system
   ```

2. **إعداد الباكند**
   ```bash
   cd backend
   npm install
   ```

3. **إعداد قاعدة البيانات**
   - إنشاء حساب على MongoDB Atlas
   - إنشاء cluster جديد
   - الحصول على connection string
   - تعديل ملف `.env` في مجلد backend

4. **إعداد ملف البيئة**
   ```env
   MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/lab_management?retryWrites=true&w=majority
   PORT=3000
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ```

5. **إنشاء مستخدم مدير**
   ```bash
   node createAdmin.js
   ```

6. **إضافة بيانات تجريبية (اختياري)**
   ```bash
   node seedData.js
   ```

7. **تشغيل السيرفر**
   ```bash
   npm start
   # أو للتطوير
   npm run dev
   ```

8. **فتح التطبيق**
   - افتح `index.html` في المتصفح
   - أو استخدم live server في VS Code

## 👤 المستخدم الافتراضي

بعد تشغيل `createAdmin.js`، يمكنك تسجيل الدخول كمدير باستخدام:
- **البريد الإلكتروني**: admin@amanlab.com
- **رقم الهاتف**: 0123456789
- **كلمة المرور**: admin123

⚠️ **تحذير**: قم بتغيير كلمة المرور بعد أول تسجيل دخول!

## 📡 API Endpoints

### المصادقة
- `POST /api/register` - تسجيل مستخدم جديد
- `POST /api/login` - تسجيل الدخول
- `GET /api/profile` - معلومات المستخدم

### المواعيد
- `POST /api/appointments` - إنشاء موعد جديد
- `GET /api/appointments` - جلب المواعيد
- `PATCH /api/appointments/:id/status` - تحديث حالة الموعد
- `DELETE /api/appointments/:id` - حذف موعد
- `GET /api/appointments/stats` - إحصائيات المواعيد

### التحاليل
- `GET /api/tests` - جلب التحاليل المتاحة
- `POST /api/test-results` - رفع نتيجة تحليل
- `GET /api/test-results` - جلب نتائج التحاليل

### الاستشارات
- `POST /api/consultations` - إنشاء استشارة جديدة
- `GET /api/consultations` - جلب الاستشارات
- `POST /api/consultations/:id/reply` - الرد على استشارة

## 🔐 الأمان

- جميع الـ endpoints (ما عدا التسجيل وتسجيل الدخول) تتطلب JWT token
- كلمات المرور مشفرة باستخدام bcrypt
- التحقق من الصلاحيات للمديرين
- حماية من CORS

## 📊 قاعدة البيانات

### النماذج
- **User**: المستخدمين (مرضى ومديرين)
- **Appointment**: المواعيد
- **Test**: التحاليل المتاحة
- **TestResult**: نتائج التحاليل
- **Consultation**: الاستشارات الطبية

## 🎨 التصميم

- تصميم عصري وأنيق
- ألوان هادئة ومناسبة للمجال الطبي
- واجهة سهلة الاستخدام
- متجاوب مع جميع الأجهزة
- دعم كامل للغة العربية

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

1. **السيرفر لا يعمل**
   - تأكد من تثبيت Node.js
   - تأكد من تشغيل `npm install`
   - تحقق من صحة ملف `.env`

2. **مشاكل قاعدة البيانات**
   - تحقق من صحة MONGO_URI
   - تأكد من إعدادات Network Access في MongoDB Atlas
   - تحقق من صحة اسم المستخدم وكلمة المرور

3. **مشاكل CORS**
   - تأكد من أن Frontend يعمل على المنفذ الصحيح
   - تحقق من إعدادات CORS في server.js

4. **مشاكل JWT**
   - تأكد من وجود JWT_SECRET في ملف .env
   - تأكد من إرسال Token في header Authorization

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء branch جديد للميزة
3. Commit التغييرات
4. Push إلى Branch
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

للدعم الفني أو الاستفسارات:
- البريد الإلكتروني: support@amanlab.com
- الهاتف: +20 123 456 789

---

**معمل أمان للتحاليل الطبية** - نظام إدارة شامل ومتطور 🏥 