import time
import requests
import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '8841612635:AAGaKyz6iAES2CxmpCg2Sff-N3jQwQA7zc4')
BASE_URL = f"https://api.telegram.org/bot{TOKEN}"
ADMIN_CHAT_ID = int(os.environ.get('ADMIN_TELEGRAM_ID', 5636799086))  # Owner's Chat ID
WEB_APP_URL = "https://nur-qissa.uz"

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FEEDBACKS_FILE = os.path.join(BASE_DIR, 'data', 'feedbacks.json')
user_states = {}

def notify_owner(notification_text):
    """Sends notification EXCLUSIVELY to the owner's personal Telegram ID (5636799086)."""
    try:
        requests.post(f"{BASE_URL}/sendMessage", json={
            "chat_id": ADMIN_CHAT_ID,
            "text": notification_text,
            "parse_mode": "HTML"
        }, timeout=8)
    except Exception as e:
        print(f"Admin bildirishnoma xatosi: {e}", flush=True)

def save_feedback(user_name, contact, message, fb_type="taklif"):
    os.makedirs(os.path.join(BASE_DIR, 'data'), exist_ok=True)
    feedbacks = []
    if os.path.exists(FEEDBACKS_FILE):
        try:
            with open(FEEDBACKS_FILE, 'r', encoding='utf-8') as f:
                feedbacks = json.load(f)
        except:
            feedbacks = []
    
    entry = {
        "id": f"tg_{int(time.time()*1000)}",
        "type": fb_type,
        "name": user_name,
        "contact": contact,
        "message": message,
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    feedbacks.insert(0, entry)
    with open(FEEDBACKS_FILE, 'w', encoding='utf-8') as f:
        json.dump(feedbacks, f, ensure_ascii=False, indent=2)

    # Forward EXCLUSIVELY to the Owner (5636799086)
    type_badge = "💡 <b>[YANGI TAKLIF]</b>" if fb_type == "taklif" else "⚠️ <b>[YANGI SHIKOYAT]</b>"
    admin_msg = (
        f"🔔 {type_badge} (NurQissa AI)\n\n"
        f"👤 <b>Yuboruvchi:</b> {user_name}\n"
        f"📞 <b>Profil/Aloqa:</b> {contact}\n"
        f"🕒 <b>Vaqt:</b> {entry['created_at']}\n\n"
        f"📝 <b>Murojaat matni:</b>\n"
        f"<i>{message}</i>"
    )
    notify_owner(admin_msg)
    return entry

def send_message(chat_id, text, reply_markup=None):
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    try:
        r = requests.post(f"{BASE_URL}/sendMessage", json=payload, timeout=10)
        return r.json()
    except Exception as e:
        print(f"Xabar yuborishda xato: {e}", flush=True)
        return None

def answer_callback(callback_id, text=None):
    try:
        requests.post(f"{BASE_URL}/answerCallbackQuery", json={
            "callback_query_id": callback_id,
            "text": text or ""
        }, timeout=5)
    except:
        pass

def start_polling():
    print(f"🚀 Maxfiy Taklif va Shikoyatlar Boti (@nurqissaaa_bot) ishga tushdi... (Admin: {ADMIN_CHAT_ID})", flush=True)
    offset = None
    
    while True:
        try:
            params = {"timeout": 30}
            if offset:
                params["offset"] = offset
            
            res = requests.get(f"{BASE_URL}/getUpdates", params=params, timeout=35)
            data = res.json()
            
            if data.get("ok"):
                for update in data.get("result", []):
                    offset = update["update_id"] + 1
                    
                    # 1. Handle Callback Query (Buttons)
                    if "callback_query" in update:
                        cb = update["callback_query"]
                        cb_id = cb["id"]
                        chat_id = cb["message"]["chat"]["id"]
                        cb_data = cb.get("data", "")
                        
                        answer_callback(cb_id)
                        
                        if cb_data == "btn_taklif":
                            user_states[chat_id] = "waiting_taklif"
                            send_message(
                                chat_id, 
                                "💡 <b>Taklifingizni yozing:</b>\n\n"
                                "NurQissa AI platformasini yaxshilash yoki yangi imkoniyatlar bo'yicha taklifingizni yozib yuboring 👇"
                            )
                        elif cb_data == "btn_shikoyat":
                            user_states[chat_id] = "waiting_shikoyat"
                            send_message(
                                chat_id, 
                                "⚠️ <b>Shikoyat yoki muammoingizni yozing:</b>\n\n"
                                "Saytda duch kelgan xatolik yoki noqulaylik haqida batafsil yozib yuboring 👇"
                            )                    # 2. Handle Text Messages & Media
                    message = update.get("message")
                    if not message:
                        continue
                    
                    chat_id = message["chat"]["id"]
                    text = message.get("text", "").strip()
                    first_name = message.get("from", {}).get("first_name", "Foydalanuvchi")
                    username = message.get("from", {}).get("username", "")
                    contact_info = f"@{username}" if username else f"ID: {chat_id}"

                    # Check for voice or audio files
                    audio_obj = message.get("voice") or message.get("audio")
                    if audio_obj:
                        file_id = audio_obj.get("file_id")
                        duration = audio_obj.get("duration", 0)
                        try:
                            file_res = requests.get(f"{BASE_URL}/getFile", params={"file_id": file_id}, timeout=10).json()
                            if file_res.get("ok"):
                                file_path = file_res["result"]["file_path"]
                                ext = os.path.splitext(file_path)[1] or (".ogg" if message.get("voice") else ".mp3")
                                samples_dir = os.path.join(BASE_DIR, 'data', 'voice_samples')
                                os.makedirs(samples_dir, exist_ok=True)
                                clean_name = first_name.replace(" ", "_").lower()
                                save_name = f"voice_{int(time.time())}_{clean_name}{ext}"
                                dest_path = os.path.join(samples_dir, save_name)

                                down_res = requests.get(f"https://api.telegram.org/file/bot{TOKEN}/{file_path}", timeout=30)
                                if down_res.status_code == 200:
                                    with open(dest_path, "wb") as f:
                                        f.write(down_res.content)
                                    print(f"🎤 Ovoz saqlandi: {dest_path}", flush=True)

                                notify_owner(
                                    f"🎤 <b>[YANGI OVOZLI XABAR]</b> (NurQissa AI)\n\n"
                                    f"👤 <b>Yuboruvchi:</b> {first_name} ({contact_info})\n"
                                    f"⏱ <b>Davomiyligi:</b> {duration} soniya\n"
                                    f"📁 <b>Saqlangan fayl:</b> <code>{save_name}</code>\n"
                                    f"🕒 <b>Vaqt:</b> {time.strftime('%Y-%m-%d %H:%M:%S')}"
                                )

                                send_message(chat_id, (
                                    f"🎤 <b>Ovozli xabaringiz qabul qilindi!</b>\n\n"
                                    f"Hurmatli <b>{first_name}</b>, audio yozuvingiz NurQissa AI ma'muriyatiga yetkazildi. Rahmat! 🙏"
                                ))
                                continue
                        except Exception as a_err:
                            print(f"Audio yuklash xatosi: {a_err}", flush=True)
                    
                    # Empty text guard
                    if not text:
                        if message.get("photo") or message.get("document"):
                            send_message(chat_id, "Iltimos, rasm yoki hujjat bilan birga taklif yoki shikoyat matnini ham yozib yuboring.")
                        continue

                    print(f"📩 [{first_name} ({contact_info})]: {text}", flush=True)
                    
                    # /start command
                    if text.startswith("/start"):
                        user_states.pop(chat_id, None)
                        welcome_text = (
                            f"✨ <b>Assalomu alaykum, {first_name}!</b>\n\n"
                            f"Ushbu bot <b>NurQissa AI</b> platformasi uchun <b>Taklif va Shikoyatlarni</b> qabul qilishga mo'ljallangan.\n\n"
                            f"Sizning fikringiz platformamizni yanada sifatli qilishda biz uchun juda muhim!\n\n"
                            f"Quyidagi tugmalardan birini tanlang yoki xabaringizni to'g'ridan-to'g'ri yozib yuboring 👇"
                        )
                        
                        markup = {
                            "inline_keyboard": [
                                [
                                    {
                                        "text": "💡 Taklif qoldirish",
                                        "callback_data": "btn_taklif"
                                    },
                                    {
                                        "text": "⚠️ Shikoyat bildirish",
                                        "callback_data": "btn_shikoyat"
                                    }
                                ]
                            ]
                        }
                        send_message(chat_id, welcome_text, markup)
                    
                    # /taklif command
                    elif text.startswith("/taklif"):
                        msg_body = text.replace("/taklif", "").strip()
                        if msg_body:
                            save_feedback(first_name, contact_info, msg_body, "taklif")
                            resp = (
                                f"💡 <b>Taklifingiz muvaffaqiyatli qabul qilindi!</b>\n\n"
                                f"Hurmatli <b>{first_name}</b>, qimmatli fikringiz uchun katta rahmat. "
                                f"Taklifingiz ma'muriyatimizga yetkazildi."
                            )
                            send_message(chat_id, resp)
                        else:
                            user_states[chat_id] = "waiting_taklif"
                            send_message(chat_id, "💡 <b>Marhamat, taklifingiz matnini yozib yuboring:</b>")

                    # /shikoyat command
                    elif text.startswith("/shikoyat"):
                        msg_body = text.replace("/shikoyat", "").strip()
                        if msg_body:
                            save_feedback(first_name, contact_info, msg_body, "shikoyat")
                            resp = (
                                f"⚠️ <b>Shikoyatingiz qayd etildi!</b>\n\n"
                                f"Hurmatli <b>{first_name}</b>, xabar berganingiz uchun tashakkur. "
                                f"Muammo ma'muriyatga yetkazildi va tez orada ko'rib chiqiladi."
                            )
                            send_message(chat_id, resp)
                        else:
                            user_states[chat_id] = "waiting_shikoyat"
                            send_message(chat_id, "⚠️ <b>Marhamat, muammo yoki shikoyatingizni yozib yuboring:</b>")

                    # /admin or /feedbacks command (ONLY ALLOWED FOR THE OWNER!)
                    elif text.startswith("/admin") or text.startswith("/feedbacks"):
                        if chat_id == ADMIN_CHAT_ID:
                            if os.path.exists(FEEDBACKS_FILE):
                                with open(FEEDBACKS_FILE, 'r', encoding='utf-8') as f:
                                    fbs = json.load(f)[:15]
                                if fbs:
                                    report = "📋 <b>Oxirgi Taklif va Shikoyatlar:</b>\n\n"
                                    for idx, item in enumerate(fbs, 1):
                                        t_icon = "💡" if item.get('type') == 'taklif' else "⚠️"
                                        entry_text = (
                                            f"{idx}. {t_icon} <b>[{item.get('type', 'taklif').upper()}]</b>\n"
                                            f"👤 Kimdan: {item.get('name')} ({item.get('contact')})\n"
                                            f"🕒 Vaqt: {item.get('created_at')}\n"
                                            f"📝 Matn: {item.get('message')}\n\n"
                                        )
                                        if len(report) + len(entry_text) > 3800:
                                            send_message(chat_id, report)
                                            report = ""
                                        report += entry_text
                                    if report:
                                        send_message(chat_id, report)
                                else:
                                    send_message(chat_id, "Hozircha hech qanday murojaat kelib tushmadi.")
                            else:
                                send_message(chat_id, "Hozircha hech qanday murojaat yo'q.")
                        else:
                            send_message(chat_id, "Taklif yoki shikoyat qoldirish uchun xabaringizni yozib yuboring.")

                    # Regular text messages from any user
                    else:
                        state = user_states.pop(chat_id, None)
                        
                        if state == "waiting_shikoyat":
                            fb_type = "shikoyat"
                        elif state == "waiting_taklif":
                            fb_type = "taklif"
                        else:
                            # Auto-detect from text
                            fb_type = "shikoyat" if any(w in text.lower() for w in ["xato", "ishlamayapti", "shikoyat", "muammo", "ochilmayapti", "error", "ayb", "buzilgan"]) else "taklif"
                        
                        # Save and forward EXCLUSIVELY to owner
                        save_feedback(first_name, contact_info, text, fb_type)
                        
                        type_name = "shikoyat va xabaringiz" if fb_type == "shikoyat" else "taklif va fikringiz"
                        resp = (
                            f"✅ <b>Murojaatingiz qabul qilindi!</b>\n\n"
                            f"Hurmatli <b>{first_name}</b>, siz yuborgan {type_name} "
                            f"<b>NurQissa AI</b> ma'muriyatiga yetkazildi.\n\n"
                            f"E'tiboringiz va platformamizni rivojlantirishga qo'shayotgan hissangiz uchun katta rahmat! 🙏"
                        )
                        
                        markup = {
                            "inline_keyboard": [
                                [
                                    {
                                        "text": "💡 Yana taklif yuborish",
                                        "callback_data": "btn_taklif"
                                    },
                                    {
                                        "text": "⚠️ Shikoyat bildirish",
                                        "callback_data": "btn_shikoyat"
                                    }
                                ]
                            ]
                        }
                        send_message(chat_id, resp, markup)
        except Exception as e:
            print(f"Polling xatosi: {e}", flush=True)
            time.sleep(3)

if __name__ == "__main__":
    start_polling()
