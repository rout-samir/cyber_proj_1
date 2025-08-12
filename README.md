# SecuScan Labs

**SecuScan Labs** is an AI-powered **code vulnerability scanner** that analyzes your codebase, assigns a **security score** and **grade**, and provides detailed AI-generated improvement suggestions.  

Built for speed, scalability, and accessibility, SecuScan Labs is powered by **Cloudflare D1** for database storage, **Cloudflare R2** for secure file storage, and features a **fully responsive UI** made with **HTML, CSS, JavaScript, and Tailwind CSS**.

---

## 🚀 Features

- **📊 Code Security Scoring** – Receive a security score (0–100) and letter grade (A–F).
- **🤖 AI-Powered Recommendations** – Pinpoint vulnerabilities and get tailored suggestions.
- **💾 Cloudflare D1 Database** – Fast, lightweight, serverless database.
- **☁️ Cloudflare R2 Storage** – Secure, reliable storage for scan results and files.
- **🎨 Responsive Tailwind UI** – Works seamlessly on mobile, tablet, and desktop.
- **🌐 Browser-Based** – Accessible directly from any device, no installation needed.

---

## 🖥 Tech Stack

| Layer          | Technology                                   |
|----------------|----------------------------------------------|
| Frontend       | HTML, CSS, JavaScript, Tailwind CSS           |
| Backend        | Cloudflare Workers (Serverless Functions)     |
| Database       | Cloudflare D1                                 |
| Storage        | Cloudflare R2                                 |
| AI Processing  | Integrated AI model for vulnerability checks  |

---

## 📦 Installation (Local Development)

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/secuscan-labs.git
    cd secuscan-labs
    ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Add you Gemini API key

4. **Run locally**

   ```bash
   npm run dev
   ```

---

## 🖥 Usage

1. Upload your code files through the web UI.
2. Wait for SecuScan Labs to scan and analyze vulnerabilities.
3. View:

   * **Security Score**
   * **Grade**
   * **List of vulnerabilities**
   * **AI-generated improvement suggestions**
4. Download a detailed PDF report (optional).

---

## 🧠 How It Works

1. **File Upload** → Files are stored securely in **Cloudflare R2**.
2. **Static Analysis** → The system scans code for known vulnerability patterns.
3. **AI Evaluation** → AI analyzes potential weaknesses and suggests fixes.
4. **Result Storage** → Scan data and reports are saved in **Cloudflare D1**.
5. **Responsive Display** → Users can view results on any device with a responsive Tailwind-based UI.

---

## 📚 Supported Languages

* Python 🐍
* JavaScript / TypeScript ⚡
* Java ☕
* C / C++

---

## 📜 License

This project is licensed under the [MIT License](LICENSE.md).

> **SecuScan Labs** – Build secure software from day one.
