/**
 * MajdulApp - التطبيق الرئيسي
 */
class MajdulApp {
    constructor() {
        this.currentView = 'home';
        
        // تهيئة الموديلات
        this.scheduleManager = new ScheduleManager();
        this.sudanCalendar = new SudanCalendar();
        this.customerReport = new CustomerReport(this.scheduleManager);
        
        // تهيئة الكومبوننتس
        this.header = new Header(this);
        this.stats = new Stats(this);
        this.addScheduleForm = new AddScheduleForm(this);
        this.scheduleList = new ScheduleList(this);
        this.customerReports = new CustomerReports(this);
        this.bottomNav = new BottomNav(this);
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.renderAllComponents();
        this.setupEventListeners();
        this.setupPWA();
        
        console.log('🚜 تطبيق المجدول جاهز للعمل!');
    }
    
    renderAllComponents() {
        // تحميل جميع المكونات
        document.getElementById('header').innerHTML = this.header.render();
        document.getElementById('stats-section').innerHTML = this.stats.render();
        document.getElementById('sudan-date-section').innerHTML = this.renderSudanDate();
        document.getElementById('add-schedule-section').innerHTML = this.addScheduleForm.render();
        document.getElementById('schedules-section').innerHTML = this.scheduleList.render();
        document.getElementById('customer-reports-section').innerHTML = this.customerReports.render();
        document.getElementById('bottom-nav').innerHTML = this.bottomNav.render();
        
        // تحميل المودالات
        this.renderModals();
        
        // إعداد المستمعين للأحداث
        this.setupComponentEventListeners();
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
                    </div>
                </div>
            </div>
        `;
    }
    
    renderModals() {
        document.getElementById('modals-container').innerHTML = `
            <!-- مودال تفاصيل العميل -->
            <div id="customer-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 hidden">
                <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div class="bg-primary p-5 flex justify-between items-center sticky top-0">
                        <h3 class="text-xl font-bold text-white">تفاصيل العميل</h3>
                        <button id="close-modal" class="text-white text-2xl hover:text-gray-200">&times;</button>
                    </div>
                    <div class="p-6" id="customer-modal-content"></div>
                </div>
            </div>
            
            <!-- مودال جميع التقارير -->
            <div id="reports-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 hidden">
                <div class="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                    <div class="bg-green-600 p-5 flex justify-between items-center sticky top-0">
                        <h3 class="text-xl font-bold text-white">تقارير جميع العملاء</h3>
                        <button id="close-reports-modal" class="text-white text-2xl hover:text-gray-200">&times;</button>
                    </div>
                    <div class="p-6" id="reports-modal-content"></div>
                </div>
            </div>
            
            <!-- Toast -->
            <div id="toast" class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 opacity-0 -translate-y-10">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <i class="fas fa-check-circle"></i>
                    <span id="toast-message">تمت العملية بنجاح</span>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // زر اليوم
        document.addEventListener('click', (e) => {
            if (e.target.id === 'today-btn') {
                document.getElementById('date').value = new Date().toISOString().split('T')[0];
            }
            
            // زر الإضافة السريعة
            if (e.target.id === 'quick-add-btn') {
                document.getElementById('customer-name').focus();
                window.scrollTo({
                    top: document.getElementById('schedule-form').offsetTop - 100,
                    behavior: 'smooth'
                });
            }
            
            // إغلاق المودال
            if (e.target.id === 'close-modal' || e.target.closest('#close-modal')) {
                document.getElementById('customer-modal').classList.add('hidden');
            }
            
            if (e.target.id === 'close-reports-modal' || e.target.closest('#close-reports-modal')) {
                document.getElementById('reports-modal').classList.add('hidden');
            }
            
            if (e.target.id === 'customer-modal' || e.target.id === 'reports-modal') {
                e.target.classList.add('hidden');
            }
        });
        
        // البحث في الجداول
        document.addEventListener('input', (e) => {
            if (e.target.id === 'search-schedules') {
                this.scheduleList.search(e.target.value);
            }
        });
    }
    
    setupComponentEventListeners() {
        this.addScheduleForm.setupEventListeners();
        this.scheduleList.setupEventListeners();
        this.bottomNav.setupEventListeners();
    }
    
    switchView(view) {
        this.currentView = view;
        
        // إخفاء جميع الأقسام
        const sections = ['schedules-section', 'customer-reports-section', 'financial-reports-section'];
        sections.forEach(section => {
            document.getElementById(section)?.classList.add('hidden');
        });
        
        // عرض القسم المحدد
        switch (view) {
            case 'home':
                document.getElementById('schedules-section').classList.remove('hidden');
                break;
            case 'reports':
                document.getElementById('customer-reports-section').classList.remove('hidden');
                break;
            case 'customers':
                this.showCustomerReportsModal();
                break;
            case 'financial':
                this.showFinancialReport();
                break;
        }
    }
    
    // ============ دوال العرض ============
    
