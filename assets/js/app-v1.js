// التطبيق الرئيسي - مجدول السودان
import ScheduleManager from './schedule-manager.js';
import SudanCalendar from './sudan-calendar.js';

class MajdulSudan {
    constructor() {
        this.scheduleManager = new ScheduleManager();
        this.sudanCalendar = new SudanCalendar();
        this.currentView = 'home';
        this.currentRegion = 'الشمالية'; // الولاية الشمالية السودانية
        this.currency = 'جنيه سوداني';
        
        this.initializeApp();
    }
    
    initializeApp() {
        // تحميل جميع المكونات
        this.loadComponents();
        
        // إعداد المعالجات
        this.setupEventHandlers();
        
        // تحميل البيانات
        this.loadData();
        
        // تحديث الواجهة
        this.updateUI();
        
        // إعداد PWA
        this.setupPWA();
        
        console.log('✅ تطبيق مجدول السودان جاهز للعمل في الولاية الشمالية');
    }
    
    loadComponents() {
        // تحميل الهيدر
        document.getElementById('header').innerHTML = this.renderHeader();
        
        // تحميل الإحصائيات
        document.getElementById('stats-section').innerHTML = this.renderStats();
        
        // تحميل التاريخ السوداني
        document.getElementById('sudan-date-section').innerHTML = this.renderSudanDate();
        
        // تحميل نموذج الإضافة
        document.getElementById('add-schedule-section').innerHTML = this.renderAddScheduleForm();
        
        // تحميل الفصول الزراعية
        document.getElementById('sudan-seasons-section').innerHTML = this.renderSudanSeasons();
        
        // تحميل الجداول
        document.getElementById('schedules-section').innerHTML = this.renderSchedules();
        
        // تحميل زر الفلوتر
        document.getElementById('floating-btn').innerHTML = this.renderFloatingButton();
        
        // تحميل التنقل السفلي
        document.getElementById('bottom-nav').innerHTML = this.renderBottomNav();
        
        // تحميل المودالات
        document.getElementById('modals-container').innerHTML = this.renderModals();
        
        // تحميل الـ Toast
        document.getElementById('toast-container').innerHTML = this.renderToast();
    }
    
