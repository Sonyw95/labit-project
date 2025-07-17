-- LAB_NAVIGATION 테이블 생성
CREATE TABLE LAB_NAVIGATION
(
    NAV_ID     NUMBER PRIMARY KEY,
    NAV_NAME   VARCHAR2(100) NOT NULL,
    NAV_URL    VARCHAR2(500),
    NAV_ICON   VARCHAR2(50),
    PARENT_ID  NUMBER,
    NAV_ORDER  NUMBER  DEFAULT 0,
    NAV_LEVEL  NUMBER  DEFAULT 1,
    IS_ACTIVE  CHAR(1) DEFAULT 'Y' CHECK (IS_ACTIVE IN ('Y', 'N')),
    CREATED_AT DATE    DEFAULT SYSDATE,
    UPDATED_AT DATE    DEFAULT SYSDATE,
    CONSTRAINT FK_NAVIGATION_PARENT FOREIGN KEY (PARENT_ID) REFERENCES LAB_NAVIGATION (NAV_ID)
);

commit;

-- 시퀀스 생성
CREATE SEQUENCE seq_lab_navigation
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- 인덱스 생성
CREATE INDEX IDX_NAVIGATION_PARENT ON LAB_NAVIGATION (parent_id);
CREATE INDEX IDX_NAVIGATION_ORDER ON LAB_NAVIGATION (nav_order);
CREATE INDEX IDX_NAVIGATION_LEVEL ON LAB_NAVIGATION (nav_level);

-- 샘플 데이터 삽입
INSERT INTO LAB_NAVIGATION (nav_id, nav_name, nav_url, nav_icon, parent_id, nav_order, nav_level)
VALUES (1, '대시보드', '/dashboard', 'dashboard', NULL, 1, 1),
       (2, '사용자 관리', NULL, 'users', NULL, 2, 1),
       (3, '사용자 목록', '/users', 'list', 2, 1, 2),
       (4, '사용자 등록', '/users/create', 'user-plus', 2, 2, 2),
       (5, '권한 관리', NULL, 'shield', NULL, 3, 1),
       (6, '역할 관리', '/roles', 'settings', 5, 1, 2),
       (7, '권한 설정', '/permissions', 'lock', 5, 2, 2),
       (8, '시스템 관리', NULL, 'settings', NULL, 4, 1),
       (9, '코드 관리', '/codes', 'code', 8, 1, 2),
       (10, '로그 관리', '/logs', 'file-text', 8, 2, 2),
       (11, '백업 관리', '/backup', 'database', 8, 3, 2);

COMMIT;