    showCustomerDetails(customerName) {
        const customers = this.customerReport.generateCustomerReports();
        const customer = customers.find(c => c.name === customerName);
        
        if (!customer) return;
        
        let modalContent = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h4 class="text-lg font-bold text-gray-800">${customer.name}</h4>
                    <div class="flex space-x-2 space-x-reverse">
                        <button onclick="app.printCustomerReport('${customer.name}')" 
                                class="p-2 bg-gray-100 text-gray-700 rounded-lg">
                            <i class="fas fa-print"></i>
                        </button>
                        <button onclick="app.shareCustomerReport('${customer.name}')" 
                                class="p-2 bg-green-100 text-green-700 rounded-lg">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="text-sm text-gray-500">رقم الهاتف</div>
                        <div class="font-medium">${customer.phone}</div>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="text-sm text-gray-500">الموقع</div>
                        <div class="font-medium">${customer.location}</div>
                    </div>
                </div>
                
                <div>
                    <h5 class="font-bold text-gray-700 mb-3">تفاصيل الجداول:</h5>
                    <div class="space-y-3">
        `;
        
        customer.schedules.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        customer.schedules.forEach(schedule => {
            const date = new Date(schedule.date);
            const formattedDate = date.toLocaleDateString('ar-SD');
            
            modalContent += `
                <div class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-medium">${formattedDate}</span>
                        <span class="px-2 py-1 text-xs rounded ${
                            schedule.paymentStatus === 'مدفوع' ? 'bg-green-100 text-green-800' :
                            schedule.paymentStatus === 'آجل' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }">
                            ${schedule.paymentStatus}
                        </span>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-3 text-sm">
                        <div>
                            <div class="text-gray-500">الخدمة</div>
                            <div class="font-medium">${schedule.workType}</div>
                        </div>
                        <div>
                            <div class="text-gray-500">الساعات</div>
                            <div class="font-medium">${schedule.hours} ساعة</div>
                        </div>
                        <div>
                            <div class="text-gray-500">المبلغ</div>
                            <div class="font-medium">${this.formatCurrency(schedule.amount)}</div>
                        </div>
                    </div>
                    
                    ${schedule.notes ? `
                        <div class="mt-2 text-sm text-gray-600">
                            <i class="fas fa-sticky-note ml-1"></i>
                            ${schedule.notes}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        modalContent += `
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-primary/10 to-green-100 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-sm text-gray-600">المبلغ المستحق</div>
                            <div class="text-xl font-bold text-primary">${this.formatCurrency(customer.pendingAmount)}</div>
                        </div>
                        <button onclick="app.sendPaymentReminder('${customer.name}', '${customer.phone}', ${customer.pendingAmount})" 
                                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
                            <i class="fas fa-bell ml-2"></i>
                            تذكير بالدفع
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('customer-modal-content').innerHTML = modalContent;
        document.getElementById('customer-modal').classList.remove('hidden');
    }
    
    shareCustomerReport(customerName) {
        const customers = this.customerReport.generateCustomerReports();
        const customer = customers.find(c => c.name === customerName);
        
        if (!customer) return;
        
        const reportText = this.customerReport.createWhatsAppReport(customer);
        const encodedText = encodeURIComponent(reportText);
        const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodedText}`;
        
        window.open(whatsappUrl, '_blank');
        this.showToast('تم فتح واتساب مع نص التقرير');
    }
    
    showAllReportsModal() {
        const customers = this.customerReport.generateCustomerReports();
        
        let modalContent = `
            <div class="space-y-6">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-xl font-bold text-gray-800">تقارير جميع العملاء</h4>
                    <button onclick="app.printAllReports()" 
                            class="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                        <i class="fas fa-print ml-1"></i>
                        طباعة الكل
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        `;
        
        customers.forEach((customer, index) => {
            modalContent += `
                <div class="report-card p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-bold text-gray-800">${index + 1}. ${customer.name}</h5>
                        <span class="text-xs text-gray-500">${customer.phone}</span>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span>الأيام:</span>
                            <span class="font-bold">${customer.totalDays}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>الساعات:</span>
                            <span class="font-bold">${customer.totalHours}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>الإجمالي:</span>
                            <span class="font-bold text-green-600">${this.formatCurrency(customer.totalAmount)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>المستحق:</span>
                            <span class="font-bold ${customer.pendingAmount > 0 ? 'text-red-600' : 'text-gray-600'}">
                                ${this.formatCurrency(customer.pendingAmount)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-3 border-t border-gray-200">
                        <button onclick="app.showCustomerDetails('${customer.name}')" 
                                class="w-full py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all">
                            <i class="fas fa-eye ml-1"></i>
                            عرض التفاصيل
                        </button>
                    </div>
                </div>
            `;
        });
        
        modalContent += `
                </div>
            </div>
        `;
        
        document.getElementById('reports-modal-content').innerHTML = modalContent;
        document.getElementById('reports-modal').classList.remove('hidden');
    }
    
    // ============ دوال الخدمات ============
    
    updateUI() {
        this.stats.update();
        this.scheduleList.update();
        this.customerReports.update?.();
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
    
    sendPaymentReminder(customerName, phone, amount) {
        const message = `مرحباً ${customerName}،\n\nتذكير بالمبلغ المستحق: ${this.formatCurrency(amount)}\n\nالرجاء تسديد المبلغ عند الإمكان.\n\nشكراً،\nالمجدول`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        this.showToast('تم فتح واتساب لإرسال التذكير');
    }
    
    printCustomerReport(customerName) {
        // تنفيذ الطباعة
        this.showToast('ميزة الطباعة قيد التطوير');
    }
    
    printAllReports() {
        // تنفيذ الطباعة
        this.showToast('ميزة الطباعة قيد التطوير');
    }
    
    setupPWA() {
        // إعداد PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('Service Worker مسجل'))
                .catch(err => console.log('خطأ في تسجيل Service Worker:', err));
        }
    }
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MajdulApp();
});
