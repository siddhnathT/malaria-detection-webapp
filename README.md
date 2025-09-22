# 🦠 Malaria Detection Web Application

## 📊 System Overview


graph TD
    A[📱 User Interface] --> B{🖼️ Input Method}
    B --> C[📤 Image Upload]
    B --> D[📷 Camera Capture]
    C --> E[🔍 Image Processing]
    D --> E
    E --> F[🧠 VGG19 AI Model]
    F --> G{🔬 Analysis Result}
    G --> H[✅ Healthy]
    G --> I[🦠 Infected]
    H --> J[📊 Confidence Score]
    I --> J

🎯 Quick Start
1️⃣ Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

cd frontend
npm install
npm start
<img width="1451" height="1609" alt="deepseek_mermaid_20250922_3cfb42" src="https://github.com/user-attachments/assets/55f478a5-f1d2-492f-a14a-1584fdd2084e" />
<img width="1897" height="866" alt="Screenshot 2025-09-13 193319" src="https://github.com/user-attachments/assets/6d63274f-a612-46c0-9a9f-be44e41ca321" />
<img width="1260" height="1314" alt="deepseek_mermaid_20250922_329c19" src="https://github.com/user-attachments/assets/a859b802-df1d-4b9d-a55b-60b2224c8fe6" />
<img width="1900" height="872" alt="Screenshot 2025-09-13 193357" src="https://github.com/user-attachments/assets/05fff45f-5bcf-4899-aef4-c735812c3372" />

🎯 Accuracy: 97.1% | ⚡ Real-time Analysis | 🌐 Web Accessible

*Built with React + Flask + VGG19 • Academic Project*


