import React, { useState } from 'react';

export default function App() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        if (!input) return;

        // ==============================================================================
        // 📌 [2단계 DevOps 체크포인트: 개발자 실수 검수 & 소통]
        // ------------------------------------------------------------------------------
        // ⚠️ [발견된 실수]: 아래 코드처럼 'http://localhost:5000/api/chat'으로 하드코딩되어 있습니다.
        // - 이 상태로 운영 서버(예: EC2 도메인)에 배포하면, 사용자의 웹 브라우저는 자기 로컬 PC의 5000번 포트로 
        //   API를 요청하게 되어 CORS 오류 및 Network Error가 100% 발생합니다!
        // - [배포 담당자 조치]: FE 개발자에게 상대 경로인 '/api/chat'으로 수정 후 다시 푸시해 달라고 역요청(소통)합니다.
        // ==============================================================================
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { user: input, ai: data.reply }]);
            setInput('');
        } catch (err) {
            alert('에러 발생: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>🤖 Gemini AI 챗봇 서비스 (React)</h1>
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                {messages.map((m, idx) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>
                        <p><strong>👨‍💻 사용자:</strong> {m.user}</p>
                        <p style={{ color: 'blue' }}><strong>🤖 AI:</strong> {m.ai}</p>
                        <hr />
                    </div>
                ))}
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="AI에게 질문해 보세요..."
                style={{ width: '70%', padding: '8px' }}
            />
            <button onClick={handleSend} style={{ padding: '8px 15px', marginLeft: '5px' }}>전송</button>
        </div>
    );
}

