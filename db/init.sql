-- ==============================================================================
-- 📌 [3단계 DevOps 체크포인트: 무중단 DDL 마이그레이션 변경점 파악]
-- ------------------------------------------------------------------------------
-- ⚠️ [운영 DB 대처 핵심 원칙]:
-- 1. 이미 구동 중인 운영 DB 컨테이너는 /docker-entrypoint-initdb.d/init.sql 이 재실행되지 않습니다!
-- 2. 따라서 배포 담당자는 개발자가 아래 추가한 신규 DDL 쿼리를 보고, 
--    운영 DB에 수동으로 직접 핫 주입(Hot-swap)해야 합니다:
--    - DDL 1: ALTER TABLE `users` ADD COLUMN `profile_img` VARCHAR(255) DEFAULT 'default.png';
--    - DDL 2: CREATE TABLE IF NOT EXISTS `chat_logs` (...) ENGINE=InnoDB ...;
-- ==============================================================================
SET NAMES utf8mb4;

-- 1. 사용자 테이블 (users - profile_img 컬럼 추가됨)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20) DEFAULT '010-0000-0000',
    `profile_img` VARCHAR(255) DEFAULT 'default.png'
);

-- 2. [3단계 신규 테이블] AI 챗봇 대화 기록 테이블 (chat_logs)
CREATE TABLE IF NOT EXISTS `chat_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_message` TEXT NOT NULL COMMENT '사용자 질문',
    `ai_reply` TEXT NOT NULL COMMENT 'AI 응답',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '대화 일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 초기 시드 데이터
INSERT INTO `users` (`name`, `role`, `phone`, `profile_img`) VALUES 
('김배포', 'DevOps', '010-1234-5678', 'devops.png'),
('이개발', 'Backend', '010-9876-5432', 'backend.png')
ON DUPLICATE KEY UPDATE `id` = `id`;

