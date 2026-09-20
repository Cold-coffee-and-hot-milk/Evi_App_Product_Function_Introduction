// 预处理器：在 HTML 插入 DOM 之前，把 img src 转为 data-src，并添加 lazy 属性
function preprocessHtml(html) {
    return html.replace(
        /<img([^>]*?)\ssrc=(["'])([^"']+\.png)\2([^>]*?)>/gi,
        function(match, before, quote, srcPath, after) {
            // 替换 .png 为 .webp
            const webpSrc = srcPath.replace(/\.png$/i, '.webp');
            // 如果已有 loading 属性，不重复添加
            const hasLoading = /\sloading\s*=/i.test(match);
            const hasDecoding = /\sdecoding\s*=/i.test(match);
            const hasDataSrc = /\sdata-src\s*=/i.test(match);
            if (hasDataSrc) return match; // 已经处理过了
            const loadingAttr = hasLoading ? '' : ' loading="lazy"';
            const decodingAttr = hasDecoding ? '' : ' decoding="async"';
            return '<img' + before + ' data-src=' + quote + webpSrc + quote + loadingAttr + decodingAttr + after + '>';
        }
    );
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面初始化开始...');

    // 设置移动端菜单
    setupMobileMenu();

    // 设置下载按钮
    setupDownloadButton();
    
    // 设置主页按钮
    setupHomeButton();

    // 设置功能导航
    setupFeatureNavigation();

    // 设置hash路由处理
    setupHashRouting();

    // 预处理主页面中的 logo 图片（index.html 中直接写的 PNG）
    document.querySelectorAll('img[src*=".png"]').forEach(function(img) {
        const src = img.getAttribute('src');
        const webpSrc = src.replace(/\.png$/i, '.webp');
        img.setAttribute('data-src', webpSrc);
        img.removeAttribute('src');
        img.classList.add('lazy');
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
    });
    // 触发初始 lazyload 扫描
    setTimeout(function() {
        if (window.setupImageLazyLoad) window.setupImageLazyLoad();
        if (window.preloadVisibleImages) window.preloadVisibleImages();
    }, 50);

    console.log('页面初始化完成');
});

function setupHashRouting() {
    // 监听hash变化
    window.addEventListener('hashchange', function() {
        handleHashChange();
    });

    // 页面加载时检查hash
    handleHashChange();
}

function handleHashChange() {
    var hash = window.location.hash.substring(1); // 去掉#
    if (hash) {
        console.log('检测到hash变化:', hash);
        loadPage(hash);
    }
}

// 设置移动端菜单
function setupMobileMenu() {
    // 移除了菜单切换按钮和遮罩层的相关代码
    // 因为这些元素已经从HTML中删除
}

// 关闭菜单
function closeMenu() {
    const sidebar = document.getElementById('sidebar');
    
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    
    document.body.style.overflow = '';
}

// 设置下载按钮
function setupDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            alert('请到应用商店搜索“易维讯”进行下载');
        });
    }
}

