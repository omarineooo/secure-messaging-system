const express = require('express');
const path = require('path');
const { generateRSAKeys, encryptMessage, decryptMessage } = require('./encryption');

const app = express();
const port = 3000;

// إعدادات السيرفر عشان يفهم بيانات الـ JSON
app.use(express.json());
app.use(express.static(__dirname)); 

// توليد مفاتيح RSA عند تشغيل السيرفر
const keys = generateRSAKeys();

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// "نقطة النهاية" (API) للتشفير وفك التشفير
app.post('/process', (req, res) => {
    const { message } = req.body;
    
    try {
        // 1. التشفير
        const encrypted = encryptMessage(message, keys.publicKey);
        // 2. فك التشفير
        const decrypted = decryptMessage(encrypted, keys.privateKey);

        res.json({
            success: true,
            encrypted: encrypted,
            decrypted: decrypted
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`السيرفر شغال دلوقتي على http://localhost:${port}`);
});