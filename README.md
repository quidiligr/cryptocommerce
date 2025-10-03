# 🪙 CryptoCommerce

CryptoCommerce is an open-source **crypto e-commerce platform** that unifies exchange, wallets, blockchain, and order/payment bookings into one seamless system.  
It is built with **Node.js, EJS, MongoDB, and Nginx** for speed, scalability, and production readiness.

---

##  Features
-  Secure **multi-currency wallets**
-  Built-in **exchange engine**
-  **E-commerce checkout** with crypto payments
-  **Order & payment booking** stored on blockchain
-  Merchant & customer dashboards
-  API endpoints for third-party integration
-  Production-ready with **Nginx reverse proxy**

---

##  Quick Start

### 1. Clone the repository
```bash
git clone https://gitlab.com/<your-namespace>/cryptocommerce.git
cd cryptocommerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the project root:
```ini
PORT=3000
MONGO_URI=mongodb://localhost:27017/cryptocommerce
SESSION_SECRET=supersecret
EXCHANGE_API_KEY=your_exchange_api_key
```

### 4. Run the application
```bash
npm start
```

By default, the app will run at:  
 http://localhost:3000

---

##  Nginx Configuration (Production)

Sample reverse proxy config (`/etc/nginx/sites-available/cryptocommerce`):

```nginx
server {
    listen 80;
    server_name cryptocommerce.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart Nginx:
```bash
ln -s /etc/nginx/sites-available/cryptocommerce /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

##  Tech Stack
- **Backend:** Node.js (Express)
- **Templating:** EJS
- **Database:** MongoDB
- **Reverse Proxy:** Nginx

---

## 🧪 Running Tests
```bash
npm test
```

---

##  Contributing
We welcome contributions!  

1. Fork the repo  
2. Create your feature branch:  
   ```bash
   git checkout -b feat/my-feature
   ```
3. Commit your changes:  
   ```bash
   git commit -m "feat: add new feature"
   ```
4. Push to branch:  
   ```bash
   git push origin feat/my-feature
   ```
5. Open a Merge Request on GitLab  

---

##  Security
For responsible disclosure of vulnerabilities, please contact:  
📧 security@cryptocommerce.com  

---

##  License
This project is licensed under the [MIT License](LICENSE).