// 设置主页按钮
function setupHomeButton() {
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            // 重置内容区域，显示主页
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.innerHTML = `
                    <div id="overview" class="page-container active">
                        <div class="page-content">
                            <section class="hero">
                                <h1>易维讯 - 智能化工程机械管理平台</h1>
                                <p>一站式工程机械智能管理解决方案，集设备监控、运维服务、资源对接和社区交流于一体</p>
                                <button class="cta-button" id="downloadBtn">立即下载体验</button>
                            </section>

                            <div class="features-container">
                                <div class="section">
                                    <h2>全面的设备管理</h2>
                                    <div class="feature-card">
                                        <h3>实时监控设备工况</h3>
                                        <p>实时监控设备位置、工作时长、油耗、水温等运行参数，随时掌握设备状态。</p>
                                    </div>
                                    <div class="feature-card">
                                        <h3>设备全生命周期管理</h3>
                                        <p>从设备采购、使用到报废的全过程管理，延长设备使用寿命。</p>
                                    </div>
                                </div>

                                <div class="section">
                                    <h2>智能化服务流程</h2>
                                    <div class="feature-card">
                                        <h3>一键召请服务</h3>
                                        <p>故障报修、预约保养可一键创建服务单，并实时跟踪进度。</p>
                                    </div>
                                    <div class="feature-card">
                                        <h3>配件验伪</h3>
                                        <p>扫描配件二维码，验证是否为三一纯正配件，保障质量。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // 重新设置下载按钮事件
                setupDownloadButton();
            }
            
            // 关闭侧边栏
            closeMenu();
        });
    }
}

// 设置功能导航
function setupFeatureNavigation() {
    // 导航按钮切换
    const navButtons = document.querySelectorAll('.nav-button');
    const functionListMenu = document.getElementById('functionListMenu');
    const commonFunctionsMenu = document.getElementById('commonFunctionsMenu');
    const sidebar = document.getElementById('sidebar');
    
    // 下拉菜单逻辑
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownContainer = document.querySelector('.dropdown-container');

    // 设置下拉按钮点击事件
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 切换下拉菜单显示
            dropdownMenu.classList.toggle('show');
            dropdownContainer.classList.toggle('active');
        });
    }

    // 点击页面其他地方关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (dropdownContainer && !dropdownContainer.contains(e.target)) {
            dropdownMenu.classList.remove('show');
            dropdownContainer.classList.remove('active');
        }
    });

    // 导航按钮点击事件
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 如果点击的是下拉切换按钮，不处理导航逻辑
            if (this.id === 'dropdownToggle') {
                return;
            }

            // 移除所有按钮的激活状态
            navButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的激活状态
            this.classList.add('active');

            // 显示侧边栏
            sidebar.classList.add('active');

            // 切换菜单显示
            if (this.id === 'functionListBtn') {
                functionListMenu.style.display = 'block';
                commonFunctionsMenu.style.display = 'none';
            } else if (this.id === 'commonFunctionsBtn') {
                functionListMenu.style.display = 'none';
                commonFunctionsMenu.style.display = 'block';
            }
            
            // 关闭下拉菜单
            dropdownMenu.classList.remove('show');
            dropdownContainer.classList.remove('active');
        });
    });



    // 当点击内容区域或侧边栏外部时，关闭侧边栏
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const dropdownContainer = document.querySelector('.dropdown-container');
        
        // 处理菜单项点击事件
        const menuItem = e.target.closest('.subsubmenu-item');
        if (menuItem) {
            const pageName = menuItem.getAttribute('data-page');
            console.log('菜单项点击，pageName:', pageName);
            if (pageName) {
                console.log('更新URL hash:', pageName);
                window.location.hash = pageName;
                closeMenu();
                return;
            } else {
                console.error('菜单项没有data-page属性');
            }
        } else {
            console.log('没有找到菜单项元素');
        }
        
        // 如果侧边栏是打开的
        if (sidebar && sidebar.classList.contains('active')) {
            // 检查点击是否在侧边栏或下拉容器外部
            if (!sidebar.contains(e.target) && !dropdownContainer.contains(e.target)) {
                closeMenu();
            }
        }
        
        // 当侧边栏打开时，自动关闭下拉菜单
        const isSidebarClick = e.target.closest('.sidebar');
        const isDropdownClick = e.target.closest('.dropdown-container');
        
        if (isSidebarClick && !isDropdownClick) {
            dropdownMenu.classList.remove('show');
            dropdownContainer.classList.remove('active');
        }
    });
}

// 测试函数，用于手动测试页面加载
function testLoadPage() {
    console.log('开始测试页面加载...');
    loadPage('register');
}

// 全局暴露测试函数，以便在浏览器控制台调用
window.testLoadPage = testLoadPage;

// 加载设备工况页面
function loadEquipmentPage() {
    console.log('直接调用loadEquipmentPage函数');
    
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
        contentArea.innerHTML = '<div style="padding: 20px;"><h1 style="font-size: 28px; color: white; margin-bottom: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">加载中...</h1><div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 20px; padding: 32px; margin-bottom: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease;"><p style="font-size: 15px; color: #333; line-height: 1.8; margin-bottom: 16px; font-weight: 500;">正在加载设备工况页面，请稍候...</p></div></div>';
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'common_functions/equipment_operating_conditions.html', true);
        console.log('设备工况页面的加载路径:', 'common_functions/equipment_operating_conditions.html');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('XHR响应状态:', xhr.status);
                if (xhr.status === 200) {
                    const pageContent = xhr.responseText;
                    console.log('获取到的页面内容长度:', pageContent.length);
                    // 预处理：把 PNG src 转为 data-src（WebP）
                    const processedContent = preprocessHtml(pageContent);
                    contentArea.innerHTML = '<div id="equipment_operating_conditions" class="page-container active"><div class="page-content">' + processedContent + '</div></div>';
                    console.log('设备工况页面加载成功');
                    // 注册 lazyload
                    if (window.setupImageLazyLoad) window.setupImageLazyLoad();
                    if (window.preloadVisibleImages) window.preloadVisibleImages();
                } else {
                    console.error('加载失败:', xhr.status, xhr.statusText);
                    contentArea.innerHTML = '<div style="padding: 20px;"><h1 style="font-size: 28px; color: white; margin-bottom: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">页面加载失败</h1><div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 20px; padding: 32px; margin-bottom: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease;"><p style="font-size: 15px; color: #333; line-height: 1.8; margin-bottom: 16px; font-weight: 500;">抱歉，页面加载失败。</p><p style="font-size: 15px; color: #333; line-height: 1.8; margin-bottom: 16px; font-weight: 500;">错误代码：' + xhr.status + '</p><p style="font-size: 15px; color: #333; line-height: 1.8; margin-bottom: 16px; font-weight: 500;">请检查网络连接后重试。</p></div></div>';
                }
            }
        };
        
        xhr.onerror = function() {
            console.error('网络错误');
            contentArea.innerHTML = '<div style="padding: 20px;"><h1 style="font-size: 28px; color: white; margin-bottom: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">页面加载失败</h1><div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 20px; padding: 32px; margin-bottom: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease;"><p style="font-size: 15px; color: #333; line-height: 1.8; margin-bottom: 16px; font-weight: 500;">抱歉，页面加载失败。</p><p style="font-size: 15px; color: #333; line-height: 1.8; margin-bottom: 16px; font-weight: 500;">网络连接错误，请检查网络后重试。</p></div></div>';
        };
        
        xhr.send();
    }
}

// 全局暴露函数
window.loadEquipmentPage = loadEquipmentPage;

// 加载页面内容
// 设置标签页切换功能
function setupTabs() {
    // 外部页签切换
    const outerTabButtons = document.querySelectorAll('.tab-navigation:not(.inner-tab-nav) .tab-button');
    console.log('找到的外部标签按钮数量:', outerTabButtons.length);
    
    // 显示默认标签内容
    function showDefaultTab() {
        console.log('开始显示默认标签内容');
        const activeButton = document.querySelector('.tab-button.active');
        if (activeButton) {
            const targetTab = activeButton.getAttribute('data-tab');
            console.log('默认目标标签ID:', targetTab);
            
            // 检查是否存在.tab-panel元素（注册页面）
            const tabPanels = document.querySelectorAll('.tab-panel');
            if (tabPanels.length > 0) {
                // 注册页面的切换逻辑
                tabPanels.forEach(panel => panel.classList.remove('active'));
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    console.log('成功激活注册页面默认标签页:', targetTab);
                } else {
                    console.error('未找到注册页面默认标签页:', targetTab);
                }
            } else if (document.querySelectorAll('.tab-content').length > 0) {
                // 设备转让页面的切换逻辑
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });
                
                // 显示对应的内容区域
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.style.display = 'block';
                    console.log('成功激活设备转让页面默认内容区域:', targetTab);
                } else {
                    console.error('未找到设备转让页面默认内容区域:', targetTab);
                }
            } else {
                // 设备工况页面的切换逻辑
                const sections = document.querySelectorAll('.section');
                sections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // 显示对应的外部内容区域
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.style.display = 'block';
                    console.log('成功激活设备工况页面默认内容区域:', targetTab);
                } else {
                    console.error('未找到设备工况页面默认内容区域:', targetTab);
                }
            }
        } else {
            console.error('未找到带有active类的按钮');
        }
    }
    
    // 调用函数显示默认标签内容
    showDefaultTab();
    
    outerTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('点击了外部标签按钮:', button.textContent.trim());
            // 移除所有外部按钮的active类
            outerTabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = '#f0f0f0';
                btn.style.color = '#666';
            });
            // 为当前按钮添加active类
            button.classList.add('active');
            button.style.background = '#667eea';
            button.style.color = 'white';
            
            // 获取目标标签页ID
            const targetTab = button.getAttribute('data-tab');
            console.log('目标外部标签页ID:', targetTab);
            
            // 检查是否存在.tab-panel元素（注册页面）
            const tabPanels = document.querySelectorAll('.tab-panel');
            if (tabPanels.length > 0) {
                // 注册页面的切换逻辑
                tabPanels.forEach(panel => panel.classList.remove('active'));
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    console.log('成功激活注册页面标签页:', targetTab);
                } else {
                    console.error('未找到注册页面标签页:', targetTab);
                }
            } else if (document.querySelectorAll('.tab-content').length > 0) {
                // 设备转让页面的切换逻辑
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });
                
                // 显示对应的内容区域
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.style.display = 'block';
                    console.log('成功激活设备转让页面内容区域:', targetTab);
                } else {
                    console.error('未找到设备转让页面内容区域:', targetTab);
                }
            } else {
                // 设备工况页面的切换逻辑
                const sections = document.querySelectorAll('.section');
                sections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // 显示对应的外部内容区域
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.style.display = 'block';
                    console.log('成功激活设备工况页面内容区域:', targetTab);
                } else {
                    console.error('未找到设备工况页面内容区域:', targetTab);
                }
            }
        });
    });
    
    // 内部页签切换
    const innerTabButtons = document.querySelectorAll('.inner-tab-nav .tab-button');
    console.log('找到的内部标签按钮数量:', innerTabButtons.length);
    
    innerTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('点击了内部标签按钮:', button.textContent.trim());
            // 移除所有内部按钮的active类
            innerTabButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前按钮添加active类
            button.classList.add('active');
            
            // 获取目标标签页ID
            const targetTab = button.getAttribute('data-tab');
            console.log('目标内部标签页ID:', targetTab);
            
            // 隐藏所有内部内容区域
            const innerTabContents = document.querySelectorAll('.inner-tab-panel');
            innerTabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // 显示对应的内部内容区域
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.style.display = 'block';
                console.log('成功激活内部标签页内容:', targetTab);
            } else {
                console.error('未找到内部标签页内容:', targetTab);
            }
        });
    });
}

function loadPage(pageName) {
    console.log('开始加载页面:', pageName);
    console.log('当前页面URL:', window.location.href);
    console.log('当前页面协议:', window.location.protocol);
    
    const currentProtocol = window.location.protocol;
    
    // 构建页面路径
    let htmlPath = '';
    
    // 特殊处理投诉建议页面
    if (pageName === 'suggestions') {
        console.log('处理投诉建议页面加载');
    }
    
    if (currentProtocol === 'file:') {
        // file:///协议，使用基于当前文件位置的绝对路径
        console.log('使用file:///协议，构建基于当前文件位置的路径');
        
        // 获取当前index.html的目录路径
        const currentPath = window.location.href;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        console.log('当前文件基础路径:', basePath);
        
        switch (pageName) {
            case 'register':
                htmlPath = basePath + 'functions/base/register.html';
                break;
            case 'username-password':
                htmlPath = basePath + 'functions/base/login.html';
                break;
            case 'change-password':
                htmlPath = basePath + 'functions/base/change_password.html';
                break;
            case 'account-cancel':
                htmlPath = basePath + 'functions/base/account_cancel.html';
                break;
            case 'equipment_operating_conditions':
                htmlPath = basePath + 'common_functions/equipment_operating_conditions.html';
                break;
            case 'device-transfer':
            case 'device-transfer-common':
                htmlPath = basePath + 'common_functions/equipment_transfer.html';
                break;
            case 'work-order-approval':
            case 'work-order-approval-common':
                htmlPath = basePath + 'common_functions/work_order_approval.html';
                break;
            case 'profile':
            case 'calendar':
            case 'points':
            case 'checkin':
                htmlPath = basePath + `functions/my/${pageName}.html`;
                break;
            case 'suggestions':
                htmlPath = basePath + 'functions/my/suggestions.html';
                break;
            case 'message-center':
                htmlPath = basePath + 'functions/my/message_center.html';
                break;
            case 'parts-orders':
                htmlPath = basePath + 'functions/my/parts_orders.html';
                break;
            case 'parts-orders-new':
                htmlPath = basePath + 'functions/my/parts_orders_new.html';
                break;
            case 'my-bills':
                htmlPath = basePath + 'functions/my/my_bills.html';
                break;
            case 'system-settings':
                htmlPath = basePath + 'functions/my/system_settings.html';
                break;
            case 'maintenance-reminder':
                htmlPath = basePath + 'functions/my/maintenance_reminder.html';
                break;
            case 'my-authorization':
            case 'my-authorization-common':
                htmlPath = basePath + `functions/my/my_authorization.html`;
                break;
            case 'my-address':
                htmlPath = basePath + 'functions/my/my_address.html';
                break;
            case 'communication-module':
                htmlPath = basePath + 'functions/my/communication_module.html';
                break;
            case 'out-warranty':
                htmlPath = basePath + 'functions/service/out_warranty.html';
                break;
            case 'more-services':
                htmlPath = basePath + 'functions/service/more_services.html';
                break;
            case 'need-parts':
                htmlPath = basePath + 'functions/service/my_parts.html';
                break;
            case 'complaint':
                htmlPath = basePath + 'functions/service/complaint.html';
                break;
            case 'non-sany-repair':
                htmlPath = basePath + 'functions/service/non_sany_repair.html';
                break;
            case 'used-machine-authentication':
                htmlPath = basePath + 'functions/service/used_machine_authentication.html';
                break;
            case 'scan':
                htmlPath = basePath + 'functions/home/scan.html';
                break;
            case 'banner':
                htmlPath = basePath + 'functions/home/banner.html';
                break;
            case 'order-status':
                htmlPath = basePath + 'functions/home/order_status.html';
                break;
            case 'diamond-zone':
                htmlPath = basePath + 'functions/home/diamond_zone.html';
                break;
            case 'my-device':
            case 'my-device-my':
                htmlPath = basePath + 'functions/home/my_device.html';
                break;
            case 'hot-events-news':
                htmlPath = basePath + 'functions/home/hot_events_news.html';
                break;
            case 'search-followed-devices':
                htmlPath = basePath + 'functions/home/search_followed_devices.html';
                break;
            case 'little-bee':
                htmlPath = basePath + 'functions/home/bee.html';
                break;
            case 'repair-request':
            case 'repair-request-service':
            case 'repair-request-common':
                htmlPath = basePath + 'functions/home/repair_request.html';
                break;
            case 'maintenance':
            case 'maintenance-service':
            case 'maintenance-common':
                htmlPath = basePath + 'functions/home/maintenance.html';
                break;
            case 'online-service-common':
            case 'maintenance-code-common':
            case 'data-subscription-common':
                htmlPath = basePath + 'functions/service/more_services.html';
                break;
            case 'forum-common':
                htmlPath = basePath + 'functions/home/diamond_zone.html';
                break;
            case 'my-orders-my':
            case 'self-service-my':
                htmlPath = basePath + 'functions/service/more_services.html';
                break;
            default:
                htmlPath = basePath + `functions/base/${pageName}.html`;
                break;
        }
    } else {
        // http://或https://协议，使用绝对路径
        console.log('使用http协议，构建绝对路径');
        
        // 获取当前页面的完整URL
        const currentUrl = window.location.href;
        // 获取index.html所在的目录路径
        const basePath = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
        
        console.log('基础路径:', basePath);
        
        switch (pageName) {
            case 'register':
                htmlPath = basePath + 'functions/base/register.html';
                break;
            case 'username-password':
                htmlPath = basePath + 'functions/base/login.html';
                break;
            case 'change-password':
                htmlPath = basePath + 'functions/base/change_password.html';
                break;
            case 'account-cancel':
                htmlPath = basePath + 'functions/base/account_cancel.html';
                break;
            case 'equipment_operating_conditions':
                htmlPath = basePath + 'common_functions/equipment_operating_conditions.html';
                break;
            case 'device-transfer':
            case 'device-transfer-common':
                htmlPath = basePath + 'common_functions/equipment_transfer.html';
                break;
            case 'work-order-approval':
            case 'work-order-approval-common':
                htmlPath = basePath + 'common_functions/work_order_approval.html';
                break;
            case 'profile':
            case 'calendar':
            case 'points':
            case 'checkin':
                htmlPath = basePath + `functions/my/${pageName}.html`;
                break;
            case 'suggestions':
                htmlPath = basePath + 'functions/my/suggestions.html';
                break;
            case 'message-center':
                htmlPath = basePath + 'functions/my/message_center.html';
                break;
            case 'parts-orders':
                htmlPath = basePath + 'functions/my/parts_orders.html';
                break;
            case 'parts-orders-new':
                htmlPath = basePath + 'functions/my/parts_orders_new.html';
                break;
            case 'my-bills':
                htmlPath = basePath + 'functions/my/my_bills.html';
                break;
            case 'system-settings':
                htmlPath = basePath + 'functions/my/system_settings.html';
                break;
            case 'maintenance-reminder':
                htmlPath = basePath + 'functions/my/maintenance_reminder.html';
                break;
            case 'my-authorization':
            case 'my-authorization-common':
                htmlPath = basePath + 'functions/my/my_authorization.html';
                break;
            case 'my-address':
                htmlPath = basePath + 'functions/my/my_address.html';
                break;
            case 'communication-module':
                htmlPath = basePath + 'functions/my/communication_module.html';
                break;
            case 'out-warranty':
                htmlPath = basePath + 'functions/service/out_warranty.html';
                break;
            case 'more-services':
                htmlPath = basePath + 'functions/service/more_services.html';
                break;
            case 'need-parts':
                htmlPath = basePath + 'functions/service/my_parts.html';
                break;
            case 'complaint':
                htmlPath = basePath + 'functions/service/complaint.html';
                break;
            case 'non-sany-repair':
                htmlPath = basePath + 'functions/service/non_sany_repair.html';
                break;
            case 'used-machine-authentication':
                htmlPath = basePath + 'functions/service/used_machine_authentication.html';
                break;
            case 'scan':
                htmlPath = basePath + 'functions/home/scan.html';
                break;
            case 'banner':
                htmlPath = basePath + 'functions/home/banner.html';
                break;
            case 'order-status':
                htmlPath = basePath + 'functions/home/order_status.html';
                break;
            case 'diamond-zone':
                htmlPath = basePath + 'functions/home/diamond_zone.html';
                break;
            case 'my-device':
            case 'my-device-my':
                htmlPath = basePath + 'functions/home/my_device.html';
                break;
            case 'hot-events-news':
                htmlPath = basePath + 'functions/home/hot_events_news.html';
                break;
            case 'search-followed-devices':
                htmlPath = basePath + 'functions/home/search_followed_devices.html';
                break;
            case 'little-bee':
                htmlPath = basePath + 'functions/home/bee.html';
                break;
            case 'repair-request':
            case 'repair-request-service':
            case 'repair-request-common':
                htmlPath = basePath + 'functions/home/repair_request.html';
                break;
            case 'maintenance':
            case 'maintenance-service':
            case 'maintenance-common':
                htmlPath = basePath + 'functions/home/maintenance.html';
                break;
            case 'online-service-common':
            case 'maintenance-code-common':
            case 'data-subscription-common':
                htmlPath = basePath + 'functions/service/more_services.html';
                break;
            case 'forum-common':
                htmlPath = basePath + 'functions/home/diamond_zone.html';
                break;
            case 'my-orders-my':
            case 'self-service-my':
                htmlPath = basePath + 'functions/service/more_services.html';
                break;
            default:
                htmlPath = basePath + `functions/base/${pageName}.html`;
                break;
        }
    }
    
    console.log('构建的页面路径:', htmlPath);
    
    // 尝试使用fetch API加载HTML文件
    console.log('开始使用fetch API加载文件');
    
    fetch(htmlPath, {
        method: 'GET',
        mode: currentProtocol === 'file:' ? 'no-cors' : 'cors',
        cache: 'no-cache'
    })
    .then(response => {
        console.log('Fetch响应状态:', response.status);
        console.log('Fetch响应URL:', response.url);
        console.log('Fetch响应是否成功:', response.ok);
        
        // 对于file:///协议，即使response.ok为false，也尝试获取文本
        if (currentProtocol === 'file:') {
            return response.text().catch(() => {
                console.error('Fetch文本解析失败，尝试使用XMLHttpRequest');
                return null;
            });
        } else {
            if (!response.ok && response.status !== 304) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        }
    })
    .then(pageContent => {
        if (pageContent) {
            console.log('获取到的页面内容前100字符:', pageContent.substring(0, 100) + '...');
            
            // 更新内容区域
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                console.log('开始更新内容区域');
                // 预处理：把 PNG src 转为 data-src（WebP），在插入 DOM 前阻止图片立即加载
                const processedContent = preprocessHtml(pageContent);
                contentArea.innerHTML = `
                    <div id="${pageName}" class="page-container active">
                        <div class="page-content">
                            ${processedContent}
                        </div>
                    </div>
                `;
                console.log('内容区域更新完成');
                
                // 扫描新 DOM 中的 data-src 图片并注册 lazyload
                if (window.setupImageLazyLoad) window.setupImageLazyLoad();
                if (window.preloadVisibleImages) window.preloadVisibleImages();
                
                // 如果是注册页面、设备工况页面、设备转让页面、工单审批页面、修改密码页面、登录页面、账号注销页面、我的设备页面、我的授权页面、我的地址页面、通讯模组页面、保外服务收费标准页面、更多服务页面、我的配件页面、金刚区页面或热门活动&论坛头条页面，设置标签页切换功能
                if (pageName === 'register' || pageName === 'equipment_operating_conditions' || pageName === 'device-transfer' || pageName === 'device-transfer-common' || pageName === 'work-order-approval' || pageName === 'work-order-approval-common' || pageName === 'change-password' || pageName === 'username-password' || pageName === 'account-cancel' || pageName === 'my-device' || pageName === 'my-device-my' || pageName === 'my-authorization' || pageName === 'my-authorization-common' || pageName === 'my-address' || pageName === 'communication-module' || pageName === 'out-warranty' || pageName === 'more-services' || pageName === 'need-parts' || pageName === 'complaint' || pageName === 'non-sany-repair' || pageName === 'used-machine-authentication' || pageName === 'diamond-zone' || pageName === 'hot-events-news' || pageName === 'search-followed-devices' || pageName === 'repair-request' || pageName === 'repair-request-service' || pageName === 'repair-request-common' || pageName === 'maintenance' || pageName === 'maintenance-service' || pageName === 'maintenance-common' || pageName === 'online-service-common' || pageName === 'maintenance-code-common' || pageName === 'data-subscription-common' || pageName === 'forum-common' || pageName === 'my-orders-my' || pageName === 'self-service-my' || pageName === 'maintenance-reminder' || pageName === 'suggestions' || pageName === 'message-center' || pageName === 'parts-orders' || pageName === 'parts-orders-new' || pageName === 'my-bills' || pageName === 'system-settings') {
                    console.log('为页面设置标签页功能');
                    setupTabs();
                    
                    // 为常用功能菜单下的特定页面自动激活对应的标签页
                    if (pageName === 'online-service-common') {
                        setTimeout(() => {
                            const onlineServiceTab = document.querySelector('.tab-button[data-tab="online-service"]');
                            if (onlineServiceTab) {
                                onlineServiceTab.click();
                            }
                        }, 100);
                    } else if (pageName === 'maintenance-code-common') {
                        setTimeout(() => {
                            const maintenanceCodeTab = document.querySelector('.tab-button[data-tab="maintenance-code"]');
                            if (maintenanceCodeTab) {
                                maintenanceCodeTab.click();
                            }
                        }, 100);
                    } else if (pageName === 'data-subscription-common') {
                        setTimeout(() => {
                            const dataSubscriptionTab = document.querySelector('.tab-button[data-tab="data-subscription"]');
                            if (dataSubscriptionTab) {
                                dataSubscriptionTab.click();
                            }
                        }, 100);
                    } else if (pageName === 'forum-common') {
                        setTimeout(() => {
                            const forumTab = document.querySelector('.tab-button[data-tab="forum"]');
                            if (forumTab) {
                                forumTab.click();
                            }
                        }, 100);
                    } else if (pageName === 'my-orders-my') {
                        setTimeout(() => {
                            const myOrdersTab = document.querySelector('.tab-button[data-tab="my-orders"]');
                            if (myOrdersTab) {
                                myOrdersTab.click();
                            }
                        }, 100);
                    } else if (pageName === 'self-service-my') {
                        setTimeout(() => {
                            const selfServiceTab = document.querySelector('.tab-button[data-tab="self-service"]');
                            if (selfServiceTab) {
                                selfServiceTab.click();
                            }
                        }, 100);
                    }
                    
                    setTimeout(() => {
                        applyLazyLoad();
                    }, 150);
                } else {
                    setTimeout(() => {
                        applyLazyLoad();
                    }, 150);
                }
            } else {
                console.error('未找到内容区域');
            }
        } else {
            console.error('Fetch未获取到内容，尝试使用XMLHttpRequest');
            // 如果fetch失败，尝试使用XMLHttpRequest
            tryXMLHttpRequest(pageName, htmlPath, currentProtocol);
        }
    })
    .catch(error => {
        console.error('Fetch失败:', error);
        // 如果fetch失败，尝试使用XMLHttpRequest
        tryXMLHttpRequest(pageName, htmlPath, currentProtocol);
    });
}

// 尝试使用XMLHttpRequest加载文件
function tryXMLHttpRequest(pageName, htmlPath, currentProtocol) {
    console.log('开始使用XMLHttpRequest加载文件:', htmlPath);
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', htmlPath, true);
    
    // 对于http协议，添加缓存控制
    if (currentProtocol !== 'file:') {
        xhr.setRequestHeader('Cache-Control', 'no-cache');
    }
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('XHR响应状态:', xhr.status);
            console.log('XHR响应URL:', xhr.responseURL);
            console.log('XHR响应文本长度:', xhr.responseText.length);
            
            if (xhr.status === 200 || (currentProtocol === 'file:' && xhr.responseText)) {
                // 对于file:///协议，即使status不是200，只要有响应文本就认为成功
                const pageContent = xhr.responseText;
                console.log('XHR获取到的页面内容前100字符:', pageContent.substring(0, 100) + '...');
                
                // 更新内容区域
                const contentArea = document.querySelector('.content-area');
                if (contentArea) {
                    console.log('开始更新内容区域');
                    // 预处理：把 PNG src 转为 data-src（WebP），在插入 DOM 前阻止图片立即加载
                    const processedContent = preprocessHtml(pageContent);
                    contentArea.innerHTML = `
                        <div id="${pageName}" class="page-container active">
                            <div class="page-content">
                                ${processedContent}
                            </div>
                        </div>
                    `;
                    console.log('内容区域更新完成');
                    
                    // 扫描新 DOM 中的 data-src 图片并注册 lazyload
                    if (window.setupImageLazyLoad) window.setupImageLazyLoad();
                    if (window.preloadVisibleImages) window.preloadVisibleImages();
                    
                    // 如果是注册页面、设备工况页面、设备转让页面、工单审批页面、修改密码页面、登录页面、账号注销页面、我的设备页面、我的授权页面、我的地址页面、通讯模组页面、保外服务收费标准页面、更多服务页面、我的配件页面、投诉页面、非三一设备维修页面、金刚区页面、热门活动&论坛头条页面或搜索关注设备页面，设置标签页切换功能
                    if (pageName === 'register' || pageName === 'equipment_operating_conditions' || pageName === 'device-transfer' || pageName === 'device-transfer-common' || pageName === 'work-order-approval' || pageName === 'work-order-approval-common' || pageName === 'change-password' || pageName === 'username-password' || pageName === 'account-cancel' || pageName === 'my-device' || pageName === 'my-device-my' || pageName === 'my-authorization' || pageName === 'my-authorization-common' || pageName === 'my-address' || pageName === 'communication-module' || pageName === 'out-warranty' || pageName === 'more-services' || pageName === 'need-parts' || pageName === 'complaint' || pageName === 'non-sany-repair' || pageName === 'used-machine-authentication' || pageName === 'diamond-zone' || pageName === 'hot-events-news' || pageName === 'search-followed-devices' || pageName === 'repair-request' || pageName === 'repair-request-service' || pageName === 'repair-request-common' || pageName === 'maintenance' || pageName === 'maintenance-service' || pageName === 'maintenance-common' || pageName === 'online-service-common' || pageName === 'maintenance-code-common' || pageName === 'data-subscription-common' || pageName === 'forum-common' || pageName === 'my-orders-my' || pageName === 'self-service-my' || pageName === 'maintenance-reminder' || pageName === 'suggestions' || pageName === 'message-center' || pageName === 'parts-orders' || pageName === 'parts-orders-new' || pageName === 'my-bills' || pageName === 'system-settings') {
                        console.log('为页面设置标签页功能');
                        setupTabs();
                        
                        // 为常用功能菜单下的特定页面自动激活对应的标签页
                        if (pageName === 'online-service-common') {
                            setTimeout(() => {
                                const onlineServiceTab = document.querySelector('.tab-button[data-tab="online-service"]');
                                if (onlineServiceTab) {
                                    onlineServiceTab.click();
                                }
                            }, 100);
                        } else if (pageName === 'maintenance-code-common') {
                            setTimeout(() => {
                                const maintenanceCodeTab = document.querySelector('.tab-button[data-tab="maintenance-code"]');
                                if (maintenanceCodeTab) {
                                    maintenanceCodeTab.click();
                                }
                            }, 100);
                        } else if (pageName === 'data-subscription-common') {
                            setTimeout(() => {
                                const dataSubscriptionTab = document.querySelector('.tab-button[data-tab="data-subscription"]');
                                if (dataSubscriptionTab) {
                                    dataSubscriptionTab.click();
                                }
                            }, 100);
                        } else if (pageName === 'forum-common') {
                            setTimeout(() => {
                                const forumTab = document.querySelector('.tab-button[data-tab="forum"]');
                                if (forumTab) {
                                    forumTab.click();
                                }
                            }, 100);
                        } else if (pageName === 'my-orders-my') {
                            setTimeout(() => {
                                const myOrdersTab = document.querySelector('.tab-button[data-tab="my-orders"]');
                                if (myOrdersTab) {
                                    myOrdersTab.click();
                                }
                            }, 100);
                        } else if (pageName === 'self-service-my') {
                            setTimeout(() => {
                                const selfServiceTab = document.querySelector('.tab-button[data-tab="self-service"]');
                                if (selfServiceTab) {
                                    selfServiceTab.click();
                                }
                            }, 100);
                        }
                    }
                } else {
                    console.error('未找到内容区域');
                }
            } else {
                console.error('XMLHttpRequest读取页面失败:', xhr.status, xhr.statusText);
                
                // 显示简洁的错误信息
                const contentArea = document.querySelector('.content-area');
                if (contentArea) {
                    contentArea.innerHTML = `
                        <div id="${pageName}" class="page-container active">
                            <div class="page-content">
                                <div class="error-page">
                                    <h1 class="page-title">页面加载失败</h1>
                                    <div class="section">
                                        <p>抱歉，页面加载失败。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('XMLHttpRequest网络错误');
        
        // 显示简洁的错误信息
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div id="${pageName}" class="page-container active">
                    <div class="page-content">
                        <div class="error-page">
                            <h1 class="page-title">页面加载失败</h1>
                            <div class="section">
                                <p>抱歉，页面加载失败。</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    };
    
    xhr.send();
}