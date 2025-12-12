/**
 * BottomNav - مكون التنقل السفلي
 */
class BottomNav {
    constructor(app) {
        this.app = app;
        this.activeView = 'home';
    }
    
    render() {
        return `
            <nav class="fixed bottom-0 w-full py-3 px-2 z-40" style="background: linear-gradient(135deg, #1a4d2e 0%, #0d3b1e 100%);">
                <div class="flex justify-around items-center">
                    <button class="nav-btn flex flex-col items-center ${this.activeView === 'home' ? 'text-yellow-300' : 'text-white/70'}" 
                            data-view="home">
                        <i class="fas fa-home text-xl mb-1"></i>
                        <span class="text-xs font-medium">الرئيسية</span>
                    </button>
                    
                    <button class="nav-btn flex flex-col items-center ${this.activeView === 'reports' ? 'text-yellow-300' : 'text-white/70'}" 
                            data-view="reports">
                        <i class="fas fa-file-alt text-xl mb-1"></i>
                        <span class="text-xs font-medium">التقارير</span>
                    </button>
                    
                    <button class="nav-btn flex flex-col items-center ${this.activeView === 'customers' ? 'text-yellow-300' : 'text-white/70'}" 
                            data-view="customers">
                        <i class="fas fa-users text-xl mb-1"></i>
                        <span class="text-xs font-medium">العملاء</span>
                    </button>
                    
                    <button class="nav-btn flex flex-col items-center ${this.activeView === 'financial' ? 'text-yellow-300' : 'text-white/70'}" 
                            data-view="financial">
                        <i class="fas fa-chart-line text-xl mb-1"></i>
                        <span class="text-xs font-medium">الإيرادات</span>
                    </button>
                </div>
            </nav>
        `;
    }
    
    setupEventListeners() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
                this.app.switchView(view);
            });
        });
    }
    
    switchView(view) {
        this.activeView = view;
        
        // تحديث الألوان
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('text-yellow-300');
            btn.classList.add('text-white/70');
        });
        
        const activeBtn = document.querySelector(`.nav-btn[data-view="${view}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('text-white/70');
            activeBtn.classList.add('text-yellow-300');
        }
    }
}
