// Service Worker المحسّن
const CACHE_NAME = 'majdul-sudan-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  console.log('📦 Service Worker: يتم التثبيت...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ تم فتح الكاش');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ تم تخزين جميع الملفات الأساسية');
        return self.skipWaiting();
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: تم التفعيل');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ حذف الكاش القديم: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// معالجة طلبات الشبكة
self.addEventListener('fetch', event => {
  // تجاهل طلبات غير GET
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان الملف في الكاش
        if (response) {
          console.log(`📁 تقديم من الكاش: ${event.request.url}`);
          return response;
        }
        
        // إذا لم يكن في الكاش، جلب من الشبكة
        console.log(`🌐 جلب من الشبكة: ${event.request.url}`);
        
        return fetch(event.request)
          .then(networkResponse => {
            // تخزين في الكاش للمرة القادمة
            if (event.request.url.startsWith('http') && networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            
            return networkResponse;
          })
          .catch(error => {
            console.log('❌ خطأ في الشبكة:', error);
            
            // إذا كان طلب صفحة رئيسية وعطلت الشبكة
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html')
                .then(cachedResponse => cachedResponse || this.offlineResponse());
            }
            
            return this.offlineResponse();
          });
      })
  );
});

// صفحة عدم الاتصال
self.offlineResponse = function() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>مجدول السودان - غير متصل</title>
        <style>
            body {
                font-family: 'Cairo', sans-serif;
                background: linear-gradient(135deg, #1a4d2e 0%, #0d3b1e 100%);
                color: white;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 20px;
            }
            .icon {
                font-size: 4rem;
                margin-bottom: 20px;
                color: #d4af37;
            }
            h1 {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            p {
                font-size: 1.2rem;
                margin-bottom: 30px;
                max-width: 500px;
            }
            .tip {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 10px;
                margin-top: 20px;
                max-width: 500px;
            }
        </style>
    </head>
    <body>
        <div class="icon">📶</div>
        <h1>لا يوجد اتصال بالإنترنت</h1>
        <p>التطبيق يعمل في وضع عدم الاتصال. يمكنك الاستمرار في إضافة وعرض الجداول.</p>
        <div class="tip">
            <strong>نصيحة:</strong> البيانات التي تضيفها يتم حفظها محلياً وتزامنها عند عودة الاتصال.
        </div>
    </body>
    </html>
  `, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
};

// معالجة رسائل التحديث
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
