import random
import string
from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)

# PostgreSQL সংযোগ
conn = psycopg2.connect(
    dbname="user_management",  # আপনার ডাটাবেসের নাম
    user="postgres",           # PostgreSQL-এর ডিফল্ট সুপারইউজার
    password="4392",           # আপনি পূর্বে দেওয়া পাসওয়ার্ড
    host="localhost",          # লোকালহোস্ট
    port="5432"                # PostgreSQL ডিফল্ট পোর্ট
)
cursor = conn.cursor()

# রেফারেল কোড তৈরি ফাংশন
def generate_ref_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

# রেফারেল লিংক তৈরি
@app.route('/generate_ref_link', methods=['POST'])
def generate_ref_link():
    data = request.json
    user_id = data['user_id']
    username = data['username']

    # চেক করুন ইউজার আগে থেকেই আছে কিনা
    cursor.execute("SELECT ref_code FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()

    if not user:
        # নতুন রেফারেল কোড তৈরি এবং ডাটাবেসে সেভ
        ref_code = generate_ref_code()
        cursor.execute("INSERT INTO users (id, username, ref_code) VALUES (%s, %s, %s)", (user_id, username, ref_code))
        conn.commit()
        return jsonify({"message": "Referral link created successfully!", "ref_link": f"http://localhost:5000/register?ref={ref_code}"})
    else:
        return jsonify({"message": "User already has a referral link!", "ref_link": f"http://localhost:5000/register?ref={user[0]}"})

# নতুন ইউজার রেফারেল লিংক থেকে রেজিস্টার
@app.route('/register', methods=['GET'])
def register_user():
    ref_code = request.args.get('ref')
    username = request.args.get('username')

    # রেফারার খুঁজুন
    cursor.execute("SELECT id FROM users WHERE ref_code = %s", (ref_code,))
    referrer = cursor.fetchone()

    if referrer:
        referrer_id = referrer[0]
        new_user_id = random.randint(1000, 9999)  # নতুন ইউজারের ID তৈরি
        new_ref_code = generate_ref_code()

        # নতুন ইউজার সেভ করুন
        cursor.execute("INSERT INTO users (id, username, ref_code, referrer_id) VALUES (%s, %s, %s, %s)",
                       (new_user_id, username, new_ref_code, referrer_id))
        conn.commit()
        return jsonify({"message": "User registered successfully!", "user_id": new_user_id})
    else:
        return jsonify({"message": "Invalid referral code!"})

if __name__ == '__main__':
    app.run(debug=True)
