import smtplib
from email.message import EmailMessage

def send_email(to_email, photo_path):
    EMAIL_ADDRESS = 'fredbloglar@gmail.com'
    EMAIL_PASSWORD = 'llhobkbihacubkkc'  # Gmail uygulama şifresini buraya yaz

    msg = EmailMessage()
    msg['Subject'] = '📢 Bilgi Yarışması Sürprizi'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email

    msg.set_content(f'Merhaba!\n\nFotoğrafınız masaüstünüzde şu klasöre kaydedildi:\n\n{photo_path}\n\n'
                    'Sürpriz için hemen göz atın! 😄')

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
        print(f"✅ {to_email} adresine mail gönderildi!")
    except Exception as e:
        print(f"❌ Mail gönderme hatası: {e}")

if __name__ == '__main__':
    to_email = input("Göndermek istediğiniz e-posta adresini girin: ")

    # Masaüstü klasör yolu
    import os
    desktop_path = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop', 'phishing_photos')

    send_email(to_email, desktop_path)
