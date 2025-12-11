// Service Worker لتطبيق مجدول السودان
const CACHE_NAME = 'majdul-sudan-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  '/assets/css/main.css',
  '/assets/css/utils.css',
  '/assets/js/app.js',
  '/assets/js/schedule-manager.js',
  '/assets/js/sudan-calendar.js',
  '/assets/js/hijri-converter.js',
  '/assets/js/pwa-handler.js',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  console.log('📦 Service Worker: التثبيت');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Service Worker: تم فتح الكاش');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: تمت إضافة جميع الملفات للكاش');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker: فشل التثبيت:', error);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: التفعيل');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ Service Worker: حذف الكاش القديم: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker: أصبح جاهزاً للعمل');
      return self.clients.claim();
    })
  );
});

// معالجة طلبات الشبكة
self.addEventListener('fetch', event => {
  // تجاهل طلبات POST وطلبات البيانات
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان الملف موجوداً في الكاش
        if (response) {
          console.log(`📁 Service Worker: تقديم من الكاش: ${event.request.url}`);
          return response;
        }
        
        // إذا لم يكن في الكاش، حمله من الشبكة
        console.log(`🌐 Service Worker: تحميل من الشبكة: ${event.request.url}`);
        
        return fetch(event.request)
          .then(networkResponse => {
            // نسخة من الاستجابة للتخزين في الكاش
            const responseToCache = networkResponse.clone();
            
            // فتح الكاش وإضافة الاستجابة الجديدة
            caches.open(CACHE_NAME)
              .then(cache => {
                // لا تخزن طلبات من مصادر خارجية غير الأساسية
                if (event.request.url.startsWith('http')) {
                  cache.put(event.request, responseToCache);
                  console.log(`💾 Service Worker: تم تخزين في الكاش: ${event.request.url}`);
                }
              })
              .catch(error => {
                console.error('❌ Service Worker: خطأ في تخزين الكاش:', error);
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.error('❌ Service Worker: خطأ في جلب الملف:', error);
            
            // إذا كان الملف أساسياً وعطلت الشبكة، عرض رسالة
            if (event.request.mode === 'navigate') {
              return caches.match('/')
                .then(cachedResponse => cachedResponse || new Response('عذراً، لا يوجد اتصال بالإنترنت', {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: new Headers({
                    'Content-Type': 'text/html; charset=utf-8'
                  })
                }));
            }
            
            return new Response('عذراً، لا يمكن تحميل الملف', {
              status: 408,
              statusText: 'Network Error'
            });
          });
      })
  );
});

// معالجة رسائل push
self.addEventListener('push', event => {
  console.log('📨 Service Worker: استقبال رسالة Push');
  
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'تذكير من مجدول السودان',
    icon: '/assets/images/icon-192.png',
    badge: '/assets/images/badge.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق'
      },
      {
        action: 'dismiss',
        title: 'تجاهل'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'مجدول السودان', options)
  );
});

// معالجة نقرات الإشعارات
self.addEventListener('notificationclick', event => {
  console.log('👆 Service Worker: نقر على الإشعار');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// تحديث التطبيق تلقائياً
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
