import os
from telegram.ext import Application, CommandHandler, MessageHandler, filters
from grok_api import translate_text  # فرض می‌کنیم API داخلی xAI برای ترجمه

# توکن از متغیر محیطی خوانده می‌شود (برای امنیت)
TOKEN = os.getenv('TELEGRAM_TOKEN', '8038811077:AAGPcwAlAgqXW4I1Y8niWe0IBJY0jzWFjXg')

async def start(update, context):
    """ارسال پیام خوش‌آمدگویی خودمونی"""
    await update.message.reply_text('سلام داداش! من ربات مترجمتم. هر چی بفرستی، به فارسی خودمونی ترجمه می‌کنم. بزن بریم! 😎')

async def translate(update, context):
    """ترجمه متن به فارسی خودمونی"""
    text = update.message.text
    try:
        # استفاده از API داخلی xAI برای ترجمه (بدون سانسور، خودمونی)
        translated = translate_text(text, target_language='fa', style='informal')
        await update.message.reply_text(translated)
    except Exception as e:
        await update.message.reply_text(f'اوپس! یه مشکلی پیش اومد: {str(e)}')

def main():
    """تابع اصلی برای راه‌اندازی ربات"""
    if not TOKEN:
        raise ValueError("توکن پیدا نشد! لطفاً توکن رو تو متغیرهای محیطی ست کن.")
    
    # ساخت اپلیکیشن ربات
    app = Application.builder().token(TOKEN).build()
    
    # افزودن هندلرها
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, translate))
    
    # شروع ربات با polling
    app.run_polling()

if __name__ == '__main__':
    main()
