// إدارة الجداول والبيانات
class ScheduleManager {
    constructor() {
        this.storageKey = 'majdulSudanSchedules';
        this.schedules = this.loadFromStorage();
        this.hourlyRate = 5000; // السعر الافتراضي للساعة بالجنيه السوداني
    }
    
    // تحميل البيانات من التخزين المحلي
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            return [];
        }
    }
    
    // حفظ البيانات في التخزين المحلي
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.schedules));
            return true;
        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
            return false;
        }
    }
    
    // إضافة جدول جديد
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
    
    // تحديث جدول موجود
    updateSchedule(id, updates) {
        const index = this.schedules.findIndex(s => s.id === id);
        if (index === -1) return false;
        
        this.schedules[index] = {
            ...this.schedules[index],
            ...updates,
            totalAmount: updates.hours 
                ? updates.hours * (updates.hourlyRate || this.schedules[index].hourlyRate || this.hourlyRate)
                : this.schedules[index].totalAmount,
            updatedAt: new Date().toISOString()
        };
        
        this.saveToStorage();
        return true;
    }
    
    // حذف جدول
    deleteSchedule(id) {
        const initialLength = this.schedules.length;
        this.schedules = this.schedules.filter(s => s.id !== id);
        
        if (this.schedules.length < initialLength) {
            this.saveToStorage();
            return true;
        }
        
        return false;
    }
    
    // الحصول على جدول بمُعرِّف
    getSchedule(id) {
        return this.schedules.find(s => s.id === id);
    }
    
    // الحصول على جميع الجداول
    getAllSchedules(filter = {}) {
        let filtered = [...this.schedules];
        
        // تطبيق الفلاتر
        if (filter.date) {
            filtered = filtered.filter(s => s.date === filter.date);
        }
        
        if (filter.customer) {
            filtered = filtered.filter(s => 
                s.customerName.toLowerCase().includes(filter.customer.toLowerCase()) ||
                s.phone.includes(filter.customer)
            );
        }
        
        if (filter.paymentStatus) {
            filtered = filtered.filter(s => s.paymentStatus === filter.paymentStatus);
        }
        
        if (filter.workType) {
            filtered = filtered.filter(s => s.workType === filter.workType);
        }
        
        return filtered;
    }
    
    // الحصول على الإحصائيات
    getStats() {
        const totalHours = this.schedules.reduce((sum, s) => sum + parseInt(s.hours), 0);
        const totalCustomers = [...new Set(this.schedules.map(s => s.customerName))].length;
        
        // ساعات اليوم
        const today = new Date().toISOString().split('T')[0];
        const todaySchedules = this.schedules.filter(s => s.date === today);
        const todayHours = todaySchedules.reduce((sum, s) => sum + parseInt(s.hours), 0);
        
        // الإيرادات
        const totalEarnings = this.schedules.reduce((sum, s) => sum + s.totalAmount, 0);
        const unpaidAmount = this.schedules
            .filter(s => s.paymentStatus !== 'مدفوع')
            .reduce((sum, s) => sum + s.totalAmount, 0);
        
        // المحاصيل الشائعة
        const workTypes = {};
        this.schedules.forEach(s => {
            workTypes[s.workType] = (workTypes[s.workType] || 0) + 1;
        });
        
        const mostCommonWork = Object.entries(workTypes)
            .sort((a, b) => b[1] - a[1])[0] || ['غير محدد', 0];
        
        return {
            totalHours,
            totalCustomers,
            todayHours,
            totalEarnings,
            unpaidAmount,
            mostCommonWork: mostCommonWork[0],
            scheduleCount: this.schedules.length
        };
    }
    
    // الحصول على أفضل العملاء
    getTopCustomers(limit = 5) {
        const customerMap = {};
        
        this.schedules.forEach(schedule => {
            if (!customerMap[schedule.customerName]) {
                customerMap[schedule.customerName] = {
                    name: schedule.customerName,
                    phone: schedule.phone,
                    totalHours: 0,
                    totalAmount: 0,
                    lastVisit: schedule.date,
                    location: schedule.location
                };
            }
            
            customerMap[schedule.customerName].totalHours += parseInt(schedule.hours);
            customerMap[schedule.customerName].totalAmount += schedule.totalAmount;
            
            if (new Date(schedule.date) > new Date(customerMap[schedule.customerName].lastVisit)) {
                customerMap[schedule.customerName].lastVisit = schedule.date;
            }
        });
        
        return Object.values(customerMap)
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, limit);
    }
    
    // الحصول على الجداول القادمة
    getUpcomingSchedules(days = 7) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        
        return this.schedules
            .filter(s => {
                const scheduleDate = new Date(s.date);
                return scheduleDate >= today && scheduleDate <= futureDate;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    // تغيير حالة الدفع
    updatePaymentStatus(id, status) {
        return this.updateSchedule(id, { paymentStatus: status });
    }
    
    // البحث في الجداول
    searchSchedules(query) {
        if (!query.trim()) return this.schedules;
        
        const searchTerm = query.toLowerCase();
        return this.schedules.filter(s =>
            s.customerName.toLowerCase().includes(searchTerm) ||
            s.phone.includes(searchTerm) ||
            (s.location && s.location.toLowerCase().includes(searchTerm)) ||
            (s.notes && s.notes.toLowerCase().includes(searchTerm))
        );
    }
    
    // تصدير البيانات
    exportData(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.schedules, null, 2);
        } else if (format === 'csv') {
            // تحويل إلى CSV
            const headers = ['الزبون', 'الهاتف', 'التاريخ', 'الساعات', 'السعر', 'المجموع', 'حالة الدفع', 'الموقع', 'نوع العمل', 'الملاحظات'];
            const rows = this.schedules.map(s => [
                s.customerName,
                s.phone,
                s.date,
                s.hours,
                s.hourlyRate || this.hourlyRate,
                s.totalAmount,
                s.paymentStatus,
                s.location || '',
                s.workType,
                s.notes || ''
            ]);
            
            return [headers, ...rows]
                .map(row => row.map(cell => `"${cell}"`).join(','))
                .join('\n');
        }
        
        return null;
    }
    
    // استيراد البيانات
    importData(data, format = 'json') {
        try {
            let importedSchedules;
            
            if (format === 'json') {
                importedSchedules = JSON.parse(data);
            } else if (format === 'csv') {
                // تحويل CSV إلى JSON
                const lines = data.split('\n');
                const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
                importedSchedules = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.replace(/"/g, '').trim());
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = values[index];
                    });
                    return obj;
                });
            }
            
            if (Array.isArray(importedSchedules)) {
                // إضافة معرّفات جديدة للبيانات المستوردة
                importedSchedules.forEach(schedule => {
                    if (!schedule.id) {
                        schedule.id = Date.now() + Math.random();
                    }
                    if (!schedule.createdAt) {
                        schedule.createdAt = new Date().toISOString();
                    }
                    if (!schedule.updatedAt) {
                        schedule.updatedAt = new Date().toISOString();
                    }
                });
                
                this.schedules = [...this.schedules, ...importedSchedules];
                this.saveToStorage();
                return true;
            }
        } catch (error) {
            console.error('خطأ في استيراد البيانات:', error);
        }
        
        return false;
    }
    
    // مسح جميع البيانات
    clearAllData() {
        this.schedules = [];
        this.saveToStorage();
        return true;
    }
}

export default ScheduleManager;
