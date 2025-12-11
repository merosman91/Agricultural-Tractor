// تطبيق مجدول السودان - ملف JavaScript الرئيسي

// ==================== ScheduleManager ====================
class ScheduleManager {
    constructor() {
        this.storageKey = 'majdulSudanSchedules';
        this.schedules = this.loadFromStorage();
        this.hourlyRate = 5000; // السعر الافتراضي للساعة بالجنيه السوداني
    }
    
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            return [];
        }
    }
    
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.schedules));
            return true;
        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
            return false;
        }
    }
    
    addSchedule(scheduleData) {
        const newSchedule = {
            id: Date.now(),
            ...scheduleData,
            totalAmount: scheduleData.hours * (scheduleData.hourlyRate || this.hourlyRate),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.schedules.push(newSchedule);
        this.saveToStorage();
        return newSchedule;
    }
    
    deleteSchedule(id) {
        const initialLength = this.schedules.length;
        this.schedules = this.schedules.filter(s => s.id !== id);
        
        if (this.schedules.length < initialLength) {
            this.saveToStorage();
            return true;
        }
        
        return false;
    }
    
    getSchedule(id) {
        return this.schedules.find(s => s.id === id);
    }
    
    getAllSchedules() {
        return [...this.schedules];
    }
    
    getStats() {
        const totalHours = this.schedules.reduce((sum, s) => sum + parseInt(s.hours || 0), 0);
        const totalCustomers = [...new Set(this.schedules.map(s => s.customerName))].length;
        
        const today = new Date().toISOString().split('T')[0];
        const todaySchedules = this.schedules.filter(s => s.date === today);
        const todayHours = todaySchedules.reduce((sum, s) => sum + parseInt(s.hours || 0), 0);
        
        const totalEarnings = this.schedules.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        
        return {
            totalHours,
            totalCustomers,
            todayHours,
            totalEarnings,
            scheduleCount: this.schedules.length
        };
    }
    
    updatePaymentStatus(id, status) {
        const schedule = this.getSchedule(id);
        if (schedule) {
            schedule.paymentStatus = status;
            schedule.updatedAt = new Date().toISOString();
            this.saveToStorage();
            return true;
        }
        return false;
    }
}

// ==================== SudanCalendar ====================
class SudanCalendar {
    constructor() {
        this.region = 'الشمالية';
    }
    
    getHijriDate(gregorianDate = new Date()) {
        const date = new Date(gregorianDate);
        const hijriMonths = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
            'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
            'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
        
        return {
            year: 1445,
            month: 6,
            day: date.getDate(),
            monthName: hijriMonths[5]
        };
    }
    
    getSudanSeasons() {
        return [
            {
                id: 'summer',
                name: 'الموسم الصيفي',
                localName: 'البوّاعة الصيفية',
                period: 'مايو - أغسطس',
                activities: ['زراعة الذرة', 'زراعة الدخن', 'حراثة الأرض', 'الري المنتظم'],
                recommendation: 'الفصل المناسب لزراعة المحاصيل الصيفية في الولاية الشمالية',
                icon: 'fas fa-sun',
                color: 'bg-yellow-500'
            },
            {
                id: 'winter',
                name: 'الموسم الشتوي',
                localName: 'الزراعة الشتوية',
                period: 'نوفمبر - فبراير',
                activities: ['زراعة القمح', 'زراعة الخضروات', 'تجهيز البيوت المحمية', 'مكافحة الآفات'],
                recommendation: 'أنسب وقت لزراعة القمح والحبوب الشتوية',
                icon: 'fas fa-snowflake',
                color: 'bg-blue-500'
            },
            {
                id: 'autumn',
                name: 'موسم الخريف',
                localName: 'موسم الأمطار',
                period: 'يوليو - سبتمبر',
                activities: ['حصاد المحاصيل', 'تخزين المنتجات', 'تحضير الأرض', 'صيانة المعدات'],
                recommendation: 'موسم الأمطار والحصاد، جهز معدات التخزين',
                icon: 'fas fa-cloud-rain',
                color: 'bg-green-500'
            },
            {
                id: 'spring',
                name: 'موسم الربيع',
                localName: 'موسم التزهير',
                period: 'مارس - أبريل',
                activities: ['زراعة الفواكه', 'العناية بالأشجار', 'التلقيح', 'التسميد'],
                recommendation: 'موسم ازدهار الأشجار والمحاصيل البستانية',
                icon: 'fas fa-seedling',
                color: 'bg-pink-500'
            }
        ];
    }
    
    getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        const seasons = this.getSudanSeasons();
        
        if (month >= 5 && month <= 8) {
            return seasons[0]; // صيفي
        } else if (month >= 11 || month <= 2) {
            return seasons[1]; // شتوي
        } else if (month >= 7 && month <= 9) {
            return seasons[2]; // خريف
        } else {
            return seasons[3]; // ربيع
        }
    }
    
    formatDate(date, format = 'medium') {
        const d = new Date(date);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        if (format === 'short') {
            return d.toLocaleDateString('ar-SD', {
                month: 'short',
                day: 'numeric'
            });
        } else if (format === 'medium') {
            return d.toLocaleDateString('ar-SD', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } else {
            return d.toLocaleDateString('ar-SD', options);
        }
    }
}

// ==================== MajdulSudan (التطبيق الرئيسي) ====================
class MajdulSudan {
    constructor() {
        this.scheduleManager = new ScheduleManager();
        this.sudanCalendar = new SudanCalendar();
        this.currentView = 'home';
        this.currentRegion = 'الشمالية';
        this.currency = 'جنيه سوداني';
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.renderAllComponents();
        this.setupEventHandlers();
        this.setupPWA();
        
        console.log('✅ تطبيق مجدول السودان جاهز للعمل في الولاية الشمالية');
    }
    
    renderAllComponents() {
        this.renderStats();
        this.renderSudanDate();
        this.renderAddScheduleForm();
        this.renderSudanSeasons();
        this.renderSchedules();
        this.renderFloatingButton();
        this.renderBottomNav();
        this.renderModals();
        this.renderToast();
    }
    
    renderStats() {
        const stats = this.scheduleManager.getStats();
        
        document.getElementById('stats-section').innerHTML = `
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
            
            <div class="sudan-card p-5">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">عدد الزبائن</p>
                        <h3 class="text-2xl font-bold text-gray-800 mt-1">${stats.totalCustomers}</h3>
                    </div>
                    <div class="bg-red-500/10 p-3 rounded-full">
                        <i class="fas fa-users text-red-500 text-xl"></i>
                    </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">العملاء المضافين</p>
            </div>
            
            <div class="sudan-card p-5">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">ساعات اليوم</p>
                        <h3 class="text-2xl font-bold text-gray-800 mt-1">${stats.todayHours}</h3>
                    </div>
                    <div class="bg-yellow-500/10 p-3 rounded-full">
                        <i class="fas fa-calendar-day text-yellow-500 text-xl"></i>
                    </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">لليوم الحالي</p>
            </div>
            
            <div class="sudan-card p-5">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">الإيرادات</p>
                        <h3 class="text-2xl font-bold text-gray-800 mt-1">${this.formatCurrency(stats.totalEarnings)}</h3>
                    </div>
                    <div class="bg-green-500/10 p-3 rounded-full">
                        <i class="fas fa-money-bill-wave text-green-500 text-xl"></i>
                    </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">بالجنيه السوداني</p>
            </div>
        `;
    }
    
