import React, { useState } from 'react';

export default function App() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        if (!input) return;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                alert('에러: ' + (data.error || '응답 실패'));
                return;
            }
            setMessages(prev => [...prev, { user: input, ai: data.reply, logId: data.logId }]);
            setInput('');
        } catch (err) {
            alert('에러 발생: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>🤖 Gemini AI 챗봇 서비스 (5단계: CI/CD 무중단 자동 배포 완료! 🎉)</h1>
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                {messages.map((m, idx) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>
                        <p><strong>👨‍💻 사용자:</strong> {m.user}</p>
                        <p style={{ color: 'blue' }}>
                            <strong>🤖 AI:</strong> {m.ai} <small style={{ color: 'green' }}>(DB 저장 완료 ID: #{m.logId})</small>
                        </p>
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
