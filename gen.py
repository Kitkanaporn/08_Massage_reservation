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

with open("massageSpas.csv", mode="w", newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    # header
    writer.writerow(["name", "address", "district", "province", "postalCode", "tel", "region"])
    
    for i in range(1, num_rows + 1):
        spa_name = f"Spa {fake.word()} {i}"
        address = f"{random.randint(1, 999)}/{random.randint(1,50)} {fake.street_name()}"
        district = fake.district()  # ใช้ district ของ Faker
        province_obj = random.choice(provinces)
        province = province_obj["province"]
        region = province_obj["region"]
        postal_code = str(random.randint(10000, 99999))
        tel = f"0{random.randint(600000000, 999999999)}"
        
        writer.writerow([spa_name, address, district, province, postal_code, tel, region])

print("CSV file 'massageSpas.csv' generated successfully with 100 rows and multiple provinces!")
