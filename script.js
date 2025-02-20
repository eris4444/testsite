document.addEventListener("DOMContentLoaded", () => {
    // تغییر تم دارک/لایت
    const themeButton = document.getElementById("theme-toggle");
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    // بارگذاری تم ذخیره‌شده
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    // نمایش/پنهان کردن اخبار
    document.querySelectorAll(".news-item").forEach(news => {
        news.addEventListener("click", () => {
            news.classList.toggle("active");
        });
    });

    // مشخص کردن لینک فعال
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref === currentPage) {
            link.classList.add("active");
        }
    });
});