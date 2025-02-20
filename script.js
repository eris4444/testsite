document.addEventListener("DOMContentLoaded", () => {
    // 🎨 تغییر تم دارک/لایت
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    // 📰 نمایش اخبار بدون باز شدن صفحه جدید
    document.querySelectorAll(".news-item").forEach(news => {
        news.addEventListener("click", () => {
            document.querySelectorAll(".news-content").forEach(content => {
                content.style.display = "none";
            });
            news.querySelector(".news-content").style.display = "block";
        });
    });

    // 📩 ارسال پیام به تلگرام
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const phoneNumber = document.getElementById("phoneNumber").value.trim();
            const messageText = document.getElementById("messageText").value.trim();
            const responseMessage = document.getElementById("responseMessage");

            if (!fullName || !phoneNumber || !messageText) {
                responseMessage.style.color = "red";
                responseMessage.innerText = "❌ لطفاً تمام فیلدها را پر کنید!";
                return;
            }

            const botToken = "6554434146:AAHNahL_2YGrlzmm-vvVwVikgf5mpheQoMk";
            const chatId = "5619969053";

            const message = `📩 پیام جدید از سایت:
👤 نام: ${fullName}
📞 شماره تماس: ${phoneNumber}
💬 پیام: ${messageText}`;

            try {
                const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chat_id: chatId, text: message })
                });

                if (response.ok) {
                    responseMessage.style.color = "green";
                    responseMessage.innerText = "✅ پیام شما ارسال شد!";
                    form.reset();
                } else {
                    throw new Error("ارسال پیام ناموفق بود!");
                }
            } catch (error) {
                responseMessage.style.color = "red";
                responseMessage.innerText = "❌ خطا در ارسال پیام. لطفاً فیلترشکن را روشن کنید!";
            }
        });
    }

    // 🍔 منوی واکنش‌گرا در موبایل
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("menu-active");
    });
});