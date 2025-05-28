import cv2
import os
import smtplib
from email.message import EmailMessage

# Fotoğraf çekme fonksiyonu
def capture_photo():
    desktop_path = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
    save_folder = os.path.join(desktop_path, 'phishing_photos')

    if not os.path.exists(save_folder):
        os.makedirs(save_folder)

    image_path = os.path.join(save_folder, 'captured.jpg')

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Kamera açılamadı.")
        return None

    ret, frame = cap.read()
    if not ret:
        print("Fotoğraf çekilemedi.")
        return None

    cv2.imwrite(image_path, frame)
    cap.release()
    print(f"📸 Fotoğraf kaydedildi: {image_path}")
    return image_path

# Mail gönderme fonksiyonu
def send_email(to_email, photo_path):
    EMAIL_ADDRESS = 'fredbloglar@gmail.com'
    EMAIL_PASSWORD = 'llhobkbihacubkkc'  # Gmail uygulama şifresini buraya yaz

    msg = EmailMessage()
    msg['Subject'] = '📢 Bilgi Yarışması Sürprizi'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email

    msg.set_content(f'Merhaba!\n\nFotoğrafınız başarıyla kaydedildi.\n'
                    f'Masaüstünüzde şu klasöre bakabilirsiniz:\n\n{photo_path}\n\n'
                    'Sürpriz için hemen göz atın! 😄')

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
        print(f"✅ {to_email} adresine mail gönderildi!")
    except Exception as e:
        print(f"❌ Mail gönderme hatası: {e}")

# Ana blok
if __name__ == '__main__':
    to_email = input("Göndermek istediğiniz e-posta adresini girin: ")

    photo_path = capture_photo()
    if photo_path:
        send_email(to_email, photo_path)
    else:
        print("Fotoğraf çekilemedi, mail gönderilmiyor.")