    renderSudanDate() {
        const today = new Date();
        const hijri = this.sudanCalendar.getHijriDate(today);
        const sudanSeason = this.sudanCalendar.getCurrentSeason();
        
        document.getElementById('sudan-date-section').innerHTML = `
            <div class="bg-gradient-to-l from-green-100 to-amber-50 border-r-4 border-primary rounded-xl p-4">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <div class="bg-white p-2 rounded-lg shadow">
                            <i class="fas fa-calendar-alt text-primary text-xl"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-bold text-gray-800">
                                ${this.sudanCalendar.formatDate(today, 'full')}
                            </h2>
                            <div class="flex items-center space-x-3 space-x-reverse mt-1">
                                <span class="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                                    <i class="fas fa-moon ml-1"></i>
                                    ${hijri.day} ${hijri.monthName} ${hijri.year} هـ
                                </span>
                                <span class="text-sm bg-yellow-500/10 text-yellow-700 px-2 py-1 rounded">
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
                        <button id="season-info-btn" class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all">
                            <i class="fas fa-info-circle ml-1"></i>
                            معلومات الموسم
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAddScheduleForm() {
        const today = new Date().toISOString().split('T')[0];
        
        document.getElementById('add-schedule-section').innerHTML = `
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
                                   class="sudan-input w-full p-4"
                                   value="${today}">
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
                    </div>
                    
                    <!-- ملاحظات -->
                    <div class="mb-6">
                        <label for="notes" class="block text-gray-700 font-medium mb-2">
                            <i class="fas fa-sticky-note text-primary ml-1"></i>
                            ملاحظات (اختياري)
                        </label>
                        <textarea id="notes" rows="2"
                                  class="sudan-input w-full p-4"
                                  placeholder="أي ملاحظات إضافية أو تفاصيل عن العمل"></textarea>
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
        
        document.getElementById('sudan-seasons-section').innerHTML = `
            <div class="sudan-card overflow-hidden">
                <div class="bg-gradient-to-l from-yellow-600 to-yellow-700 p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <i class="fas fa-seedling text-white text-2xl"></i>
                            <h2 class="text-xl font-bold text-white">الفصول الزراعية السودانية</h2>
                        </div>
                        <span class="bg-white/20 px-3 py-1 rounded-full text-white text-sm">
                            ${currentSeason.localName}
                        </span>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        ${seasons.map(season => `
                            <div class="p-4 rounded-xl border-2 ${season.id === currentSeason.id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}">
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
                                            <i class="fas fa-info-circle text-yellow-600 ml-1"></i>
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
                            <div class="bg-yellow-50 p-3 rounded-lg">
                                <div class="font-medium text-yellow-800">القرّية</div>
                                <div class="text-sm text-yellow-600">القرية/المزرعة</div>
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
        
        document.getElementById('schedules-section').innerHTML = `
            <div class="sudan-card overflow-hidden mt-8">
                <div class="bg-gradient-to-l from-red-600 to-red-700 p-5">
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
        
        const sortedSchedules = [...schedules].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        return `
            <div class="space-y-4">
                ${sortedSchedules.map(schedule => `
                    <div class="schedule-item sudan-card p-4 cursor-pointer hover:shadow-md transition-all"
                         data-id="${schedule.id}">
                        
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <!-- المعلومات الرئيسية -->
                            <div class="flex-1">
                                <div class="flex items-center flex-wrap gap-2 mb-3">
                                    <h3 class="text-lg font-bold text-gray-800">${schedule.customerName}</h3>
                                    
                                    <span class="px-2 py-1 text-xs font-semibold rounded 
                                                ${schedule.paymentStatus === 'مدفوع' ? 'bg-green-100 text-green-800' : 
                                                  schedule.paymentStatus === 'آجل' ? 'bg-red-100 text-red-800' : 
                                                  'bg-yellow-100 text-yellow-800'}">
                                        ${schedule.paymentStatus || 'آجل'}
                                    </span>
                                    
                                    <span class="px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                                        ${schedule.workType || 'حراثة'}
                                    </span>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                                    <div class="flex items-center">
                                        <i class="fas fa-phone text-primary ml-2"></i>
                                        <span>${schedule.phone}</span>
                                    </div>
                                    
                                    <div class="flex items-center">
                                        <i class="fas fa-map-marker-alt text-yellow-600 ml-2"></i>
                                        <span>${schedule.location || 'غير محدد'}</span>
                                    </div>
                                    
                                    <div class="flex items-center">
                                        <i class="fas fa-calendar text-green-600 ml-2"></i>
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
                                        ${this.formatCurrency(schedule.totalAmount || 0)}
                                    </div>
                                </div>
                                
                                <div class="flex space-x-2 space-x-reverse">
                                    <button class="call-btn p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
                                            data-phone="${schedule.phone}"
                                            title="اتصال">
                                        <i class="fas fa-phone"></i>
                                    </button>
                                    <button class="paid-btn p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                                            data-id="${schedule.id}"
                                            title="تسديد">
                                        <i class="fas fa-money-check-alt"></i>
                                    </button>
                                    <button class="delete-btn p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                                            data-id="${schedule.id}"
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
        // زر الإضافة السريعة موجود بالفعل في HTML
    }
    
    renderBottomNav() {
        document.getElementById('bottom-nav').innerHTML = `
            <div class="flex justify-around items-center">
                <button class="nav-btn flex flex-col items-center text-yellow-300" data-view="home">
                    <i class="fas fa-home text-xl mb-1"></i>
                    <span class="text-xs font-medium">الرئيسية</span>
                </button>
                
                <button class="nav-btn flex flex-col items-center text-white/70" data-view="calendar">
                    <i class="fas fa-calendar-alt text-xl mb-1"></i>
                    <span class="text-xs font-medium">التقويم</span>
                </button>
                
                <button class="nav-btn flex flex-col items-center text-white/70" data-view="reports">
                    <i class="fas fa-chart-bar text-xl mb-1"></i>
                    <span class="text-xs font-medium">تقارير</span>
                </button>
                
                <button class="nav-btn flex flex-col items-center text-white/70" data-view="customers">
                    <i class="fas fa-users text-xl mb-1"></i>
                    <span class="text-xs font-medium">الزبائن</span>
                </button>
            </div>
        `;
    }
    
    renderModals() {
        document.getElementById('modals-container').innerHTML = `
            <!-- مودال تفاصيل الجدول -->
            <div id="schedule-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 hidden">
                <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div class="bg-primary p-5 flex justify-between items-center">
                        <h3 class="text-xl font-bold text-white">تفاصيل الجدول</h3>
                        <button id="close-modal" class="text-white text-2xl hover:text-gray-200">&times;</button>
                    </div>
                    <div class="p-6" id="modal-content"></div>
                </div>
            </div>
        `;
    }
    
    renderToast() {
        document.getElementById('toast-container').innerHTML = `
            <div id="toast" class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 opacity-0 -translate-y-10">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <i class="fas fa-check-circle"></i>
                    <span id="toast-message">تمت العملية بنجاح</span>
                </div>
            </div>
        `;
    }
    
    setupEventHandlers() {
        // نموذج إضافة جدول
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'schedule-form') {
                e.preventDefault();
                this.handleAddSchedule();
            }
        });
        
        // زر اليوم
        document.addEventListener('click', (e) => {
            if (e.target.id === 'today-btn' || e.target.closest('#today-btn')) {
                document.getElementById('date').value = new Date().toISOString().split('T')[0];
            }
            
            // زر الإضافة السريعة
            if (e.target.id === 'quick-add-btn' || e.target.closest('#quick-add-btn')) {
                document.getElementById('customer-name').focus();
                window.scrollTo({
                    top: document.getElementById('schedule-form').offsetTop - 100,
                    behavior: 'smooth'
                });
            }
            
            // أزرار الاتصال
            if (e.target.classList.contains('call-btn') || e.target.closest('.call-btn')) {
                const phone = e.target.closest('.call-btn').dataset.phone;
                this.callCustomer(phone);
            }
            
            // أزرار التسديد
            if (e.target.classList.contains('paid-btn') || e.target.closest('.paid-btn')) {
                const id = parseInt(e.target.closest('.paid-btn').dataset.id);
                this.markAsPaid(id);
            }
            
            // أزرار الحذف
            if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                const id = parseInt(e.target.closest('.delete-btn').dataset.id);
                this.deleteSchedule(id);
            }
            
            // أزرار التنقل
            if (e.target.classList.contains('nav-btn') || e.target.closest('.nav-btn')) {
                const btn = e.target.closest('.nav-btn');
                const view = btn.dataset.view;
                this.switchView(view);
            }
            
            // زر معلومات الموسم
            if (e.target.id === 'season-info-btn' || e.target.closest('#season-info-btn')) {
                this.showSeasonInfo();
            }
        });
        
        // البحث في الجداول
        document.addEventListener('input', (e) => {
            if (e.target.id === 'search-schedules') {
                this.searchSchedules(e.target.value);
            }
        });
        
        // إغلاق المودال
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-modal' || e.target.closest('#close-modal')) {
                document.getElementById('schedule-modal').classList.add('hidden');
            }
            
            if (e.target.id === 'schedule-modal') {
                document.getElementById('schedule-modal').classList.add('hidden');
            }
        });
        // إضافة زر التقويم في النافبار
renderCalendarButton() {
    const today = new Date();
    const monthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    return `
        <button id="calendar-view-btn" class="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-white/20 rounded-lg">
            <span>${monthNames[today.getMonth()]} ${today.getFullYear()}</span>
            <i class="fas fa-calendar"></i>
        </button>
    `;
}

showCalendarView() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const monthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let calendarHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-800">${monthNames[month]} ${year}</h3>
                <button onclick="app.showTodaySchedule()" class="px-4 py-2 bg-primary text-white rounded-lg">
                    اليوم
                </button>
            </div>
            
            <div class="grid grid-cols-7 gap-1 mb-2">
                <div class="text-center font-bold text-red-600">أح</div>
                <div class="text-center font-bold">إث</div>
                <div class="text-center font-bold">ث</div>
                <div class="text-center font-bold">أر</div>
                <div class="text-center font-bold">خ</div>
                <div class="text-center font-bold">ج</div>
                <div class="text-center font-bold text-green-600">س</div>
            </div>
            
            <div class="grid grid-cols-7 gap-1">
    `;
    
    // أيام فارغة قبل بداية الشهر
    for (let i = 0; i < firstDay.getDay(); i++) {
        calendarHTML += `<div class="h-10"></div>`;
    }
    
    // أيام الشهر
    const schedules = this.scheduleManager.getAllSchedules();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const daySchedules = schedules.filter(s => s.date === dateStr);
        const hasSchedules = daySchedules.length > 0;
        const isToday = day === today.getDate() && month === today.getMonth();
        
        calendarHTML += `
            <div class="h-10 flex items-center justify-center cursor-pointer 
                       ${isToday ? 'bg-primary text-white rounded-full' : ''}
                       ${hasSchedules ? 'relative' : ''}"
                 onclick="app.showDaySchedule('${dateStr}')">
                ${day}
                ${hasSchedules ? `
                    <div class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                ` : ''}
            </div>
        `;
    }
    
    calendarHTML += `
            </div>
            
            <div class="mt-6">
                <h4 class="font-bold text-gray-700 mb-3">إجماليات الشهر:</h4>
                <div class="grid grid-cols-3 gap-4">
                    <div class="text-center p-3 bg-blue-50 rounded-lg">
                        <div class="text-lg font-bold text-blue-700">${this.getMonthSchedules(month).length}</div>
                        <div class="text-sm text-blue-600">عدد الجداول</div>
                    </div>
                    <div class="text-center p-3 bg-green-50 rounded-lg">
                        <div class="text-lg font-bold text-green-700">${this.getMonthHours(month)}</div>
                        <div class="text-sm text-green-600">إجمالي الساعات</div>
                    </div>
                    <div class="text-center p-3 bg-yellow-50 rounded-lg">
                        <div class="text-lg font-bold text-yellow-700">${this.formatCurrency(this.getMonthEarnings(month))}</div>
                        <div class="text-sm text-yellow-600">الإيرادات</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-content').innerHTML = calendarHTML;
    document.getElementById('schedule-modal').classList.remove('hidden');
}

getMonthSchedules(month) {
    const schedules = this.scheduleManager.getAllSchedules();
    const year = new Date().getFullYear();
    
    return schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getMonth() === month && scheduleDate.getFullYear() === year;
    });
}

getMonthHours(month) {
    const monthSchedules = this.getMonthSchedules(month);
    return monthSchedules.reduce((sum, schedule) => sum + parseInt(schedule.hours), 0);
}

getMonthEarnings(month) {
    const monthSchedules = this.getMonthSchedules(month);
    return monthSchedules.reduce((sum, schedule) => sum + (schedule.totalAmount || 0), 0);
}

showDaySchedule(dateStr) {
    const schedules = this.scheduleManager.getAllSchedules();
    const daySchedules = schedules.filter(s => s.date === dateStr);
    const date = new Date(dateStr);
    
    if (daySchedules.length === 0) {
        document.getElementById('modal-content').innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-calendar-day text-gray-300 text-5xl mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-500">لا توجد جداول</h3>
                <p class="text-gray-400 mt-2">${this.sudanCalendar.formatDate(date, 'full')}</p>
                <button onclick="app.addScheduleForDate('${dateStr}')" 
                        class="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
                    <i class="fas fa-plus ml-2"></i>
                    إضافة جدول لهذا اليوم
                </button>
            </div>
        `;
    } else {
        let totalHours = 0;
        let totalAmount = 0;
        
        document.getElementById('modal-content').innerHTML = `
            <div class="space-y-4">
                <h3 class="text-xl font-bold text-gray-800 text-center">
                    ${this.sudanCalendar.formatDate(date, 'full')}
                </h3>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <div class="text-center">
                            <div class="text-lg font-bold text-blue-700">${daySchedules.length}</div>
                            <div class="text-sm text-blue-600">عدد الجداول</div>
                        </div>
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg">
                        <div class="text-center">
                            <div class="text-lg font-bold text-green-700">${daySchedules.reduce((sum, s) => sum + parseInt(s.hours), 0)}</div>
                            <div class="text-sm text-green-600">إجمالي الساعات</div>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-3">
                    ${daySchedules.map(schedule => {
                        totalHours += parseInt(schedule.hours);
                        totalAmount += (schedule.totalAmount || 0);
                        
                        return `
                            <div class="p-3 border border-gray-200 rounded-lg">
                                <div class="flex justify-between items-center mb-2">
                                    <h4 class="font-bold text-gray-800">${schedule.customerName}</h4>
                                    <span class="px-2 py-1 text-xs rounded ${
                                        schedule.paymentStatus === 'مدفوع' ? 'bg-green-100 text-green-800' :
                                        schedule.paymentStatus === 'آجل' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }">
                                        ${schedule.paymentStatus}
                                    </span>
                                </div>
                                <div class="flex justify-between text-sm text-gray-600">
                                    <span>${schedule.hours} ساعة</span>
                                    <span class="font-bold">${this.formatCurrency(schedule.totalAmount)}</span>
                                </div>
                                <div class="mt-2 text-sm">
                                    <i class="fas fa-tasks text-gray-400 ml-1"></i>
                                    ${schedule.workType}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="pt-4 border-t border-gray-200">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-gray-800">المجموع:</span>
                        <div class="text-right">
                            <div class="text-lg font-bold text-primary">${totalHours} ساعة</div>
                            <div class="text-sm font-bold text-green-600">${this.formatCurrency(totalAmount)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    document.getElementById('schedule-modal').classList.remove('hidden');
}

addScheduleForDate(dateStr) {
    document.getElementById('date').value = dateStr;
    document.getElementById('schedule-modal').classList.add('hidden');
    
    window.scrollTo({
        top: document.getElementById('customer-name').offsetTop - 100,
        behavior: 'smooth'
    });
    
    document.getElementById('customer-name').focus();
    this.showToast('تم تعيين التاريخ، أكمل بيانات الجدول');
    }
    }
    
