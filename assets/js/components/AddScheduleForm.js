/**
 * AddScheduleForm - مكون نموذج إضافة الجداول
 */
class AddScheduleForm {
    constructor(app) {
        this.app = app;
    }
    
    render() {
        const today = new Date().toISOString().split('T')[0];
        
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
                                <option value="قصابية">قصابية</option>
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
    
    setupEventListeners() {
        const form = document.getElementById('schedule-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }
    
    handleSubmit() {
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
            this.app.showToast('يرجى ملء جميع الحقول المطلوبة');
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
        
        this.app.scheduleManager.addSchedule(scheduleData);
        
        // إعادة تعيين النموذج
        document.getElementById('schedule-form').reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        document.getElementById('hourly-rate').value = 5000;
        
        // تحديث التطبيق
        this.app.updateUI();
        this.app.showToast('تم إضافة الجدول بنجاح!');
        
        // التمرير إلى الأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
