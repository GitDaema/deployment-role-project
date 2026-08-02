const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// ==============================================================================
// 📌 [1단계 체크포인트] 기본 서버 포트 (PORT)
// -> Nginx 및 Docker Compose 5000번 포트 연결 기준
// ==============================================================================
const PORT = process.env.PORT || 5000;

// ==============================================================================
// 📌 [2단계 체크포인트] 신규 필수 환경변수 (JWT_SECRET, GEMINI_API_KEY)
// -> ⚠️ 필수 검수: 신규 기능(로그인, Gemini AI) 추가로 코드에 process.env.XXX가 새로 등장함!
// -> 배포 담당자는 backend/.env 및 .env.example에 해당 키 이름이 정확히 기입되어 있는지 검수하고 주입해야 함.
// ==============================================================================
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'default_key';

// ==============================================================================
// 📌 [1단계 체크포인트] DB 접속 호스트 (DB_HOST)
// -> 로컬 개발용 'localhost'를 도커 내부 서비스명 'db'로 동적 바인딩
// ==============================================================================
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'myapp'
});

// [1단계 라우트] 기본 유저 목록 API (/api/users)
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, data: results });
    });
});

// [2단계 신규 라우트] 로그인 API (/api/login)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    res.json({ success: true, token: `fake-jwt-token-with-${JWT_SECRET}` });
});

// [2단계 신규 라우트] Gemini AI 챗봇 API (/api/chat)
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    res.json({
        success: true,
        reply: `[Gemini AI 응답]: "${message}"에 대한 답변입니다. (Key: ${GEMINI_API_KEY.slice(0, 5)}***)`
    });
});

app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`);
});


