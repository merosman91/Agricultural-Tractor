/**
 * CustomerReport - إدارة تقارير العملاء
 */
class CustomerReport {
    constructor(scheduleManager) {
        this.scheduleManager = scheduleManager;
    }
    
    // إنشاء تقارير العملاء
    generateCustomerReports() {
        const schedules = this.scheduleManager.getAllSchedules();
        const customersMap = {};
        
        // تجميع بيانات كل عميل
        schedules.forEach(schedule => {
            const customerName = schedule.customerName;
            
            if (!customersMap[customerName]) {
                customersMap[customerName] = {
                    name: customerName,
                    phone: schedule.phone,
                    location: schedule.location || 'غير محدد',
                    totalDays: 0,
                    totalHours: 0,
                    totalAmount: 0,
                    pendingAmount: 0,
                    schedules: [],
                    workTypes: {}
                };
            }
            
            const customer = customersMap[customerName];
            customer.totalDays = new Set([...customer.schedules.map(s => s.date), schedule.date]).size;
            customer.totalHours += parseInt(schedule.hours || 0);
            customer.totalAmount += (schedule.totalAmount || 0);
            
            if (schedule.paymentStatus !== 'مدفوع') {
                customer.pendingAmount += (schedule.totalAmount || 0);
            }
            
            customer.schedules.push({
                id: schedule.id,
                date: schedule.date,
                hours: schedule.hours,
                workType: schedule.workType || 'غير محدد',
                amount: schedule.totalAmount || 0,
                paymentStatus: schedule.paymentStatus || 'آجل',
                notes: schedule.notes
            });
            
            // إحصاء أنواع العمل
            const workType = schedule.workType || 'غير محدد';
            customer.workTypes[workType] = (customer.workTypes[workType] || 0) + 1;
        });
        
        return Object.values(customersMap).sort((a, b) => b.totalAmount - a.totalAmount);
    }
    
    // إنشاء نص التقرير للواتساب
    createWhatsAppReport(customer) {
        const pendingAmount = customer.schedules
            .filter(s => s.paymentStatus !== 'مدفوع')
            .reduce((sum, s) => sum + s.amount, 0);
        
        let reportText = `📋 *تقرير العمل: ${customer.name}*\n\n`;
        reportText += `📞 الهاتف: ${customer.phone}\n`;
        reportText += `📍 الموقع: ${customer.location}\n`;
        reportText += `📅 عدد الأيام: ${customer.totalDays} يوم\n`;
        reportText += `⏱️ إجمالي الساعات: ${customer.totalHours} ساعة\n`;
        reportText += `💰 القيمة الإجمالية: ${this.formatCurrency(customer.totalAmount)}\n\n`;
        
        reportText += `*المبلغ المستحق: ${this.formatCurrency(pendingAmount)}*\n\n`;
        
        reportText += `*تفاصيل الجداول:*\n`;
        customer.schedules.forEach((schedule, index) => {
            const date = new Date(schedule.date);
            const formattedDate = date.toLocaleDateString('ar-SD', {
                day: 'numeric',
                month: 'short'
            });
            
            reportText += `${index + 1}. ${formattedDate} - ${schedule.workType} - ${schedule.hours} ساعة - ${this.formatCurrency(schedule.amount)}\n`;
        });
        
        reportText += `\n---\n`;
        reportText += `📱 تم إنشاء التقرير عبر تطبيق المجدول`;
        
        return reportText;
    }
    
    // تنسيق العملة
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-SD').format(amount) + ' ج.س';
    }
}
