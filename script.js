document.addEventListener("DOMContentLoaded", () => {
    // تغییر تم دارک/لایت
    document.getElementById("theme-toggle").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // نمایش اخبار بدون باز شدن صفحه جدید
    document.querySelectorAll(".news-title").forEach(title => {
        title.addEventListener("click", () => {
            document.querySelectorAll(".news-content").forEach(content => {
                content.style.display = "none";
            });
            title.nextElementSibling.style.display = "block";
        });
    });

    // ارسال پیام به تلگرام
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const botToken = "توکن ربات";
            const chatId = "شناسه چت";

            const message = `📩 پیام جدید از سایت:
👤 نام: ${fullName.value}
📞 شماره تماس: ${phoneNumber.value}
💬 پیام: ${messageText.value}`;

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: chatId, text: message })
            });
        });
    }
});
