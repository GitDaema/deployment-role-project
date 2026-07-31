# ==============================================================================
# 🛠️ [DevOps 실무 가이드] 프론트엔드 Dockerfile 선택 노하우
# ==============================================================================
# 📌 프로젝트 성격에 따른 Dockerfile 선택 기준:
# 1. Vanilla HTML/CSS/JS 또는 빌드본(dist/)만 있을 때 (현재 상태):
#    - 아래처럼 Nginx 런타임 이미지에 정적 파일만 COPY 하는 단일 스테이지 구성.
# 2. React / Vue / Vite 소스 코드 전체가 올려져 있을 때:
#    - `templates/Dockerfile.react` 템플릿 사용!
#    - Stage 1: Node.js에서 `npm run build` 진행 -> Stage 2: Nginx로 dist 복사.
# ==============================================================================

FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