    handleAddSchedule() {
        const customerName = document.getElementById('customer-name').value;
        const phone = document.getElementById('phone').value;
        const location = document.getElementById('location').value;
        const workType = document.getElementById('work-type').value;
        const date = document.getElementById('date').value;
        const hours = parseInt(document.getElementById('hours').value);
        const hourlyRate = parseInt(document.getElementById('hourly-rate').value);
        const paymentStatus = document.getElementById('payment-status').value;
        const notes = document.getElementById('notes').value;
        
        if (!customerName || !phone || !hours) {
            this.showToast('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        const scheduleData = {
            customerName,
            phone,
            location,
            workType,
            date,
            hours,
            hourlyRate,
            paymentStatus,
            notes,
            totalAmount: hours * hourlyRate
        };
        
        this.scheduleManager.addSchedule(scheduleData);
        
        // إعادة تعيين النموذج
        document.getElementById('schedule-form').reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        document.getElementById('hourly-rate').value = 5000;
        
        // تحديث الواجهة
        this.renderStats();
        this.renderSchedules();
        
        // إظهار رسالة النجاح
        this.showToast('تم إضافة الجدول بنجاح!');
        
        // التمرير إلى الأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    callCustomer(phone) {
        if (confirm(`هل تريد الاتصال بـ ${phone}؟`)) {
            window.open(`tel:${phone}`);
        }
    }
    
    markAsPaid(id) {
        if (this.scheduleManager.updatePaymentStatus(id, 'مدفوع')) {
            this.renderStats();
            this.renderSchedules();
            this.showToast('تم تحديث حالة الدفع');
        }
    }
    
    deleteSchedule(id) {
        if (confirm('هل أنت متأكد من حذف هذا الجدول؟')) {
            if (this.scheduleManager.deleteSchedule(id)) {
                this.renderStats();
                this.renderSchedules();
                this.showToast('تم حذف الجدول بنجاح');
            }
        }
    }
    
    searchSchedules(query) {
        const schedules = this.scheduleManager.getAllSchedules();
        const filteredSchedules = schedules.filter(schedule =>
            schedule.customerName.toLowerCase().includes(query.toLowerCase()) ||
            schedule.phone.includes(query) ||
            (schedule.location && schedule.location.toLowerCase().includes(query.toLowerCase()))
        );
        
        document.getElementById('schedules-list-container').innerHTML = 
            this.renderSchedulesList(filteredSchedules);
    }
    
    switchView(view) {
        this.currentView = view;
        
        // تحديث أزرار التنقل
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('text-yellow-300');
            btn.classList.add('text-white/70');
        });
        
