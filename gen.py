# generate_spa_csv_full.py
import csv
import random
from faker import Faker

fake = Faker("th_TH")  # ใช้ภาษาไทยสำหรับที่อยู่ realistic

# กำหนดจังหวัดและภาคให้หลากหลาย
provinces = [
    {"province": "Bangkok", "region": "Central"},
    {"province": "Chiang Mai", "region": "Northern"},
    {"province": "Chiang Rai", "region": "Northern"},
    {"province": "Phuket", "region": "Southern"},
    {"province": "Khon Kaen", "region": "Northeastern"},
    {"province": "Nakhon Ratchasima", "region": "Northeastern"},
    {"province": "Chonburi", "region": "Eastern"},
    {"province": "Rayong", "region": "Eastern"},
    {"province": "Songkhla", "region": "Southern"},
    {"province": "Surat Thani", "region": "Southern"},
    {"province": "Udon Thani", "region": "Northeastern"},
    {"province": "Lampang", "region": "Northern"},
    {"province": "Phitsanulok", "region": "Northern"},
    {"province": "Pattaya", "region": "Eastern"},
    {"province": "Nakhon Si Thammarat", "region": "Southern"}
]

num_rows = 100

def random_time(start=9, end=21):
    """Generate a random time in HH:mm format between start and end hours"""
    hour = random.randint(start, end-1)
    minute = random.choice([0, 15, 30, 45])
    return f"{hour:02d}:{minute:02d}"

with open("massageSpas.csv", mode="w", newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    # header
    writer.writerow(["name", "address", "district", "province", "postalCode", "tel", "region", "openTime", "closeTime"])
    
    for i in range(1, num_rows + 1):
        spa_name = f"Spa {fake.word()} {i}"
        address = f"{random.randint(1, 999)}/{random.randint(1,50)} {fake.street_name()}"
        district = fake.city_suffix()  # ใช้ city_suffix แทน district เพราะ Faker ไม่มี district จริง
        province_obj = random.choice(provinces)
        province = province_obj["province"]
        region = province_obj["region"]
        postal_code = str(random.randint(10000, 99999))
        tel = f"0{random.randint(600000000, 999999999)}"
        open_time = random_time(9, 12)   # ตัวอย่าง: เปิดระหว่าง 09:00-11:45
        close_time = random_time(17, 22) # ปิดระหว่าง 17:00-21:45
        
        writer.writerow([spa_name, address, district, province, postal_code, tel, region, open_time, close_time])

print("CSV file 'massageSpas.csv' generated successfully with 100 rows, multiple provinces, and open/close times!")
