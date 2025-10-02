// هشدار: توکن رو هاردکد نکن! برای تست موقت استفاده شده. بعد از تست، توکن رو invalidate کن.
const BOT_TOKEN = "8038811077:AAGPcwAlAgqXW4I1Y8niWe0IBJY0jzWFjXg"; // فوراً با BotFather توکن جدید بگیر!
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// متن پاسخ پیش‌فرض
const marriageLoanResponse = `
اطلاعات وام ازدواج:
- مبلغ وام: 300 میلیون تومان برای هر زوج
- شرایط: ایرانی بودن، ازدواج اول، داشتن ضامن معتبر
- مدارک مورد نیاز: شناسنامه، کارت ملی، عقدنامه
برای جزئیات بیشتر به سایت بانک مرکزی مراجعه کنید.
`;

// تابع برای ارسال پیام
async function sendMessage(chatId, text) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: "Markdown"
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Failed to send message");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// تابع برای هندل کردن آپدیت‌ها
async function handleUpdate(update) {
  const chatId = update.message?.chat?.id;
  const text = update.message?.text?.toLowerCase() || "";
  
  // چک کردن کلمات کلیدی
  if (text.includes("وام ازدواج") || text.includes("شرایط وام ازدواج") || text.includes("تسهیلات وام ازدواج")) {
    await sendMessage(chatId, marriageLoanResponse);
  }
}

// تابع برای تنظیم Webhook (باید دستی اجرا بشه)
async function setWebhook(webhookUrl) {
  const url = `${TELEGRAM_API}/setWebhook?url=${webhookUrl}`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log("Webhook set:", result);
  } catch (error) {
    console.error("Error setting webhook:", error);
  }
}

// برای Webhook (نیاز به سرور خارجی داره)
addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const request = event.request;
      if (request.method === "POST") {
        const update = await request.json();
        await handleUpdate(update);
        return new Response("OK", { status: 200 });
      }
      return new Response("Bot is running!", { status: 200 });
    })()
  );
});

// برای تست Polling (فقط در محیط غیر GitHub Pages)
async function pollUpdates() {
  let offset = 0;
  while (true) {
    try {
      const response = await fetch(`${TELEGRAM_API}/getUpdates?offset=${offset}`);
      const data = await response.json();
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          await handleUpdate(update);
          offset = update.update_id + 1;
        }
      }
    } catch (error) {
      console.error("Error polling updates:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 ثانیه صبر
  }
}

// برای تست: این خط رو در محیط Node.js (مثل Replit) فعال کن
// pollUpdates();