        const activeBtn = document.querySelector(`.nav-btn[data-view="${view}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('text-white/70');
            activeBtn.classList.add('text-yellow-300');
        }
        
        // عرض المحتوى المناسب
        switch (view) {
            case 'home':
                // المحتوى الرئيسي معروض بالفعل
                break;
            case 'calendar':
                this.showToast('عرض التقويم - قيد التطوير');
                break;
            case 'reports':
                this.showToast('عرض التقارير - قيد التطوير');
                break;
            case 'customers':
                this.showToast('عرض الزبائن - قيد التطوير');
                break;
        }
    }
    
    showSeasonInfo() {
        const season = this.sudanCalendar.getCurrentSeason();
        document.getElementById('modal-content').innerHTML = `
            <div class="space-y-4">
                <h3 class="text-xl font-bold text-gray-800">${season.name}</h3>
                <p class="text-gray-600">${season.localName}</p>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-bold text-gray-700 mb-2">فترة الموسم:</h4>
                    <p class="text-gray-800">${season.period}</p>
                </div>
                
                <div>
                    <h4 class="font-bold text-gray-700 mb-2">أنشطة الموسم:</h4>
                    <ul class="space-y-2">
                        ${season.activities.map(activity => `
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-green-500 ml-2"></i>
                                <span>${activity}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 class="font-bold text-yellow-800 mb-2">التوصيات:</h4>
                    <p class="text-yellow-700">${season.recommendation}</p>
                </div>
            </div>
        `;
        
        document.getElementById('schedule-modal').classList.remove('hidden');
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        toast.classList.remove('opacity-0', '-translate-y-10');
        toast.classList.add('opacity-100', 'translate-y-0');
        
        setTimeout(() => {
            toast.classList.remove('opacity-100', 'translate-y-0');
            toast.classList.add('opacity-0', '-translate-y-10');
        }, 3000);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-SD').format(amount) + ' ج.س';
    }
    
    setupPWA() {
        // PWA سيتم إضافتها في نسخة لاحقة
        console.log('PWA جاهزة للتثبيت');
    }
    // إضافة في نهاية الكلاس MajdulSudan:

generateFinancialReport() {
    const schedules = this.scheduleManager.getAllSchedules();
    
    // إحصائيات الدفع
    const paymentStats = {
        paid: 0,
        pending: 0,
        partial: 0
    };
    
    let totalPaid = 0;
    let totalPending = 0;
    
    schedules.forEach(schedule => {
        switch(schedule.paymentStatus) {
            case 'مدفوع':
                paymentStats.paid++;
                totalPaid += schedule.totalAmount;
                break;
            case 'آجل':
                paymentStats.pending++;
                totalPending += schedule.totalAmount;
                break;
            case 'جزئي':
                paymentStats.partial++;
                totalPending += (schedule.totalAmount * 0.5); // نفترض أن 50% باقي
                totalPaid += (schedule.totalAmount * 0.5);
                break;
        }
    });
    
    return {
        totalPaid: this.formatCurrency(totalPaid),
        totalPending: this.formatCurrency(totalPending),
        paidCount: paymentStats.paid,
        pendingCount: paymentStats.pending,
        partialCount: paymentStats.partial
    };
}

showFinancialReport() {
    const report = this.generateFinancialReport();
    
    document.getElementById('modal-content').innerHTML = `
        <div class="space-y-6">
            <h3 class="text-xl font-bold text-gray-800 text-center">تقرير الإيرادات</h3>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-700">${report.totalPaid}</div>
                        <div class="text-sm text-green-600 mt-1">إجمالي المدفوع</div>
                        <div class="text-xs text-green-500 mt-2">${report.paidCount} عملية</div>
                    </div>
                </div>
                
                <div class="bg-red-50 p-4 rounded-xl border border-red-200">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-red-700">${report.totalPending}</div>
                        <div class="text-sm text-red-600 mt-1">إجمالي المستحق</div>
                        <div class="text-xs text-red-500 mt-2">${report.pendingCount + report.partialCount} عملية</div>
                    </div>
                </div>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 class="font-bold text-blue-800 mb-3">تفاصيل الحالات:</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="flex items-center">
                            <div class="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
                            مدفوع بالكامل
                        </span>
                        <span class="font-bold">${report.paidCount}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="flex items-center">
                            <div class="w-3 h-3 bg-yellow-500 rounded-full ml-2"></div>
                            مدفوع جزئياً
                        </span>
                        <span class="font-bold">${report.partialCount}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="flex items-center">
                            <div class="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
                            غير مدفوع
                        </span>
                        <span class="font-bold">${report.pendingCount}</span>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="app.sendPaymentReminders()" 
                        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
                    <i class="fas fa-bell ml-2"></i>
                    إرسال تذكيرات الدفع
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('schedule-modal').classList.remove('hidden');
}

sendPaymentReminders() {
    const schedules = this.scheduleManager.getAllSchedules();
    const pendingSchedules = schedules.filter(s => s.paymentStatus !== 'مدفوع');
    
    if (pendingSchedules.length === 0) {
        this.showToast('لا توجد مستحقات معلقة');
        return;
    }
    
    let message = "تذكير بالدفع:\n\n";
    pendingSchedules.forEach((schedule, index) => {
        message += `${index + 1}. ${schedule.customerName} - ${this.formatCurrency(schedule.totalAmount)}\n`;
        message += `   الهاتف: ${schedule.phone}\n\n`;
    });
    
    // محاكاة إرسال التذكيرات
    console.log('تذكيرات الدفع:', message);
    
    // في تطبيق حقيقي، يمكن إرسال رسائل SMS أو WhatsApp
    this.showToast(`تم إرسال ${pendingSchedules.length} تذكير دفع`);
        }
}

// تشغيل التطبيق عندما يتم تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MajdulSudan();
});
