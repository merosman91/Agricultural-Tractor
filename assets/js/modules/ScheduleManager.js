/**
 * ScheduleManager - إدارة الجداول والبيانات
 */
class ScheduleManager {
    constructor() {
        this.storageKey = 'majdulSchedules';
        this.hourlyRate = 5000; // السعر الافتراضي للساعة بالجنيه السوداني
        this.schedules = this.loadFromStorage();
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
    
    // الحصول على جميع الجداول مع التصفية
    getAllSchedules(filters = {}) {
        let filtered = [...this.schedules];
        
        if (filters.date) {
            filtered = filtered.filter(s => s.date === filters.date);
        }
        
        if (filters.customer) {
            filtered = filtered.filter(s => 
                s.customerName.toLowerCase().includes(filters.customer.toLowerCase()) ||
                s.phone.includes(filters.customer)
            );
        }
        
        if (filters.paymentStatus) {
            filtered = filtered.filter(s => s.paymentStatus === filters.paymentStatus);
        }
        
        if (filters.workType) {
            filtered = filtered.filter(s => s.workType === filters.workType);
        }
        
        return filtered;
    }
    
    // الحصول على الإحصائيات
    getStats() {
        const totalHours = this.schedules.reduce((sum, s) => sum + parseInt(s.hours || 0), 0);
        const totalCustomers = [...new Set(this.schedules.map(s => s.customerName))].length;
        
        // ساعات اليوم
        const today = new Date().toISOString().split('T')[0];
        const todaySchedules = this.schedules.filter(s => s.date === today);
        const todayHours = todaySchedules.reduce((sum, s) => sum + parseInt(s.hours || 0), 0);
        
        // الإيرادات
        const totalEarnings = this.schedules.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        const unpaidAmount = this.schedules
            .filter(s => s.paymentStatus !== 'مدفوع')
            .reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        
        return {
            totalHours,
            totalCustomers,
            todayHours,
            totalEarnings,
            unpaidAmount,
            scheduleCount: this.schedules.length
        };
    }
          }
