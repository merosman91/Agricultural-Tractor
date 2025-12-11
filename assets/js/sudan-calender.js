// التقويم السوداني والفصول الزراعية
class SudanCalendar {
    constructor() {
        this.region = 'الشمالية';
        this.currentSeason = this.getCurrentSeason();
    }
    
    // الحصول على التاريخ الهجري
    getHijriDate(gregorianDate = new Date()) {
        // تحويل مبسط (يمكن استبداله بمكتبة دقيقة)
        const date = new Date(gregorianDate);
        const adjustment = -1; // تعديل التقويم
        
        // تحويل تقريبي
        const hijriYear = Math.floor((date.getFullYear() - 622) * (33/32));
        const hijriMonth = ((date.getMonth() + 1) + 2) % 12 || 12;
        const hijriDay = date.getDate();
        
        const hijriMonths = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
            'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
            'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
        
        return {
            year: 1445 + Math.floor(Math.random() * 2), // تقريبي
            month: hijriMonth,
            day: hijriDay,
            monthName: hijriMonths[hijriMonth - 1]
        };
    }
    
    // الفصول الزراعية السودانية
    getSudanSeasons() {
        return [
            {
                id: 'summer',
                name: 'الموسم الصيفي',
                localName: 'البوّاعة الصيفية',
                period: 'مايو - أغسطس',
                activities: [
                    'زراعة الذرة',
                    'زراعة الدخن',
                    'حراثة الأرض',
                    'الري المنتظم'
                ],
                recommendation: 'الفصل المناسب لزراعة المحاصيل الصيفية في الولاية الشمالية',
                icon: 'fas fa-sun',
                color: 'bg-yellow-500'
            },
            {
                id: 'winter',
                name: 'الموسم الشتوي',
                localName: 'الزراعة الشتوية',
                period: 'نوفمبر - فبراير',
                activities: [
                    'زراعة القمح',
                    'زراعة الخضروات',
                    'تجهيز البيوت المحمية',
                    'مكافحة الآفات'
                ],
                recommendation: 'أنسب وقت لزراعة القمح والحبوب الشتوية',
                icon: 'fas fa-snowflake',
                color: 'bg-blue-500'
            },
            {
                id: 'autumn',
                name: 'موسم الخريف',
                localName: 'موسم الأمطار',
                period: 'يوليو - سبتمبر',
                activities: [
                    'حصاد المحاصيل',
                    'تخزين المنتجات',
                    'تحضير الأرض',
                    'صيانة المعدات'
                ],
                recommendation: 'موسم الأمطار والحصاد، جهز معدات التخزين',
                icon: 'fas fa-cloud-rain',
                color: 'bg-green-500'
            },
            {
                id: 'spring',
                name: 'موسم الربيع',
                localName: 'موسم التزهير',
                period: 'مارس - أبريل',
                activities: [
                    'زراعة الفواكه',
                    'العناية بالأشجار',
                    'التلقيح',
                    'التسميد'
                ],
                recommendation: 'موسم ازدهار الأشجار والمحاصيل البستانية',
                icon: 'fas fa-seedling',
                color: 'bg-pink-500'
            }
        ];
    }
    
    // تحديد الموسم الحالي
    getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        
        if (month >= 5 && month <= 8) {
            return this.getSudanSeasons()[0]; // صيفي
        } else if (month >= 11 || month <= 2) {
            return this.getSudanSeasons()[1]; // شتوي
        } else if (month >= 7 && month <= 9) {
            return this.getSudanSeasons()[2]; // خريف
        } else {
            return this.getSudanSeasons()[3]; // ربيع
        }
    }
    
    // تنسيق التاريخ
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
    
    // التحقق من العطلات السودانية
    getSudanHolidays(year = new Date().getFullYear()) {
        return [
            {
                date: `${year}-01-01`,
                name: 'عيد الاستقلال',
                type: 'national',
                isHoliday: true
            },
            {
                date: `${year}-03-01`,
                name: 'يوم الشهيد',
                type: 'national',
                isHoliday: true
            },
            {
                date: `${year}-04-06`,
                name: 'عيد الربيع',
                type: 'cultural',
                isHoliday: false
            },
            {
                date: `${year}-12-25`,
                name: 'عيد الميلاد',
                type: 'religious',
                isHoliday: true
            }
        ];
    }
    
    // التحقق إذا كان التاريخ عطلة
    isHoliday(date) {
        const dateStr = date.toISOString().split('T')[0];
        const holidays = this.getSudanHolidays();
        return holidays.some(h => h.date === dateStr && h.isHoliday);
    }
    
    // اقتراح تواريخ بناء على الموسم
    suggestSeasonalDates(seasonId, year = new Date().getFullYear()) {
        const seasons = {
            'summer': {
                start: `${year}-05-01`,
                end: `${year}-08-31`,
                bestWeeks: ['أول مايو', 'أول يونيو']
            },
            'winter': {
                start: `${year}-11-01`,
                end: `${year + 1}-02-28`,
                bestWeeks: ['أول نوفمبر', 'أول ديسمبر']
            },
            'autumn': {
                start: `${year}-07-01`,
                end: `${year}-09-30`,
                bestWeeks: ['أول يوليو', 'أول أغسطس']
            },
            'spring': {
                start: `${year}-03-01`,
                end: `${year}-04-30`,
                bestWeeks: ['أول مارس', 'أول أبريل']
            }
        };
        
        return seasons[seasonId] || seasons['summer'];
    }
    
    // حساب عدد أيام الموسم المتبقية
    getDaysRemainingInSeason() {
        const currentSeason = this.getCurrentSeason();
        const today = new Date();
        const seasonEnd = new Date(today.getFullYear(), 7, 31); // مثال: نهاية أغسطس
        
        const diffTime = seasonEnd - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
            season: currentSeason.name,
            daysRemaining: diffDays > 0 ? diffDays : 0,
            message: diffDays > 0 
                ? `متبقي ${diffDays} يوم على نهاية ${currentSeason.localName}`
                : `${currentSeason.localName} انتهى، استعد للموسم القادم`
        };
    }
}

export default SudanCalendar;
