// Theme Toggle (کد قبلی)
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '🌞' : '🌒';
}

setTheme(prefersDarkScheme.matches);
prefersDarkScheme.addListener((e) => setTheme(e.matches));
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// News Management
async function loadNews() {
    try {
        const response = await fetch('news.json');
        const data = await response.json();
        displayNews(data.news);
    } catch (error) {
        console.error('Error loading news:', error);
        document.querySelector('.news-grid').innerHTML = '<p class="error-message">خطا در بارگذاری اخبار</p>';
    }
}

function formatDate(dateStr) {
    const parts = dateStr.split('/');
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return `${parts[2]} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
}

function displayNews(newsArray) {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    newsGrid.innerHTML = newsArray.map(news => `
        <article class="news-item" data-id="${news.id}">
            ${news.image ? `
                <div class="news-image">
                    <img src="images/${news.image}" alt="${news.title}" loading="lazy">
                </div>
            ` : ''}
            <div class="news-date">${formatDate(news.date)}</div>
            <h2>${news.title}</h2>
            <div class="news-content">
                <p class="news-summary">${news.summary}</p>
                <div class="news-full-content">${news.content}</div>
            </div>
            <button class="read-more">ادامه مطلب</button>
        </article>
    `).join('');

    // Add click handlers for news items
    document.querySelectorAll('.news-item').forEach(item => {
        const readMoreBtn = item.querySelector('.read-more');
        readMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            item.classList.toggle('expanded');
            readMoreBtn.textContent = item.classList.contains('expanded') ? 'بستن' : 'ادامه مطلب';
        });
    });
}

// Load news if we're on the main page
if (document.querySelector('.news-grid')) {
    loadNews();
}

// Contact form submission (کد قبلی)
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