    renderHeader() {
        return `
            <header class="bg-gradient-to-l from-primary to-primary-dark text-white sticky top-0 z-50 shadow-lg">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <div class="bg-white p-2 rounded-full">
                                <i class="fas fa-tractor text-primary text-xl"></i>
                            </div>
                            <div>
                                <h1 class="text-xl font-bold">مجدول السودان</h1>
                                <p class="text-sm text-white/80">الولاية الشمالية - الجرار الزراعي</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-4 space-x-reverse">
                            <button id="region-toggle" class="px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-all">
                                <i class="fas fa-map-marker-alt ml-1"></i>
                                الشمالية
                            </button>
                            <button id="theme-toggle" class="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all">
                                <i class="fas fa-moon"></i>
                            </button>
                            <button id="install-btn" class="hidden px-3 py-1 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-all">
                                <i class="fas fa-download ml-1"></i>
                                تثبيت
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }
    
    renderStats() {
        const stats = this.scheduleManager.getStats();
        
        return `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <!-- إجمالي الساعات -->
                <div class="sudan-card p-5">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">إجمالي الساعات</p>
                            <h3 class="text-2xl font-bold text-gray-800 mt-1">${stats.totalHours}</h3>
                        </div>
                        <div class="bg-primary/10 p-3 rounded-full">
                            <i class="fas fa-clock text-primary text-xl"></i>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">مجموع ساعات العمل</p>
                </div>
                
                <!-- عدد الزبائن -->
                <div class="sudan-card p-5">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">عدد الزبائن</p>
                            <h3 class="text-2xl font-bold text-gray-800 mt-1">${stats.totalCustomers}</h3>
                        </div>
                        <div class="bg-sudan/10 p-3 rounded-full">
                            <i class="fas fa-users text-sudan text-xl"></i>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">العملاء المضافين</p>
                </div>
                
                <!-- ساعات اليوم -->
                <div class="sudan-card p-5">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">ساعات اليوم</p>
                            <h3 class="text-2xl font-bold text-gray-800 mt-1">${stats.todayHours}</h3>
                        </div>
                        <div class="bg-secondary/10 p-3 rounded-full">
                            <i class="fas fa-calendar-day text-secondary text-xl"></i>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">لليوم الحالي</p>
                </div>
                
                <!-- الإيرادات -->
                <div class="sudan-card p-5">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">الإيرادات</p>
                            <h3 class="text-2xl font-bold text-gray-800 mt-1">${this.formatCurrency(stats.totalEarnings)}</h3>
                        </div>
                        <div class="bg-accent/10 p-3 rounded-full">
                            <i class="fas fa-money-bill-wave text-accent text-xl"></i>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">بالجنيه السوداني</p>
                </div>
            </div>
        `;
    }
    
    renderSudanDate() {
        const today = new Date();
        const hijri = this.sudanCalendar.getHijriDate(today);
        const sudanSeason = this.sudanCalendar.getCurrentSeason();
        
        return `
            <div class="bg-gradient-to-l from-green-100 to-amber-50 border-r-4 border-primary rounded-xl p-4 mb-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <div class="bg-white p-2 rounded-lg shadow">
                            <i class="fas fa-calendar-alt text-primary text-xl"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-bold text-gray-800" id="current-date">
                                ${this.sudanCalendar.formatDate(today, 'full')}
                            </h2>
                            <div class="flex items-center space-x-3 space-x-reverse mt-1">
                                <span class="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                                    <i class="fas fa-moon ml-1"></i>
                                    ${hijri.day} ${hijri.monthName} ${hijri.year} هـ
                                </span>
                                <span class="text-sm bg-secondary/10 text-secondary px-2 py-1 rounded">
                                    <i class="fas fa-sun ml-1"></i>
                                    ${sudanSeason.name}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex space-x-2 space-x-reverse">
                        <button id="today-btn" class="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all">
                            اليوم
                        </button>
                        <button id="season-info-btn" class="px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all">
                            <i class="fas fa-info-circle ml-1"></i>
                            معلومات الموسم
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAddScheduleForm() {
        return `
            <div class="sudan-card overflow-hidden mb-8">
                <div class="bg-gradient-to-l from-primary to-primary-dark p-5">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <i class="fas fa-plus-circle text-white text-2xl"></i>
                        <h2 class="text-xl font-bold text-white">إضافة جدول عمل جديد</h2>
                    </div>
                </div>
                
                <form id="schedule-form" class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- اسم الزبون -->
                        <div>
                            <label for="customer-name" class="block text-gray-700 font-medium mb-2">
                                <i class="fas fa-user text-primary ml-1"></i>
                                اسم الزبون
                            </label>
                            <input type="text" id="customer-name" required
                                   class="sudan-input w-full p-4 pr-12"
                                   placeholder="أدخل اسم الزبون">
                        </div>
                        
                        <!-- رقم الهاتف -->
                        <div>
                            <label for="phone" class="block text-gray-700 font-medium mb-2">
                                <i class="fas fa-phone text-primary ml-1"></i>
                                رقم الهاتف
                            </label>
                            <input type="tel" id="phone" required
                                   class="sudan-input w-full p-4 pr-12"
                                   placeholder="مثال: 0912345678">
                        </div>
                        
                        <!-- الموقع -->
                        <div>
                            <label for="location" class="block text-gray-700 font-medium mb-2">
                                <i class="fas fa-map-marker-alt text-primary ml-1"></i>
                                الموقع (القرية/المزرعة)
                            </label>
                            <input type="text" id="location"
                                   class="sudan-input w-full p-4 pr-12"
                                   placeholder="مثال: قرية المقرن">
                        </div>
                        
                        <!-- نوع العمل -->
                        <div>
                            <label for="work-type" class="block text-gray-700 font-medium mb-2">
                                <i class="fas fa-tasks text-primary ml-1"></i>
                                نوع العمل
                            </label>
                            <select id="work-type" class="sudan-input w-full p-4">
                                <option value="حراثة">حراثة</option>
                                <option value="زراعة">زراعة</option>
                                <option value="ري">ري</option>
                                <option value="حصاد">حصاد</option>
                                <option value="نقل">نقل</option>
                                <option value="أخرى">أخرى</option>
                            </select>
                        </div>
                        
                        <!-- التاريخ -->
                        <div>
                            <label for="date" class="block text-gray-700 font-medium mb-2">
                                <i class="fas fa-calendar text-primary ml-1"></i>
                                التاريخ
                            </label>
                            <input type="date" id="date" required
                                   class="sudan-input w-full p-4">
                        </div>
                        
                        <!-- عدد الساعات -->
                        <div>
                            <label for="hours" class="block text-gray-700 font-medium mb-2">
                                <i class="fas fa-clock text-primary ml-1"></i>
                                عدد الساعات
                            </label>
                            <div class="relative">
                                <input type="number" id="hours" min="1" max="24" required
                                       class="sudan-input w-full p-4 pr-16"
                                       placeholder="عدد الساعات">
                                <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">ساعة</span>
                            </div>
                        </div>
                        
                        <!-- السعر للساعة -->
                        <div>
                            <label for="hourly-rate" class="block text-gray-700 font-medium mb-2">
                                <i class="fas fa-money-bill-wave text-primary ml-1"></i>
                                السعر للساعة (جنيه)
                            </label>
                            <div class="relative">
                                <input type="number" id="hourly-rate" min="1000" step="500"
                                       class="sudan-input w-full p-4 pr-16"
                                       placeholder="مثال: 5000"
                                       value="5000">
                                <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">ج.س</span>
                            </div>
                        </div>
                        
                        <!-- حالة الدفع -->
                        <div>
                            <label for="payment-status" class="block text-gray-700 font-medium mb-2">
                                <i class="fas fa-cash-register text-primary ml-1"></i>
                                حالة الدفع
                            </label>
                            <select id="payment-status" class="sudan-input w-full p-4">
                                <option value="مدفوع">مدفوع</option>
                                <option value="آجل">آجل</option>
                                <option value="جزئي">جزئي</option>
                            </select>
                        </div>
                        
                        <!-- ملاحظات -->
                        <div class="md:col-span-2">
                            <label for="notes" class="block text-gray-700 font-medium mb-2">
                                <i class="fas fa-sticky-note text-primary ml-1"></i>
                                ملاحظات (اختياري)
                            </label>
                            <textarea id="notes" rows="2"
                                      class="sudan-input w-full p-4"
                                      placeholder="أي ملاحظات إضافية أو تفاصيل عن العمل"></textarea>
                        </div>
                    </div>
                    
                    <!-- أزرار النموذج -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-end">
                        <button type="reset" class="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">
                            <i class="fas fa-redo ml-2"></i>
                            إعادة تعيين
                        </button>
                        <button type="submit" class="sudan-btn px-6 py-3 flex items-center justify-center">
                            <i class="fas fa-save ml-2"></i>
                            حفظ الجدول
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
    
    renderSudanSeasons() {
        const seasons = this.sudanCalendar.getSudanSeasons();
        const currentSeason = this.sudanCalendar.getCurrentSeason();
        
        return `
            <div class="sudan-card overflow-hidden mb-8">
                <div class="bg-gradient-to-l from-accent to-accent-light p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <i class="fas fa-seedling text-white text-2xl"></i>
                            <h2 class="text-xl font-bold text-white">الفصول الزراعية السودانية</h2>
                        </div>
                        <span class="bg-white/20 px-3 py-1 rounded-full text-white text-sm">
                            ${currentSeason.name}
                        </span>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        ${seasons.map(season => `
                            <div class="season-card p-4 rounded-xl border-2 ${season.id === currentSeason.id ? 'border-secondary bg-yellow-50' : 'border-gray-200'}">
                                <div class="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 class="font-bold text-gray-800">${season.name}</h3>
                                        <p class="text-sm text-gray-600 mt-1">${season.period}</p>
                                    </div>
                                    <div class="p-2 rounded-lg ${season.color}">
                                        <i class="${season.icon} text-white"></i>
                                    </div>
                                </div>
                                
                                <div class="space-y-2">
                                    ${season.activities.map(activity => `
                                        <div class="flex items-center text-sm">
                                            <i class="fas fa-check-circle text-green-500 ml-2"></i>
                                            <span>${activity}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                ${season.id === currentSeason.id ? `
                                    <div class="mt-4 pt-3 border-t border-yellow-200">
                                        <div class="text-sm text-gray-700">
                                            <i class="fas fa-info-circle text-secondary ml-1"></i>
                                            ${season.recommendation}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- مصطلحات سودانية -->
                    <div class="mt-8 pt-6 border-t border-gray-200">
                        <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                            <i class="fas fa-language text-primary ml-2"></i>
                            مصطلحات سودانية زراعية
                        </h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div class="bg-blue-50 p-3 rounded-lg">
                                <div class="font-medium text-blue-800">البوّاعة الصيفية</div>
                                <div class="text-sm text-blue-600">الزراعة الصيفية المبكرة</div>
                            </div>
                            <div class="bg-green-50 p-3 rounded-lg">
                                <div class="font-medium text-green-800">الدّربة</div>
                                <div class="text-sm text-green-600">المساحة الزراعية</div>
                            </div>
                            <div class="bg-amber-50 p-3 rounded-lg">
                                <div class="font-medium text-amber-800">القرّية</div>
                                <div class="text-sm text-amber-600">القرية/المزرعة</div>
                            </div>
                            <div class="bg-red-50 p-3 rounded-lg">
                                <div class="font-medium text-red-800">الشّيل</div>
                                <div class="text-sm text-red-600">النقل الزراعي</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSchedules() {
        const schedules = this.scheduleManager.getAllSchedules();
        
        return `
            <div class="sudan-card overflow-hidden">
                <div class="bg-gradient-to-l from-sudan to-red-700 p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <i class="fas fa-list text-white text-2xl"></i>
                            <h2 class="text-xl font-bold text-white">جدول العمل</h2>
                        </div>
                        <div class="bg-white/20 px-3 py-1 rounded-full">
                            <span class="text-white font-semibold">${schedules.length} جدول</span>
                        </div>
                    </div>
                </div>
                
                <!-- أدوات التصفية -->
                <div class="p-4 border-b border-gray-200">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex flex-wrap gap-2">
                            <button class="filter-btn px-4 py-2 bg-primary text-white rounded-lg" data-filter="all">
                                الكل
                            </button>
                            <button class="filter-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300" data-filter="today">
                                اليوم
                            </button>
                            <button class="filter-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300" data-filter="unpaid">
                                غير مدفوعة
                            </button>
                            <button class="filter-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300" data-filter="this-week">
                                هذا الأسبوع
                            </button>
                        </div>
                        
                        <div class="relative w-full md:w-64">
                            <input type="text" id="search-schedules" 
                                   class="sudan-input w-full p-3 pr-10"
                                   placeholder="بحث عن زبون أو موقع...">
                            <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>
                </div>
                
                <!-- قائمة الجداول -->
                <div class="p-4" id="schedules-list-container">
                    ${this.renderSchedulesList(schedules)}
                </div>
            </div>
        `;
    }
    
    renderSchedulesList(schedules) {
        if (schedules.length === 0) {
            return `
                <div class="text-center py-12">
                    <div class="mb-4">
                        <i class="fas fa-calendar-plus text-gray-300 text-6xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-500 mb-2">مافي جدول مضاف</h3>
                    <p class="text-gray-400">ابدأ بإضافة أول جدول عمل</p>
                </div>
            `;
        }
        
        // ترتيب الجداول حسب التاريخ (الأحدث أولاً)
        const sortedSchedules = [...schedules].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        return `
            <div class="space-y-4">
                ${sortedSchedules.map(schedule => `
                    <div class="schedule-item sudan-card p-4 cursor-pointer hover:shadow-md transition-all"
                         data-id="${schedule.id}"
                         onclick="app.showScheduleDetails(${schedule.id})">
                        
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <!-- المعلومات الرئيسية -->
                            <div class="flex-1">
                                <div class="flex items-center flex-wrap gap-2 mb-3">
                                    <h3 class="text-lg font-bold text-gray-800">${schedule.customerName}</h3>
                                    
                                    <span class="px-2 py-1 text-xs font-semibold rounded 
                                                ${schedule.paymentStatus === 'مدفوع' ? 'bg-green-100 text-green-800' : 
                                                  schedule.paymentStatus === 'آجل' ? 'bg-red-100 text-red-800' : 
                                                  'bg-yellow-100 text-yellow-800'}">
                                        ${schedule.paymentStatus}
                                    </span>
                                    
                                    <span class="px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                                        ${schedule.workType}
                                    </span>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                                    <div class="flex items-center">
                                        <i class="fas fa-phone text-primary ml-2"></i>
                                        <span>${schedule.phone}</span>
                                    </div>
                                    
                                    <div class="flex items-center">
                                        <i class="fas fa-map-marker-alt text-accent ml-2"></i>
                                        <span>${schedule.location || 'غير محدد'}</span>
                                    </div>
                                    
                                    <div class="flex items-center">
                                        <i class="fas fa-calendar text-secondary ml-2"></i>
                                        <span>${this.sudanCalendar.formatDate(new Date(schedule.date), 'short')}</span>
                                    </div>
                                </div>
                                
                                ${schedule.notes ? `
                                    <div class="mt-3 p-2 bg-gray-50 rounded-lg text-sm">
                                        <i class="fas fa-sticky-note text-gray-400 ml-2"></i>
                                        ${schedule.notes}
                                    </div>
                                ` : ''}
                            </div>
                            
                            <!-- الساعات والسعر -->
                            <div class="flex flex-col items-end">
                                <div class="text-right mb-2">
                                    <div class="text-2xl font-bold text-primary">${schedule.hours} ساعة</div>
                                    <div class="text-lg font-semibold text-gray-800">
                                        ${this.formatCurrency(schedule.totalAmount)}
                                    </div>
                                </div>
                                
                                <div class="flex space-x-2 space-x-reverse">
                                    <button class="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
                                            onclick="event.stopPropagation(); app.callCustomer('${schedule.phone}')"
                                            title="اتصال">
                                        <i class="fas fa-phone"></i>
                                    </button>
                                    <button class="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                                            onclick="event.stopPropagation(); app.markAsPaid(${schedule.id})"
                                            title="تسديد">
                                        <i class="fas fa-money-check-alt"></i>
                                    </button>
                                    <button class="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                                            onclick="event.stopPropagation(); app.deleteSchedule(${schedule.id})"
                                            title="حذف">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderFloatingButton() {
        return `
            <button id="quick-add-btn" 
                    class="floating-btn fixed bottom-24 left-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-primary-dark transition-all z-40">
                <i class="fas fa-plus"></i>
            </button>
        `;
    }
    
    renderBottomNav() {
        return `
            <nav class="sudan-nav fixed bottom-0 w-full py-3 px-2 z-40">
                <div class="flex justify-around items-center">
                    <button class="sudan-nav-btn ${this.currentView === 'home' ? 'active' : ''}" data-view="home">
                        <i class="fas fa-home text-xl mb-1"></i>
                        <span class="text-xs font-medium">الرئيسية</span>
                    </button>
                    
                    <button class="sudan-nav-btn ${this.currentView === 'calendar' ? 'active' : ''}" data-view="calendar">
                        <i class="fas fa-calendar-alt text-xl mb-1"></i>
                        <span class="text-xs font-medium">التقويم</span>
                    </button>
                    
                    <button class="sudan-nav-btn ${this.currentView === 'reports' ? 'active' : ''}" data-view="reports">
                        <i class="fas fa-chart-bar text-xl mb-1"></i>
                        <span class="text-xs font-medium">تقارير</span>
                    </button>
                    
                    <button class="sudan-nav-btn ${this.currentView === 'customers' ? 'active' : ''}" data-view="customers">
                        <i class="fas fa-users text-xl mb-1"></i>
                        <span class="text-xs font-medium">الزبائن</span>
                    </button>
                </div>
            </nav>
        `;
    }
    
    renderModals() {
        return `
            <!-- مودال تفاصيل الجدول -->
            <div id="schedule-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 hidden">
                <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div class="bg-primary p-5 flex justify-between items-center sticky top-0">
                        <h3 class="text-xl font-bold text-white">تفاصيل الجدول</h3>
                        <button id="close-modal" class="text-white text-2xl hover:text-gray-200">&times;</button>
                    </div>
                    <div class="p-6" id="modal-content"></div>
                </div>
            </div>
            
            <!-- مودال الموسم الزراعي -->
            <div id="season-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 hidden">
                <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div class="bg-accent p-5 flex justify-between items-center sticky top-0">
                        <h3 class="text-xl font-bold text-white">معلومات الموسم الزراعي</h3>
                        <button id="close-season-modal" class="text-white text-2xl hover:text-gray-200">&times;</button>
                    </div>
                    <div class="p-6" id="season-modal-content"></div>
                </div>
            </div>
        `;
    }
    
    renderToast() {
        return `
            <div id="toast" class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 opacity-0 -translate-y-10">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <i class="fas fa-check-circle"></i>
                    <span id="toast-message">تمت العملية بنجاح</span>
                </div>
            </div>
        `;
    }
    
    setupEventHandlers() {
        // سيكون هذا في جزء لاحق
    }
    
    formatCurrency(amount) {
        // تنسيق العملة السودانية
        return new Intl.NumberFormat('ar-SD', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' ج.س';
    }
    
    // ... المزيد من الدوال
}

// إنشاء التطبيق ككائن عام
window.app = new MajdulSudan(); 
