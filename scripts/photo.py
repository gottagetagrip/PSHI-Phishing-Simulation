import cv2
import os
from pathlib import Path
# Kamera cihazını başlat
kamera = cv2.VideoCapture(0)
# Eğer kamera açılamazsa hata mesajı ver ve çık
if not kamera.isOpened():
    print("Kamera açılamadı.")
    exit()
# Bir kare oku
ret, kare = kamera.read()
# Eğer kare okunamadıysa hata mesajı ver ve çık
if not ret:
    print("Kare okunamadı.")
    exit()
# Masaüstü yolunu al
desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
# quiz_picture klasörünün yolunu oluştur
quiz_picture_folder = os.path.join(desktop_path, "quiz_picture")
# Klasörü oluştur (eğer yoksa)
os.makedirs(quiz_picture_folder, exist_ok=True)
# Resmi kaydetme yolu
dosya_adi = os.path.join(quiz_picture_folder, "yakalanan_resim.jpg")
cv2.imwrite(dosya_adi, kare)
print(f"{dosya_adi} olarak kaydedildi.")
# Kamerayı serbest bırak
kamera.release()
cv2.destroyAllWindows()
