from telegram.ext import Updater, MessageHandler, Filters
from telegram import Update
from telegram.ext.callbackcontext import CallbackContext

# توکن ربات شما
TOKEN = '7835890353:AAFkkSCg_Qm3Uk324HPP7GvPWVXmERAEmWg'

# شناسه‌های چت دو کاربر
USER1_ID = 6509291261
USER2_ID = 7460773653

# تابع اصلی برای انتقال پیام بین دو نفر
def relay_message(update: Update, context: CallbackContext):
    chat_id = update.message.chat_id
    text = update.message.text

    if chat_id == USER1_ID:
        context.bot.send_message(chat_id=USER2_ID, text=f"[User1]: {text}")
    elif chat_id == USER2_ID:
        context.bot.send_message(chat_id=USER1_ID, text=f"[User2]: {text}")
    else:
        context.bot.send_message(chat_id=chat_id, text="شما مجاز به استفاده از این ربات نیستید.")

def main():
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    # فقط پیام‌های متنی را منتقل می‌کنیم
    dp.add_handler(MessageHandler(Filters.text & ~Filters.command, relay_message))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()