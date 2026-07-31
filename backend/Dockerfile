# ==============================================================================
# 🛠️ [DevOps 실무 가이드] 백엔드 Dockerfile 작성 및 검수 가이드
# ==============================================================================
# 📌 복잡한 실제 프로젝트를 만났을 때 대처 요령:
# 1. 소스 언어 확인: Node.js(Alpine), Java/Spring(Temurin/Gradle), Python(slim/FastAPI) 등 
#    팀이 사용하는 언어에 맞춰 `templates/` 디렉터리의 템플릿 파일 하나를 고릅니다.
# 2. 실행 스크립트 확인: package.json의 "scripts" 항목(npm start) 또는 자바의 .jar, 
#    파이썬의 uvicorn 실행 구문을 확인하고 맨 아래 CMD / ENTRYPOINT를 맞춥니다.
# 3. 포트 확인: 백엔드가 수신 대기하는 포트(5000, 8080, 8000 등)를 EXPOSE에 적어줍니다.
# ==============================================================================

# ------------------------------------------------------------------------------
# 1단계: 의존성 설치 (Dependencies Stage)
# -> 소스 코드 변경 시 매번 라이브러리를 재다운로드하지 않도록 캐싱 레이어를 활용합니다.
# ------------------------------------------------------------------------------
FROM node:18-alpine AS deps
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# Production 전용 의존성만 설치
RUN npm ci --omit=dev && npm cache clean --force

# ------------------------------------------------------------------------------
# 2단계: 최종 실행 환경 (Runner Stage)
# -> 1단계에서 설치한 node_modules와 소스 코드만 가볍게 복사하여 실행합니다.
# ------------------------------------------------------------------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# deps Stage에서 설치된 production node_modules 복사
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY . .

# 보안 강화: root 계정이 아닌 비관리자 계정(node)으로 실행
USER node

# 📌 백엔드 개방 포트 (server.js의 PORT=5000과 일치)
EXPOSE 5000

# 📌 서버 실행 명령어 (package.json의 "start": "node server.js" 실행)
CMD ["npm", "start"]