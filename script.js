// 飞书表格配置
const FEISHU_CONFIG = {
    APP_TOKEN: 'KmHabMXAOauUrisAWUKc7XfpnVf',
    TABLE_ID: 'tbll9LLhReJLHu9s', // 用户注册登录信息表
    BASE_URL: 'https://open.feishu.cn/open-apis/bitable/v1'
};

// 工具函数
const utils = {
    // 显示提示消息
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    // 验证手机号格式
    validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    },

    // 格式化日期
    formatDate(date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    },

    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// 表单验证
const validator = {
    // 验证表单数据
    validateForm(formData) {
        const errors = [];

        if (!formData.phone) {
            errors.push('请输入手机号');
        } else if (!utils.validatePhone(formData.phone)) {
            errors.push('手机号格式不正确');
        }

        if (!formData.city) {
            errors.push('请选择所在城市');
        }

        if (!formData.businessUnit) {
            errors.push('请选择业务单元');
        }

        if (!formData.userType) {
            errors.push('请选择用户类型');
        }

        return errors;
    }
};

// 飞书API交互
const feishuAPI = {
    // 获取访问令牌（实际应用中应该从后端获取）
    async getAccessToken() {
        // 注意：这里只是示例，实际应用中应该从后端获取令牌
        // 为了演示目的，我们假设已经有了令牌
        return 'your-access-token-here';
    },

    // 查询用户是否已存在
    async checkUserExists(phone) {
        try {
            const response = await fetch(`${FEISHU_CONFIG.BASE_URL}/apps/${FEISHU_CONFIG.APP_TOKEN}/tables/${FEISHU_CONFIG.TABLE_ID}/records/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                },
                body: JSON.stringify({
                    filter: {
                        conjunction: 'and',
                        conditions: [{
                            field_name: '手机号码',
                            operator: 'is',
                            value: [phone]
                        }]
                    }
                })
            });

            const data = await response.json();
            return data.data?.items?.length > 0;
        } catch (error) {
            console.error('查询用户失败:', error);
            return false;
        }
    },

    // 创建新用户记录
    async createUser(userData) {
        try {
            const response = await fetch(`${FEISHU_CONFIG.BASE_URL}/apps/${FEISHU_CONFIG.APP_TOKEN}/tables/${FEISHU_CONFIG.TABLE_ID}/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                },
                body: JSON.stringify({
                    fields: {
                        '用户姓名': userData.name || '',
                        '手机号码': userData.phone,
                        '所在城市': userData.city,
                        '业务单元': userData.businessUnit,
                        '用户类型': userData.userType,
                        '最后登录时间': Date.now(),
                        '账户状态': '激活',
                        '微信号': userData.wechat || '',
                        '邮箱地址': userData.email || ''
                    }
                })
            });

            const data = await response.json();
            return data.code === 0;
        } catch (error) {
            console.error('创建用户失败:', error);
            return false;
        }
    },

    // 更新用户最后登录时间
    async updateLastLogin(phone) {
        try {
            // 首先查找用户记录
            const searchResponse = await fetch(`${FEISHU_CONFIG.BASE_URL}/apps/${FEISHU_CONFIG.APP_TOKEN}/tables/${FEISHU_CONFIG.TABLE_ID}/records/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                },
                body: JSON.stringify({
                    filter: {
                        conjunction: 'and',
                        conditions: [{
                            field_name: '手机号码',
                            operator: 'is',
                            value: [phone]
                        }]
                    }
                })
            });

            const searchData = await searchResponse.json();
            if (searchData.data?.items?.length > 0) {
                const recordId = searchData.data.items[0].record_id;
                
                // 更新最后登录时间
                const updateResponse = await fetch(`${FEISHU_CONFIG.BASE_URL}/apps/${FEISHU_CONFIG.APP_TOKEN}/tables/${FEISHU_CONFIG.TABLE_ID}/records/${recordId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await this.getAccessToken()}`
                    },
                    body: JSON.stringify({
                        fields: {
                            '最后登录时间': Date.now()
                        }
                    })
                });

                const updateData = await updateResponse.json();
                return updateData.code === 0;
            }
            return false;
        } catch (error) {
            console.error('更新登录时间失败:', error);
            return false;
        }
    }
};

// 表单处理
const formHandler = {
    // 初始化表单
    init() {
        const form = document.getElementById('loginForm');
        const phoneInput = document.getElementById('phone');
        const citySelect = document.getElementById('city');
        const businessUnitSelect = document.getElementById('businessUnit');
        const userTypeSelect = document.getElementById('userType');

        // 绑定表单提交事件
        form.addEventListener('submit', this.handleSubmit.bind(this));

        // 绑定手机号输入事件
        phoneInput.addEventListener('input', this.handlePhoneInput.bind(this));

        // 绑定社交登录按钮
        document.querySelector('.wechat-btn').addEventListener('click', this.handleWechatLogin.bind(this));
        document.querySelector('.qq-btn').addEventListener('click', this.handleQQLogin.bind(this));

        // 绑定注册链接
        document.querySelector('.register-link').addEventListener('click', this.handleRegister.bind(this));
    },

    // 处理表单提交
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            phone: formData.get('phone'),
            city: formData.get('city'),
            businessUnit: formData.get('businessUnit'),
            userType: formData.get('userType')
        };

        // 验证表单
        const errors = validator.validateForm(userData);
        if (errors.length > 0) {
            utils.showToast(errors[0], 'error');
            return;
        }

        // 显示加载状态
        const submitBtn = document.querySelector('.login-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
        submitBtn.disabled = true;

        try {
            // 检查用户是否存在
            const userExists = await feishuAPI.checkUserExists(userData.phone);
            
            if (userExists) {
                // 用户存在，更新最后登录时间
                await feishuAPI.updateLastLogin(userData.phone);
                utils.showToast('登录成功！', 'success');
                
                // 保存登录状态
                if (document.getElementById('rememberMe').checked) {
                    localStorage.setItem('loginData', JSON.stringify(userData));
                }
                
                // 模拟跳转到主页面
                setTimeout(() => {
                    window.location.href = '#dashboard';
                }, 1500);
            } else {
                // 用户不存在，创建新用户
                const createSuccess = await feishuAPI.createUser(userData);
                if (createSuccess) {
                    utils.showToast('注册成功，欢迎使用！', 'success');
                    
                    // 保存登录状态
                    if (document.getElementById('rememberMe').checked) {
                        localStorage.setItem('loginData', JSON.stringify(userData));
                    }
                    
                    // 模拟跳转到主页面
                    setTimeout(() => {
                        window.location.href = '#dashboard';
                    }, 1500);
                } else {
                    utils.showToast('注册失败，请稍后重试', 'error');
                }
            }
        } catch (error) {
            console.error('登录失败:', error);
            utils.showToast('登录失败，请检查网络连接', 'error');
        } finally {
            // 恢复按钮状态
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },

    // 处理手机号输入
    handlePhoneInput(e) {
        const phone = e.target.value;
        const inputWrapper = e.target.closest('.input-wrapper');
        
        if (phone && !utils.validatePhone(phone)) {
            inputWrapper.style.borderColor = '#f44336';
        } else {
            inputWrapper.style.borderColor = '#E2E8F0';
        }
    },

    // 处理微信登录
    handleWechatLogin(e) {
        e.preventDefault();
        utils.showToast('微信登录功能开发中...', 'info');
    },

    // 处理QQ登录
    handleQQLogin(e) {
        e.preventDefault();
        utils.showToast('QQ登录功能开发中...', 'info');
    },

    // 处理注册
    handleRegister(e) {
        e.preventDefault();
        utils.showToast('注册功能开发中...', 'info');
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    formHandler.init();
    
    // 如果有保存的登录数据，自动填充表单
    const savedLoginData = localStorage.getItem('loginData');
    if (savedLoginData) {
        try {
            const loginData = JSON.parse(savedLoginData);
            document.getElementById('phone').value = loginData.phone || '';
            document.getElementById('city').value = loginData.city || '';
            document.getElementById('businessUnit').value = loginData.businessUnit || '';
            document.getElementById('userType').value = loginData.userType || '';
            document.getElementById('rememberMe').checked = true;
        } catch (error) {
            console.error('加载保存的登录数据失败:', error);
        }
    }
});

// 添加一些交互效果
document.addEventListener('DOMContentLoaded', () => {
    // 输入框聚焦效果
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.input-wrapper').style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.closest('.input-wrapper').style.transform = 'translateY(0)';
        });
    });

    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 扩展Toast功能
utils.showToast = function(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    // 根据类型设置不同的图标
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    toast.innerHTML = `
        <span style="margin-right: 8px;">${icons[type] || icons.info}</span>
        ${message}
    `;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}; 