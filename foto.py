import cv2

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

# Resmi kaydet
dosya_adi = "yakalanan_resim.jpg"
cv2.imwrite(dosya_adi, kare)
print(f"{dosya_adi} olarak kaydedildi.")

# Kamerayı serbest bırak
kamera.release()
cv2.destroyAllWindows()