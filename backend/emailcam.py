from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import os
import smtplib
from email.message import EmailMessage

app = Flask(__name__)
CORS(app)

@app.route('/capture-and-email', methods=['POST'])
def capture_and_email():
    try:
        to_email = request.json.get('email')
        if not to_email:
            return jsonify({"error": "Email is required"}), 400

        kamera = None
        ret = False
        kare = None

        for cam_index in range(0, 11):
            kamera = cv2.VideoCapture(cam_index)
            if kamera.isOpened():
                ret, kare = kamera.read()
                if ret:
                    print(f"Camera found and frame captured at index {cam_index}")
                    break
                kamera.release()
            else:
                kamera.release()

        if not ret or kare is None:
            return jsonify({"error": "Kamera açılamadı veya kare okunamadı."}), 500

        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
        quiz_picture_folder = os.path.join(desktop_path, "quiz_picture")
        os.makedirs(quiz_picture_folder, exist_ok=True)
        dosya_adi = os.path.join(quiz_picture_folder, "yakalanan_resim.jpg")
        cv2.imwrite(dosya_adi, kare)
        kamera.release()
        cv2.destroyAllWindows()

        EMAIL_ADDRESS = 'gtusgmyo@gmail.com'
        EMAIL_PASSWORD = 'ejpoqckyyifpxmmt'

        msg = EmailMessage()
        msg['Subject'] = '📢 Bilgi Yarışması Sürprizi'
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = to_email
        msg.set_content(f'Merhaba!\n\nFotoğrafınız masaüstünüzde şu klasöre kaydedildi:\n\n{dosya_adi}\n\nFotoğrafınızı başka bir klasöre de kaydedebilirdik değil mi? 😄')

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)

        return jsonify({"message": f"Email sent to {to_email}!"}), 200

    except Exception as e:
        print(f"Error in /capture-and-email: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
