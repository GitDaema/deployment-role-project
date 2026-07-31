-- ==============================================================================
-- 📌 [DevOps 체크포인트 5] DB 문자 인코딩 (SET NAMES utf8mb4)
-- -> 한글 깨짐(Mojibake)을 방지하기 위한 유니코드 설정입니다.
-- -> docker-compose.yml의 mysql command (--character-set-server=utf8mb4)와 맞춰줍니다.
-- 📌 [DevOps 체크포인트 6] docker-entrypoint-initdb.d 자동 마운트
-- -> 나중에 docker-compose.yml에서 ./db/init.sql:/docker-entrypoint-initdb.d/init.sql 로 마운트하면
-- -> 컨테이너 최초 생성 시 이 SQL 스크립트가 자동 실행되어 아래 테이블과 데이터가 생성됩니다.
-- ==============================================================================
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20) DEFAULT '010-0000-0000'
);

INSERT INTO `users` (`name`, `role`, `phone`) VALUES 
('김배포', 'DevOps', '010-1234-5678'),
('이개발', 'Backend', '010-9876-5432');

