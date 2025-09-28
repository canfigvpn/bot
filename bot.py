import os
from telegram.ext import Application, CommandHandler, MessageHandler, filters

# توکن از متغیر محیطی خوانده می‌شود (برای امنیت)
TOKEN = os.getenv('TELEGRAM_TOKEN', '8038811077:AAGPcwAlAgqXW4I1Y8niWe0IBJY0jzWFjXg')

async def start(update, context):
    """ارسال پیام خوش‌آمدگویی وقتی کاربر /start را اجرا می‌کند"""
    await update.message.reply_text('سلام! من ربات شما هستم. هر پیامی بفرستید، تکرار می‌کنم!')

async def echo(update, context):
    """تکرار پیام‌های متنی کاربر"""
    await update.message.reply_text(update.message.text)

def main():
    """تابع اصلی برای راه‌اندازی ربات"""
    if not TOKEN:
        raise ValueError("توکن پیدا نشد! لطفاً توکن را در متغیرهای محیطی تنظیم کنید.")
    
    # ساخت اپلیکیشن ربات
    app = Application.builder().token(TOKEN).build()
    
    # افزودن هندلرها
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    
    # شروع ربات با polling
    app.run_polling()

if __name__ == '__main__':
    main()
