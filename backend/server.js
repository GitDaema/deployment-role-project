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


// [3단계 신규 라우트] 대화 처리 후 DB(chat_logs)에 대화 저장 로직 추가
// ==============================================================================
// 📌 [3단계 DevOps 체크포인트: DB 연동 에러 검수 및 마이그레이션 순서]
// -> 백엔드 코드에서 `INSERT INTO chat_logs` 테이블 쿼리를 실행합니다.
// -> 만약 배포 담당자가 운영 DB에 마이그레이션(`CREATE TABLE chat_logs`)을 먼저 적용하지 않고
//    백엔드만 배포하면, 챗봇 호출 시 500 Internal Server Error가 발생하게 됩니다.
// -> 따라서 배포 순서는 반드시: [1. 운영 DB DDL 핫 주입] -> [2. 백엔드 무중단 재배포] 여야 합니다!
// ==============================================================================
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const aiReply = `[Gemini AI 응답]: "${message}"에 대한 답변입니다. (Key: ${GEMINI_API_KEY.slice(0, 5)}***)`;
    // chat_logs 테이블에 INSERT
    const sql = 'INSERT INTO chat_logs (user_message, ai_reply) VALUES (?, ?)';
    db.query(sql, [message, aiReply], (err, result) => {
        if (err) {
            console.error('DB 저장 실패:', err.message);
            return res.status(500).json({ error: 'DB 대화 저장 에러: ' + err.message });
        }
        res.json({
            success: true,
            reply: aiReply,
            logId: result.insertId
        });
    });
});


app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`);
});


