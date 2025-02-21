// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '🌞' : '🌒';
}

// Initialize theme
setTheme(prefersDarkScheme.matches);

// Listen for system theme changes
prefersDarkScheme.addListener((e) => setTheme(e.matches));

// Theme toggle button
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Expandable news items
document.querySelectorAll('.news-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('expanded');
    });
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        const botToken = '6554434146:AAHNahL_2YGrlzmm-vvVwVikgf5mpheQoMk';
        const chatId = '5619969053';
        
        const message = `
📝 پیام جدید:
👤 نام: ${formData.name}
📞 تلفن: ${formData.phone}
💬 پیام: ${formData.message}
        `;

        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            if (response.ok) {
                alert('پیام شما با موفقیت ارسال شد.');
                contactForm.reset();
            } else {
                throw new Error('خطا در ارسال پیام');
            }
        } catch (error) {
            alert('متاسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.');
            console.error('Error:', error);
        }
    });
}