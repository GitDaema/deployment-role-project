const express = require('express');
const mysql = require('mysql2');

const app = express();

// ==============================================================================
// 📌 [DevOps 체크포인트 1] 서버 포트 (PORT)
// -> 백엔드가 열어두는 포트입니다. 
// -> 나중에 Dockerfile의 `EXPOSE 5000` 및 docker-compose.yml, nginx.conf (proxy_pass http://backend:5000)에서 이 포트번호를 똑같이 써야 합니다.
// ==============================================================================
const PORT = process.env.PORT || 5000;

// ==============================================================================
// 📌 [DevOps 체크포인트 2] 데이터베이스 접속 정보 (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
// -> 백엔드가 DB에 접속하기 위한 환경변수들입니다.
// -> ⚠️ 필수 검수: DB_HOST가 'localhost'로 하드코딩되어 있다면 컨테이너 통신이 실패합니다.
// -> 나중에 backend/.env 및 docker-compose.yml에서 DB_HOST=db (Docker 서비스명)로 주입해 주어야 합니다.
// ==============================================================================
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'myapp'
});

// ==============================================================================
// 📌 [DevOps 체크포인트 3] API 라우트 경로 (/api/users)
// -> 프론트엔드가 호출하는 백엔드 API 프리픽스(/api/)입니다.
// -> 나중에 frontend/nginx.conf의 `location /api/ { proxy_pass http://backend:5000/api/; }`로 전달됩니다.
// ==============================================================================
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, data: results });
    });
});

app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`);
});

