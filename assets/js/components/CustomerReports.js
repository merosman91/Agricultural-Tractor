/**
 * CustomerReports - مكون تقارير العملاء
 */
class CustomerReports {
    constructor(app) {
        this.app = app;
    }
    
    render() {
        const customers = this.app.customerReport.generateCustomerReports();
        
        return `
            <div class="sudan-card overflow-hidden mb-8">
                <div class="bg-gradient-to-l from-green-600 to-green-700 p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <i class="fas fa-users text-white text-2xl"></i>
                            <h2 class="text-xl font-bold text-white">تقارير العملاء</h2>
                        </div>
                        <div class="bg-white/20 px-3 py-1 rounded-full">
                            <span class="text-white font-semibold">${customers.length} عميل</span>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    ${customers.length === 0 ? this.renderEmptyState() : this.renderCustomersList(customers)}
                </div>
            </div>
        `;
    }
    
    renderEmptyState() {
        return `
            <div class="text-center py-12">
                <div class="mb-4">
                    <i class="fas fa-users text-gray-300 text-6xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-500 mb-2">لا توجد بيانات للعملاء</h3>
                <p class="text-gray-400">ابدأ بإضافة جداول عمل للعملاء</p>
            </div>
        `;
    }
    
    renderCustomersList(customers) {
        return `
            <div class="space-y-4">
                ${customers.map(customer => this.renderCustomerCard(customer)).join('')}
            </div>
            
            <div class="mt-8 pt-6 border-t border-gray-200">
                <button onclick="app.showAllReportsModal()" 
                        class="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
                    <i class="fas fa-chart-bar ml-2"></i>
                    عرض التقارير الكاملة
                </button>
            </div>
        `;
    }
    
    renderCustomerCard(customer) {
        return `
            <div class="report-card p-4" data-customer="${customer.name}">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <h4 class="text-lg font-bold text-gray-800">${customer.name}</h4>
                        <div class="flex items-center space-x-3 space-x-reverse mt-1 text-sm text-gray-600">
                            <span><i class="fas fa-phone ml-1"></i> ${customer.phone}</span>
                            <span><i class="fas fa-map-marker-alt ml-1"></i> ${customer.location}</span>
                        </div>
                    </div>
                    
                    <div class="flex space-x-2 space-x-reverse">
                        <button onclick="app.showCustomerDetails('${customer.name}')" 
                                class="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                                title="عرض التفاصيل">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="app.shareCustomerReport('${customer.name}')" 
                                class="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
                                title="مشاركة عبر واتساب">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div class="text-center">
                        <div class="text-lg font-bold text-primary">${customer.totalDays}</div>
                        <div class="text-xs text-gray-600">الأيام</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-green-600">${customer.totalHours}</div>
                        <div class="text-xs text-gray-600">الساعات</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-yellow-600">${this.app.formatCurrency(customer.totalAmount)}</div>
                        <div class="text-xs text-gray-600">الإجمالي</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold ${customer.pendingAmount > 0 ? 'text-red-600' : 'text-gray-600'}">
                            ${this.app.formatCurrency(customer.pendingAmount)}
                        </div>
                        <div class="text-xs ${customer.pendingAmount > 0 ? 'text-red-600' : 'text-gray-600'}">
                            المستحق
                        </div>
                    </div>
                </div>
                
                <div class="text-sm text-gray-600">
                    <i class="fas fa-tasks ml-1"></i>
                    الخدمات: ${Object.entries(customer.workTypes).map(([type, count]) => 
                        `${type} (${count})`).join('، ')}
                </div>
            </div>
        `;
    }
}
