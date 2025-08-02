-- ============================================================================
-- LAB_NAVIGATION 테이블 스키마 (Oracle Database)
-- ============================================================================

-- 1. 시퀀스 생성
CREATE SEQUENCE LAB_NAVIGATION_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 2. 테이블 생성
CREATE TABLE LAB_NAVIGATION
(
    ID            NUMBER(19)                          NOT NULL,
    LABEL         VARCHAR2(100)                       NOT NULL,
    HREF          VARCHAR2(255),
    PARENT_ID     NUMBER(19),
    SORT_ORDER    NUMBER(5)                           NOT NULL,
    DEPTH         NUMBER(3)                           NOT NULL,
    ICON          VARCHAR2(50),
    IS_ACTIVE     NUMBER(1) DEFAULT 1                 NOT NULL,
    DESCRIPTION   VARCHAR2(500),
    CREATED_DATE  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    MODIFIED_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 제약조건
    CONSTRAINT PK_LAB_NAVIGATION PRIMARY KEY (ID),
    CONSTRAINT FK_LAB_NAVIGATION_PARENT FOREIGN KEY (PARENT_ID) REFERENCES LAB_NAVIGATION (ID),
    CONSTRAINT CK_LAB_NAVIGATION_ACTIVE CHECK (IS_ACTIVE IN (0, 1)),
    CONSTRAINT CK_LAB_NAVIGATION_DEPTH CHECK (DEPTH > 0 AND DEPTH <= 10),
    CONSTRAINT CK_LAB_NAVIGATION_SORT CHECK (SORT_ORDER > 0)
);

-- 3. 인덱스 생성
CREATE INDEX IDX_LAB_NAVIGATION_PARENT ON LAB_NAVIGATION (PARENT_ID);
CREATE INDEX IDX_LAB_NAVIGATION_ACTIVE ON LAB_NAVIGATION (IS_ACTIVE);
CREATE INDEX IDX_LAB_NAVIGATION_SORT ON LAB_NAVIGATION (SORT_ORDER);
CREATE INDEX IDX_LAB_NAVIGATION_DEPTH ON LAB_NAVIGATION (DEPTH);
CREATE INDEX IDX_LAB_NAVIGATION_HREF ON LAB_NAVIGATION (HREF);

-- 4. 컬럼 주석 추가
COMMENT ON TABLE LAB_NAVIGATION IS '네비게이션 메뉴 관리 테이블';
COMMENT ON COLUMN LAB_NAVIGATION.ID IS '네비게이션 고유 ID (Primary Key)';
COMMENT ON COLUMN LAB_NAVIGATION.LABEL IS '메뉴 표시명';
COMMENT ON COLUMN LAB_NAVIGATION.HREF IS '메뉴 링크 URL (NULL인 경우 폴더 메뉴)';
COMMENT ON COLUMN LAB_NAVIGATION.PARENT_ID IS '부모 메뉴 ID (NULL인 경우 루트 메뉴)';
COMMENT ON COLUMN LAB_NAVIGATION.SORT_ORDER IS '메뉴 정렬 순서';
COMMENT ON COLUMN LAB_NAVIGATION.DEPTH IS '메뉴 계층 깊이 (1부터 시작)';
COMMENT ON COLUMN LAB_NAVIGATION.ICON IS '메뉴 아이콘명';
COMMENT ON COLUMN LAB_NAVIGATION.IS_ACTIVE IS '활성화 여부 (1: 활성, 0: 비활성)';
COMMENT ON COLUMN LAB_NAVIGATION.DESCRIPTION IS '메뉴 설명';
COMMENT ON COLUMN LAB_NAVIGATION.CREATED_DATE IS '생성일시';
COMMENT ON COLUMN LAB_NAVIGATION.MODIFIED_DATE IS '수정일시';

-- 5. 트리거 생성 (수정일시 자동 업데이트)
CREATE OR REPLACE TRIGGER TRG_LAB_NAVIGATION_UPDATE
    BEFORE UPDATE
    ON LAB_NAVIGATION
    FOR EACH ROW
BEGIN
    :NEW.MODIFIED_DATE := CURRENT_TIMESTAMP;
END;

-- ============================================================================
-- 초기 데이터 삽입
-- ============================================================================

-- 루트 메뉴들
INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, '홈', '/home', NULL, 1, 1, 'home', 1, '메인 홈페이지');

INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'Backend', NULL, NULL, 2, 1, 'server', 1, '백엔드 개발 관련 메뉴');

INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'Frontend', NULL, NULL, 3, 1, 'monitor', 1, '프론트엔드 개발 관련 메뉴');

-- Backend 하위 메뉴들
INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'Java', '/posts/java', 2, 1, 2, 'coffee', 1, 'Java 언어 학습 및 개발');

INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'Spring Boot', '/posts/spring-boot', 2, 2, 2, 'leaf', 1, 'Spring Boot 프레임워크');

INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'Database', NULL, 2, 3, 2, 'database', 1, '데이터베이스 관련');

-- Frontend 하위 메뉴들
INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'React', '/posts/react', 3, 1, 2, 'atom', 1, 'React 라이브러리');

INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'Vue.js', '/posts/vue', 3, 2, 2, 'triangle', 1, 'Vue.js 프레임워크');

INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'CSS/UI', NULL, 3, 3, 2, 'palette', 1, 'CSS 및 UI 프레임워크');

-- Database 하위 메뉴들 (3단계)
INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'Oracle', '/posts/oracle', 6, 1, 3, 'circle', 1, 'Oracle Database');

INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'JPA/Hibernate', '/posts/jpa', 6, 2, 3, 'layers', 1, 'JPA 및 Hibernate ORM');

-- CSS/UI 하위 메뉴들 (3단계)
INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'Mantine', '/posts/mantine', 10, 1, 3, 'components', 1, 'Mantine UI 라이브러리');

INSERT INTO LAB_NAVIGATION (ID, LABEL, HREF, PARENT_ID, SORT_ORDER, DEPTH, ICON, IS_ACTIVE, DESCRIPTION)
VALUES (LAB_NAVIGATION_SEQ.NEXTVAL, 'Tailwind CSS', '/posts/tailwind', 10, 2, 3, 'brush', 1, 'Tailwind CSS 프레임워크');

-- ============================================================================
-- 유용한 쿼리들
-- ============================================================================

-- 1. 전체 네비게이션 트리 조회 (계층 구조)
-- SELECT LEVEL,
--        LPAD(' ', (LEVEL - 1) * 4) || LABEL AS TREE_LABEL,
--        ID,
--        LABEL,
--        HREF,
--        PARENT_ID,
--        SORT_ORDER,
--        DEPTH,
--        ICON,
--        IS_ACTIVE
-- FROM LAB_NAVIGATION
-- WHERE IS_ACTIVE = 1
-- START WITH PARENT_ID IS NULL
-- CONNECT BY PRIOR ID = PARENT_ID
-- ORDER SIBLINGS BY SORT_ORDER;
--
-- -- 2. 특정 메뉴의 모든 하위 메뉴 조회
-- SELECT LEVEL,
--        LPAD(' ', (LEVEL - 1) * 2) || LABEL AS TREE_LABEL,
--        ID,
--        LABEL,
--        HREF
-- FROM LAB_NAVIGATION
-- WHERE IS_ACTIVE = 1
-- START WITH ID = 2 -- Backend 메뉴
-- CONNECT BY PRIOR ID = PARENT_ID
-- ORDER SIBLINGS BY SORT_ORDER;
--
-- -- 3. 특정 메뉴까지의 경로 조회 (Breadcrumb)
-- SELECT ID,
--        LABEL,
--        HREF,
--        LEVEL
-- FROM LAB_NAVIGATION
-- WHERE IS_ACTIVE = 1
-- START WITH ID = (SELECT ID FROM LAB_NAVIGATION WHERE HREF = '/posts/java')
-- CONNECT BY ID = PRIOR PARENT_ID
-- ORDER BY LEVEL;
--
-- -- 4. 깊이별 메뉴 개수 통계
-- SELECT DEPTH,
--        COUNT(*)                                     AS MENU_COUNT,
--        COUNT(CASE WHEN HREF IS NOT NULL THEN 1 END) AS LINK_COUNT,
--        COUNT(CASE WHEN HREF IS NULL THEN 1 END)     AS FOLDER_COUNT
-- FROM LAB_NAVIGATION
-- WHERE IS_ACTIVE = 1
-- GROUP BY DEPTH
-- ORDER BY DEPTH;
--
-- -- 5. 부모 메뉴별 하위 메뉴 개수
-- SELECT p.ID        AS PARENT_ID,
--        p.LABEL     AS PARENT_LABEL,
--        COUNT(c.ID) AS CHILD_COUNT
-- FROM LAB_NAVIGATION p
--          LEFT JOIN LAB_NAVIGATION c ON p.ID = c.PARENT_ID AND c.IS_ACTIVE = 1
-- WHERE p.IS_ACTIVE = 1
-- GROUP BY p.ID, p.LABEL
-- ORDER BY p.SORT_ORDER;

-- ============================================================================
-- 관리용 프로시저
-- ============================================================================

-- 메뉴 순서 재정렬 프로시저
CREATE OR REPLACE PROCEDURE PROC_REORDER_NAVIGATION_MENU(
    p_parent_id IN NUMBER DEFAULT NULL
) IS
    v_order NUMBER := 1;
BEGIN
    FOR menu_rec IN (
        SELECT ID
        FROM LAB_NAVIGATION
        WHERE (PARENT_ID = p_parent_id OR (PARENT_ID IS NULL AND p_parent_id IS NULL))
          AND IS_ACTIVE = 1
        ORDER BY SORT_ORDER, LABEL
        )
        LOOP
            UPDATE LAB_NAVIGATION
            SET SORT_ORDER = v_order
            WHERE ID = menu_rec.ID;

            v_order := v_order + 1;
        END LOOP;

    COMMIT;
END;

-- 메뉴 비활성화 프로시저 (하위 메뉴도 함께 비활성화)
CREATE OR REPLACE PROCEDURE PROC_DEACTIVATE_NAVIGATION_MENU(
    p_menu_id IN NUMBER
) IS
BEGIN
    -- 해당 메뉴와 모든 하위 메뉴 비활성화
    UPDATE LAB_NAVIGATION
    SET IS_ACTIVE = 0
    WHERE ID IN (SELECT ID
                 FROM LAB_NAVIGATION
                 START WITH ID = p_menu_id
                 CONNECT BY PRIOR ID = PARENT_ID);

    COMMIT;
END;

-- ============================================================================
-- 성능 최적화를 위한 VIEW
-- ============================================================================

-- 활성 메뉴만 보여주는 VIEW
CREATE OR REPLACE VIEW V_ACTIVE_NAVIGATION AS
SELECT ID,
       LABEL,
       HREF,
       PARENT_ID,
       SORT_ORDER,
       DEPTH,
       ICON,
       DESCRIPTION,
       CREATED_DATE,
       MODIFIED_DATE
FROM LAB_NAVIGATION
WHERE IS_ACTIVE = 1;

-- 트리 구조 VIEW
CREATE OR REPLACE VIEW V_NAVIGATION_TREE AS
SELECT LEVEL                             AS TREE_LEVEL,
       ID,
       LABEL,
       HREF,
       PARENT_ID,
       SORT_ORDER,
       DEPTH,
       ICON,
       DESCRIPTION,
       SYS_CONNECT_BY_PATH(LABEL, ' > ') AS FULL_PATH
FROM LAB_NAVIGATION
WHERE IS_ACTIVE = 1
START WITH PARENT_ID IS NULL
CONNECT BY PRIOR ID = PARENT_ID
ORDER SIBLINGS BY SORT_ORDER;


-- ============================================================================
-- 데이터 검증 쿼리
-- ============================================================================

-- 1. 고아 메뉴 검사 (존재하지 않는 부모를 참조하는 메뉴)
-- SELECT *
-- FROM LAB_NAVIGATION n1
-- WHERE n1.PARENT_ID IS NOT NULL
--   AND NOT EXISTS (SELECT 1
--                   FROM LAB_NAVIGATION n2
--                   WHERE n2.ID = n1.PARENT_ID);
--
-- -- 2. 순환 참조 검사
-- SELECT *
-- FROM LAB_NAVIGATION
-- WHERE ID = PARENT_ID;
--
-- -- 3. 깊이 불일치 검사
-- SELECT *
-- FROM (SELECT n.*,
--              LEVEL AS ACTUAL_LEVEL
--       FROM LAB_NAVIGATION n
--       WHERE IS_ACTIVE = 1
--       START WITH PARENT_ID IS NULL
--       CONNECT BY PRIOR ID = PARENT_ID)
-- WHERE DEPTH != ACTUAL_LEVEL;
--
-- COMMIT;





-- ============================================================================
-- LAB_USERS 테이블 스키마 (Oracle Database)
-- ============================================================================

-- 1. 시퀀스 생성
CREATE SEQUENCE LAB_USERS_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 2. 테이블 생성
CREATE TABLE LAB_USERS (
                           ID                  NUMBER(19)      NOT NULL,
                           KAKAO_ID            NUMBER(19)      NOT NULL,
                           EMAIL               VARCHAR2(255),
                           NICKNAME            VARCHAR2(100)   NOT NULL,
                           PROFILE_IMAGE       VARCHAR2(500),
                           ROLE                VARCHAR2(20)    DEFAULT 'USER' NOT NULL,
                           IS_ACTIVE           NUMBER(1)       DEFAULT 1 NOT NULL,
                           LAST_LOGIN_DATE     TIMESTAMP,
                           CREATED_DATE        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
                           MODIFIED_DATE       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    -- 제약조건
                           CONSTRAINT PK_LAB_USERS PRIMARY KEY (ID),
                           CONSTRAINT UK_LAB_USERS_KAKAO_ID UNIQUE (KAKAO_ID),
                           CONSTRAINT CK_LAB_USERS_ACTIVE CHECK (IS_ACTIVE IN (0, 1)),
                           CONSTRAINT CK_LAB_USERS_ROLE CHECK (ROLE IN ('USER', 'ADMIN', 'SUPER_ADMIN'))
);

-- 3. 인덱스 생성
CREATE INDEX IDX_LAB_USERS_KAKAO_ID ON LAB_USERS(KAKAO_ID);
CREATE INDEX IDX_LAB_USERS_EMAIL ON LAB_USERS(EMAIL);
CREATE INDEX IDX_LAB_USERS_NICKNAME ON LAB_USERS(NICKNAME);
CREATE INDEX IDX_LAB_USERS_ROLE ON LAB_USERS(ROLE);
CREATE INDEX IDX_LAB_USERS_ACTIVE ON LAB_USERS(IS_ACTIVE);
CREATE INDEX IDX_LAB_USERS_LAST_LOGIN ON LAB_USERS(LAST_LOGIN_DATE);

-- 4. 컬럼 주석 추가
COMMENT ON TABLE LAB_USERS IS '사용자 정보 관리 테이블';
COMMENT ON COLUMN LAB_USERS.ID IS '사용자 고유 ID (Primary Key)';
COMMENT ON COLUMN LAB_USERS.KAKAO_ID IS '카카오 사용자 고유 ID';
COMMENT ON COLUMN LAB_USERS.EMAIL IS '사용자 이메일 주소';
COMMENT ON COLUMN LAB_USERS.NICKNAME IS '사용자 닉네임';
COMMENT ON COLUMN LAB_USERS.PROFILE_IMAGE IS '프로필 이미지 URL';
COMMENT ON COLUMN LAB_USERS.ROLE IS '사용자 역할 (USER, ADMIN, SUPER_ADMIN)';
COMMENT ON COLUMN LAB_USERS.IS_ACTIVE IS '계정 활성화 여부 (1: 활성, 0: 비활성)';
COMMENT ON COLUMN LAB_USERS.LAST_LOGIN_DATE IS '최근 로그인 일시';
COMMENT ON COLUMN LAB_USERS.CREATED_DATE IS '계정 생성일시';
COMMENT ON COLUMN LAB_USERS.MODIFIED_DATE IS '정보 수정일시';

-- 5. 트리거 생성 (수정일시 자동 업데이트)
CREATE OR REPLACE TRIGGER TRG_LAB_USERS_UPDATE
    BEFORE UPDATE ON LAB_USERS
    FOR EACH ROW
BEGIN
    :NEW.MODIFIED_DATE := CURRENT_TIMESTAMP;
END;

-- ============================================================================
-- 초기 데이터 삽입 (테스트용 관리자 계정)
-- ============================================================================

-- 슈퍼 관리자 계정 (실제 카카오 ID로 교체 필요)
-- INSERT INTO LAB_USERS (
--     ID,
--     KAKAO_ID,
--     EMAIL,
--     NICKNAME,
--     PROFILE_IMAGE,
--     ROLE,
--     IS_ACTIVE,
--     LAST_LOGIN_DATE
-- ) VALUES (
--              LAB_USERS_SEQ.NEXTVAL,
--              1234567890, -- 실제 카카오 ID로 교체
--              'admin@example.com',
--              '시스템관리자',
--              NULL,
--              'SUPER_ADMIN',
--              1,
--              CURRENT_TIMESTAMP
--          );
--
-- -- 일반 관리자 계정 (테스트용)
-- INSERT INTO LAB_USERS (
--     ID,
--     KAKAO_ID,
--     EMAIL,
--     NICKNAME,
--     PROFILE_IMAGE,
--     ROLE,
--     IS_ACTIVE,
--     LAST_LOGIN_DATE
-- ) VALUES (
--              LAB_USERS_SEQ.NEXTVAL,
--              9876543210, -- 실제 카카오 ID로 교체
--              'manager@example.com',
--              '일반관리자',
--              NULL,
--              'ADMIN',
--              1,
--              CURRENT_TIMESTAMP
--          );

-- ============================================================================
-- 네비게이션과 사용자 권한 연결 테이블 (선택사항)
-- ============================================================================

-- 메뉴별 접근 권한 관리가 필요한 경우
CREATE TABLE LAB_NAVIGATION_ROLES (
                                      ID              NUMBER(19)      NOT NULL,
                                      NAVIGATION_ID   NUMBER(19)      NOT NULL,
                                      ROLE            VARCHAR2(20)    NOT NULL,
                                      CREATED_DATE    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,

                                      CONSTRAINT PK_LAB_NAVIGATION_ROLES PRIMARY KEY (ID),
                                      CONSTRAINT FK_NAV_ROLES_NAVIGATION FOREIGN KEY (NAVIGATION_ID) REFERENCES LAB_NAVIGATION(ID),
                                      CONSTRAINT CK_NAV_ROLES_ROLE CHECK (ROLE IN ('USER', 'ADMIN', 'SUPER_ADMIN')),
                                      CONSTRAINT UK_NAV_ROLES_NAV_ROLE UNIQUE (NAVIGATION_ID, ROLE)
);

CREATE SEQUENCE LAB_NAVIGATION_ROLES_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 네비게이션 권한 인덱스
CREATE INDEX IDX_NAV_ROLES_NAVIGATION ON LAB_NAVIGATION_ROLES(NAVIGATION_ID);
CREATE INDEX IDX_NAV_ROLES_ROLE ON LAB_NAVIGATION_ROLES(ROLE);

-- 테이블 주석
COMMENT ON TABLE LAB_NAVIGATION_ROLES IS '네비게이션 메뉴별 접근 권한 관리 테이블';
COMMENT ON COLUMN LAB_NAVIGATION_ROLES.ID IS '권한 설정 고유 ID';
COMMENT ON COLUMN LAB_NAVIGATION_ROLES.NAVIGATION_ID IS '네비게이션 메뉴 ID';
COMMENT ON COLUMN LAB_NAVIGATION_ROLES.ROLE IS '접근 가능한 역할';
COMMENT ON COLUMN LAB_NAVIGATION_ROLES.CREATED_DATE IS '권한 설정 생성일시';

-- 관리자 전용 메뉴 권한 설정 예시
INSERT INTO LAB_NAVIGATION_ROLES (ID, NAVIGATION_ID, ROLE)
VALUES (LAB_NAVIGATION_ROLES_SEQ.NEXTVAL,
        (SELECT ID FROM LAB_NAVIGATION WHERE LABEL = '관리자메뉴'),
        'ADMIN');

INSERT INTO LAB_NAVIGATION_ROLES (ID, NAVIGATION_ID, ROLE)
VALUES (LAB_NAVIGATION_ROLES_SEQ.NEXTVAL,
        (SELECT ID FROM LAB_NAVIGATION WHERE LABEL = '관리자메뉴'),
        'SUPER_ADMIN');

-- ============================================================================
-- 유용한 쿼리들
-- ============================================================================

-- 1. 전체 사용자 목록 (활성 사용자만)
-- SELECT
--     ID,
--     KAKAO_ID,
--     EMAIL,
--     NICKNAME,
--     ROLE,
--     LAST_LOGIN_DATE,
--     CREATED_DATE
-- FROM LAB_USERS
-- WHERE IS_ACTIVE = 1
-- ORDER BY CREATED_DATE DESC;
--
-- -- 2. 역할별 사용자 수 통계
-- SELECT
--     ROLE,
--     COUNT(*) AS USER_COUNT,
--     COUNT(CASE WHEN IS_ACTIVE = 1 THEN 1 END) AS ACTIVE_COUNT,
--     COUNT(CASE WHEN IS_ACTIVE = 0 THEN 1 END) AS INACTIVE_COUNT
-- FROM LAB_USERS
-- GROUP BY ROLE
-- ORDER BY
--     CASE ROLE
--         WHEN 'SUPER_ADMIN' THEN 1
--         WHEN 'ADMIN' THEN 2
--         WHEN 'USER' THEN 3
--         END;
--
-- -- 3. 최근 로그인한 사용자들 (최근 7일)
-- SELECT
--     NICKNAME,
--     EMAIL,
--     ROLE,
--     LAST_LOGIN_DATE
-- FROM LAB_USERS
-- WHERE LAST_LOGIN_DATE >= CURRENT_TIMESTAMP - INTERVAL '7' DAY
--   AND IS_ACTIVE = 1
-- ORDER BY LAST_LOGIN_DATE DESC;
--
-- -- 4. 특정 사용자의 접근 가능한 네비게이션 메뉴 조회
-- WITH USER_ROLE AS (
--     SELECT ROLE FROM LAB_USERS WHERE KAKAO_ID = :kakao_id
-- )
-- SELECT DISTINCT
--     n.ID,
--     n.LABEL,
--     n.HREF,
--     n.PARENT_ID,
--     n.SORT_ORDER,
--     n.DEPTH,
--     n.ICON
-- FROM LAB_NAVIGATION n
--          LEFT JOIN LAB_NAVIGATION_ROLES nr ON n.ID = nr.NAVIGATION_ID
-- WHERE n.IS_ACTIVE = 1
--   AND (
--     nr.ROLE IS NULL  -- 권한 제한이 없는 메뉴
--         OR nr.ROLE = (SELECT ROLE FROM USER_ROLE)  -- 사용자 역할에 맞는 메뉴
--         OR (SELECT ROLE FROM USER_ROLE) IN ('ADMIN', 'SUPER_ADMIN')  -- 관리자는 모든 메뉴 접근
--     )
-- ORDER BY n.SORT_ORDER, n.ID;
--
-- -- 5. 비활성 사용자 정리 (30일 이상 미로그인)
-- SELECT
--     ID,
--     NICKNAME,
--     EMAIL,
--     LAST_LOGIN_DATE,
--     CREATED_DATE
-- FROM LAB_USERS
-- WHERE IS_ACTIVE = 1
--   AND (
--     LAST_LOGIN_DATE < CURRENT_TIMESTAMP - INTERVAL '30' DAY
--         OR LAST_LOGIN_DATE IS NULL
--     )
--   AND CREATED_DATE < CURRENT_TIMESTAMP - INTERVAL '30' DAY;

-- ============================================================================
-- 관리용 프로시저
-- ============================================================================

-- 사용자 비활성화 프로시저
CREATE OR REPLACE PROCEDURE PROC_DEACTIVATE_USER(
    p_user_id IN NUMBER
) IS
BEGIN
    UPDATE LAB_USERS
    SET IS_ACTIVE = 0
    WHERE ID = p_user_id;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, '해당 사용자를 찾을 수 없습니다.');
    END IF;

    COMMIT;
END;

-- 사용자 역할 변경 프로시저
CREATE OR REPLACE PROCEDURE PROC_CHANGE_USER_ROLE(
    p_user_id IN NUMBER,
    p_new_role IN VARCHAR2
) IS
BEGIN
    -- 역할 유효성 검사
    IF p_new_role NOT IN ('USER', 'ADMIN', 'SUPER_ADMIN') THEN
        RAISE_APPLICATION_ERROR(-20002, '유효하지 않은 역할입니다.');
    END IF;

    UPDATE LAB_USERS
    SET ROLE = p_new_role
    WHERE ID = p_user_id
      AND IS_ACTIVE = 1;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, '활성 사용자를 찾을 수 없습니다.');
    END IF;

    COMMIT;
END;

-- 사용자 로그인 시간 업데이트 프로시저
CREATE OR REPLACE PROCEDURE PROC_UPDATE_LOGIN_TIME(
    p_kakao_id IN NUMBER
) IS
BEGIN
    UPDATE LAB_USERS
    SET LAST_LOGIN_DATE = CURRENT_TIMESTAMP
    WHERE KAKAO_ID = p_kakao_id
      AND IS_ACTIVE = 1;

    COMMIT;
END;

-- ============================================================================
-- 성능 최적화를 위한 VIEW
-- ============================================================================

-- 활성 사용자 VIEW
CREATE OR REPLACE VIEW V_ACTIVE_USERS AS
SELECT
    ID,
    KAKAO_ID,
    EMAIL,
    NICKNAME,
    PROFILE_IMAGE,
    ROLE,
    LAST_LOGIN_DATE,
    CREATED_DATE,
    MODIFIED_DATE
FROM LAB_USERS
WHERE IS_ACTIVE = 1;

-- 사용자 통계 VIEW
CREATE OR REPLACE VIEW V_USER_STATISTICS AS
SELECT
    ROLE,
    COUNT(*) AS TOTAL_USERS,
    COUNT(CASE WHEN IS_ACTIVE = 1 THEN 1 END) AS ACTIVE_USERS,
    COUNT(CASE WHEN LAST_LOGIN_DATE >= CURRENT_TIMESTAMP - INTERVAL '7' DAY THEN 1 END) AS RECENT_ACTIVE,
    COUNT(CASE WHEN LAST_LOGIN_DATE >= CURRENT_TIMESTAMP - INTERVAL '30' DAY THEN 1 END) AS MONTHLY_ACTIVE
FROM LAB_USERS
GROUP BY ROLE;

-- ============================================================================
-- 데이터 검증 쿼리
-- ============================================================================

-- 1. 중복 카카오 ID 검사
-- SELECT KAKAO_ID, COUNT(*)
-- FROM LAB_USERS
-- GROUP BY KAKAO_ID
-- HAVING COUNT(*) > 1;
--
-- -- 2. 빈 닉네임 검사
-- SELECT * FROM LAB_USERS
-- WHERE NICKNAME IS NULL OR TRIM(NICKNAME) = '';
--
-- -- 3. 유효하지 않은 역할 검사
-- SELECT * FROM LAB_USERS
-- WHERE ROLE NOT IN ('USER', 'ADMIN', 'SUPER_ADMIN');
--
-- -- 4. 관리자 계정 존재 확인
-- SELECT COUNT(*) AS ADMIN_COUNT
-- FROM LAB_USERS
-- WHERE ROLE IN ('ADMIN', 'SUPER_ADMIN')
--   AND IS_ACTIVE = 1;
--
-- -- 관리자가 없는 경우 경고
-- SELECT
--     CASE
--         WHEN (SELECT COUNT(*) FROM LAB_USERS WHERE ROLE IN ('ADMIN', 'SUPER_ADMIN') AND IS_ACTIVE = 1) = 0
--             THEN '경고: 활성 관리자 계정이 없습니다!'
--         ELSE '정상: 관리자 계정이 존재합니다.'
--         END AS ADMIN_STATUS
-- FROM DUAL;
--
-- COMMIT;




-- ============================================================================
-- LAB_POST & LAB_COMMENT 테이블 스키마 (Oracle Database)
-- ============================================================================

-- 1. LAB_POST 시퀀스 생성
CREATE SEQUENCE LAB_POST_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 2. LAB_POST 테이블 생성
CREATE TABLE LAB_POST (
                          ID                  NUMBER(19)      NOT NULL,
                          TITLE               VARCHAR2(200)   NOT NULL,
                          CONTENT             CLOB,
                          SUMMARY             VARCHAR2(500),
                          THUMBNAIL_URL       VARCHAR2(500),
                          TAGS                VARCHAR2(1000),
                          CATEGORY_ID         NUMBER(19),
                          AUTHOR_ID           NUMBER(19)      NOT NULL,
                          STATUS              VARCHAR2(20)    DEFAULT 'DRAFT' NOT NULL,
                          VIEW_COUNT          NUMBER(19)      DEFAULT 0 NOT NULL,
                          LIKE_COUNT          NUMBER(19)      DEFAULT 0 NOT NULL,
                          COMMENT_COUNT       NUMBER(19)      DEFAULT 0 NOT NULL,
                          IS_FEATURED         NUMBER(1)       DEFAULT 0 NOT NULL,
                          PUBLISHED_DATE      TIMESTAMP,
                          CREATED_DATE        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
                          MODIFIED_DATE       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    -- 제약조건
                          CONSTRAINT PK_LAB_POST PRIMARY KEY (ID),
                          CONSTRAINT FK_LAB_POST_CATEGORY FOREIGN KEY (CATEGORY_ID) REFERENCES LAB_NAVIGATION(ID),
                          CONSTRAINT FK_LAB_POST_AUTHOR FOREIGN KEY (AUTHOR_ID) REFERENCES LAB_USERS(ID),
                          CONSTRAINT CK_LAB_POST_STATUS CHECK (STATUS IN ('DRAFT', 'PUBLISHED', 'PRIVATE', 'DELETED')),
                          CONSTRAINT CK_LAB_POST_FEATURED CHECK (IS_FEATURED IN (0, 1)),
                          CONSTRAINT CK_LAB_POST_VIEW_COUNT CHECK (VIEW_COUNT >= 0),
                          CONSTRAINT CK_LAB_POST_LIKE_COUNT CHECK (LIKE_COUNT >= 0),
                          CONSTRAINT CK_LAB_POST_COMMENT_COUNT CHECK (COMMENT_COUNT >= 0)
);

-- 3. LAB_COMMENT 시퀀스 생성
CREATE SEQUENCE LAB_COMMENT_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 4. LAB_COMMENT 테이블 생성
CREATE TABLE LAB_COMMENT (
                             ID                  NUMBER(19)      NOT NULL,
                             POST_ID             NUMBER(19)      NOT NULL,
                             AUTHOR_ID           NUMBER(19)      NOT NULL,
                             PARENT_ID           NUMBER(19),
                             CONTENT             CLOB            NOT NULL,
                             DEPTH               NUMBER(3)       DEFAULT 0 NOT NULL,
                             IS_DELETED          NUMBER(1)       DEFAULT 0 NOT NULL,
                             LIKE_COUNT          NUMBER(19)      DEFAULT 0 NOT NULL,
                             CREATED_DATE        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
                             MODIFIED_DATE       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    -- 제약조건
                             CONSTRAINT PK_LAB_COMMENT PRIMARY KEY (ID),
                             CONSTRAINT FK_LAB_COMMENT_POST FOREIGN KEY (POST_ID) REFERENCES LAB_POST(ID) ON DELETE CASCADE,
                             CONSTRAINT FK_LAB_COMMENT_AUTHOR FOREIGN KEY (AUTHOR_ID) REFERENCES LAB_USERS(ID),
                             CONSTRAINT FK_LAB_COMMENT_PARENT FOREIGN KEY (PARENT_ID) REFERENCES LAB_COMMENT(ID),
                             CONSTRAINT CK_LAB_COMMENT_DEPTH CHECK (DEPTH >= 0 AND DEPTH <= 2),
                             CONSTRAINT CK_LAB_COMMENT_DELETED CHECK (IS_DELETED IN (0, 1)),
                             CONSTRAINT CK_LAB_COMMENT_LIKE_COUNT CHECK (LIKE_COUNT >= 0)
);

-- 5. 인덱스 생성
-- LAB_POST 인덱스
CREATE INDEX IDX_LAB_POST_AUTHOR ON LAB_POST(AUTHOR_ID);
CREATE INDEX IDX_LAB_POST_CATEGORY ON LAB_POST(CATEGORY_ID);
CREATE INDEX IDX_LAB_POST_STATUS ON LAB_POST(STATUS);
CREATE INDEX IDX_LAB_POST_PUBLISHED ON LAB_POST(PUBLISHED_DATE);
CREATE INDEX IDX_LAB_POST_FEATURED ON LAB_POST(IS_FEATURED);
CREATE INDEX IDX_LAB_POST_VIEW_COUNT ON LAB_POST(VIEW_COUNT);
CREATE INDEX IDX_LAB_POST_CREATED ON LAB_POST(CREATED_DATE);
CREATE INDEX IDX_LAB_POST_TAGS ON LAB_POST(TAGS);

-- LAB_COMMENT 인덱스
CREATE INDEX IDX_LAB_COMMENT_POST ON LAB_COMMENT(POST_ID);
CREATE INDEX IDX_LAB_COMMENT_AUTHOR ON LAB_COMMENT(AUTHOR_ID);
CREATE INDEX IDX_LAB_COMMENT_PARENT ON LAB_COMMENT(PARENT_ID);
CREATE INDEX IDX_LAB_COMMENT_DEPTH ON LAB_COMMENT(DEPTH);
CREATE INDEX IDX_LAB_COMMENT_CREATED ON LAB_COMMENT(CREATED_DATE);
CREATE INDEX IDX_LAB_COMMENT_DELETED ON LAB_COMMENT(IS_DELETED);

-- 6. 컬럼 주석 추가
-- LAB_POST 주석
COMMENT ON TABLE LAB_POST IS '포스트 정보 관리 테이블';
COMMENT ON COLUMN LAB_POST.ID IS '포스트 고유 ID (Primary Key)';
COMMENT ON COLUMN LAB_POST.TITLE IS '포스트 제목';
COMMENT ON COLUMN LAB_POST.CONTENT IS '포스트 내용 (HTML 형식)';
COMMENT ON COLUMN LAB_POST.SUMMARY IS '포스트 요약';
COMMENT ON COLUMN LAB_POST.THUMBNAIL_URL IS '썸네일 이미지 URL';
COMMENT ON COLUMN LAB_POST.TAGS IS '태그 목록 (쉼표로 구분)';
COMMENT ON COLUMN LAB_POST.CATEGORY_ID IS '카테고리 ID (LAB_NAVIGATION 참조)';
COMMENT ON COLUMN LAB_POST.AUTHOR_ID IS '작성자 ID';
COMMENT ON COLUMN LAB_POST.STATUS IS '포스트 상태 (DRAFT, PUBLISHED, PRIVATE, DELETED)';
COMMENT ON COLUMN LAB_POST.VIEW_COUNT IS '조회수';
COMMENT ON COLUMN LAB_POST.LIKE_COUNT IS '좋아요 수';
COMMENT ON COLUMN LAB_POST.COMMENT_COUNT IS '댓글 수';
COMMENT ON COLUMN LAB_POST.IS_FEATURED IS '추천 포스트 여부 (1: 추천, 0: 일반)';
COMMENT ON COLUMN LAB_POST.PUBLISHED_DATE IS '발행일시';
COMMENT ON COLUMN LAB_POST.CREATED_DATE IS '생성일시';
COMMENT ON COLUMN LAB_POST.MODIFIED_DATE IS '수정일시';

-- LAB_COMMENT 주석
COMMENT ON TABLE LAB_COMMENT IS '댓글 정보 관리 테이블';
COMMENT ON COLUMN LAB_COMMENT.ID IS '댓글 고유 ID (Primary Key)';
COMMENT ON COLUMN LAB_COMMENT.POST_ID IS '포스트 ID';
COMMENT ON COLUMN LAB_COMMENT.AUTHOR_ID IS '작성자 ID';
COMMENT ON COLUMN LAB_COMMENT.PARENT_ID IS '부모 댓글 ID (대댓글인 경우)';
COMMENT ON COLUMN LAB_COMMENT.CONTENT IS '댓글 내용';
COMMENT ON COLUMN LAB_COMMENT.DEPTH IS '댓글 깊이 (0: 댓글, 1: 대댓글)';
COMMENT ON COLUMN LAB_COMMENT.IS_DELETED IS '삭제 여부 (1: 삭제됨, 0: 활성)';
COMMENT ON COLUMN LAB_COMMENT.LIKE_COUNT IS '좋아요 수';
COMMENT ON COLUMN LAB_COMMENT.CREATED_DATE IS '생성일시';
COMMENT ON COLUMN LAB_COMMENT.MODIFIED_DATE IS '수정일시';

-- 7. 트리거 생성 (수정일시 자동 업데이트)
CREATE OR REPLACE TRIGGER TRG_LAB_POST_UPDATE
    BEFORE UPDATE ON LAB_POST
    FOR EACH ROW
BEGIN
    :NEW.MODIFIED_DATE := CURRENT_TIMESTAMP;
END;

CREATE OR REPLACE TRIGGER TRG_LAB_COMMENT_UPDATE
    BEFORE UPDATE ON LAB_COMMENT
    FOR EACH ROW
BEGIN
    :NEW.MODIFIED_DATE := CURRENT_TIMESTAMP;
END;

-- ============================================================================
-- 초기 데이터 삽입 (샘플 포스트)
-- ============================================================================

-- 샘플 포스트 1 (Java 카테고리)
-- INSERT INTO LAB_POST (
--     ID, TITLE, CONTENT, SUMMARY, CATEGORY_ID, AUTHOR_ID, STATUS,
--     VIEW_COUNT, LIKE_COUNT, IS_FEATURED, PUBLISHED_DATE
-- ) VALUES (
--              LAB_POST_SEQ.NEXTVAL,
--              'Java 기초 문법 완벽 가이드',
--              '<h2>Java 기초 문법</h2><p>Java는 객체지향 프로그래밍 언어입니다...</p><pre><code class="language-java">public class HelloWorld {
--              public static void main(String[] args) {
--                  System.out.println("Hello, World!");
--              }
--          }</code></pre>',
--              'Java 프로그래밍의 기초 문법을 상세히 설명하는 가이드입니다.',
--              3, -- Java 카테고리 ID
--              1, -- 작성자 ID (관리자)
--              'PUBLISHED',
--              150,
--              25,
--              1,
--              CURRENT_TIMESTAMP
--          );
--
-- -- 샘플 포스트 2 (Spring Boot 카테고리)
-- INSERT INTO LAB_POST (
--     ID, TITLE, CONTENT, SUMMARY, TAGS, CATEGORY_ID, AUTHOR_ID, STATUS,
--     VIEW_COUNT, LIKE_COUNT, IS_FEATURED, PUBLISHED_DATE
-- ) VALUES (
--              LAB_POST_SEQ.NEXTVAL,
--              'Spring Boot 프로젝트 시작하기',
--              '<h2>Spring Boot란?</h2><p>Spring Boot는 Spring 기반 애플리케이션을 쉽게 만들 수 있게 해주는 프레임워크입니다...</p>',
--              'Spring Boot 프로젝트를 처음 시작하는 방법을 알아봅시다.',
--              'spring,spring-boot,java,framework',
--              4, -- Spring Boot 카테고리 ID
--              1, -- 작성자 ID
--              'PUBLISHED',
--              89,
--              12,
--              1,
--              CURRENT_TIMESTAMP
--          );
--
-- -- 샘플 포스트 3 (React 카테고리)
-- INSERT INTO LAB_POST (
--     ID, TITLE, CONTENT, SUMMARY, TAGS, CATEGORY_ID, AUTHOR_ID, STATUS,
--     VIEW_COUNT, LIKE_COUNT, IS_FEATURED, PUBLISHED_DATE
-- ) VALUES (
--              LAB_POST_SEQ.NEXTVAL,
--              'React Hooks 완벽 정리',
--              '<h2>React Hooks</h2><p>React Hooks는 함수형 컴포넌트에서 상태와 생명주기를 관리할 수 있게 해주는 기능입니다...</p><pre><code class="language-javascript">import { useState, useEffect } from "react";
--
--          function Counter() {
--              const [count, setCount] = useState(0);
--
--              useEffect(() => {
--                  document.title = `Count: ${count}`;
--              }, [count]);
--
--              return (
--                  <div>
--                      <p>Count: {count}</p>
--                      <button onClick={() => setCount(count + 1)}>
--                          Increment
--                      </button>
--                  </div>
--              );
--          }</code></pre>',
--              'React Hooks의 종류와 사용법을 자세히 알아봅시다.',
--              'react,hooks,javascript,frontend',
--              6, -- React 카테고리 ID
--              1, -- 작성자 ID
--              'PUBLISHED',
--              203,
--              45,
--              1,
--              CURRENT_TIMESTAMP
--          );
--
-- -- 샘플 댓글들
-- INSERT INTO LAB_COMMENT (
--     ID, POST_ID, AUTHOR_ID, CONTENT, DEPTH
-- ) VALUES (
--              LAB_COMMENT_SEQ.NEXTVAL,
--              1, -- Java 포스트
--              2, -- 일반 사용자
--              '정말 유용한 자료네요! Java 공부하는데 많은 도움이 되었습니다.',
--              0
--          );
--
-- INSERT INTO LAB_COMMENT (
--     ID, POST_ID, AUTHOR_ID, PARENT_ID, CONTENT, DEPTH
-- ) VALUES (
--              LAB_COMMENT_SEQ.NEXTVAL,
--              1, -- Java 포스트
--              1, -- 관리자
--              1, -- 위 댓글의 대댓글
--              '도움이 되셨다니 기쁩니다! 더 좋은 내용으로 찾아뵙겠습니다.',
--              1
--          );
--
-- INSERT INTO LAB_COMMENT (
--     ID, POST_ID, AUTHOR_ID, CONTENT, DEPTH, LIKE_COUNT
-- ) VALUES (
--              LAB_COMMENT_SEQ.NEXTVAL,
--              3, -- React 포스트
--              2, -- 일반 사용자
--              'React Hooks 정리가 정말 깔끔하네요. useEffect 부분이 특히 이해하기 쉬웠습니다.',
--              0,
--              3
--          );

-- ============================================================================
-- 유용한 쿼리들
-- ============================================================================

-- 1. 발행된 포스트 목록 (최신순)
-- SELECT
--     p.ID,
--     p.TITLE,
--     p.SUMMARY,
--     p.VIEW_COUNT,
--     p.LIKE_COUNT,
--     p.COMMENT_COUNT,
--     p.PUBLISHED_DATE,
--     u.NICKNAME AS AUTHOR_NAME,
--     n.LABEL AS CATEGORY_NAME
-- FROM LAB_POST p
--          JOIN LAB_USERS u ON p.AUTHOR_ID = u.ID
--          LEFT JOIN LAB_NAVIGATION n ON p.CATEGORY_ID = n.ID
-- WHERE p.STATUS = 'PUBLISHED'
-- ORDER BY p.PUBLISHED_DATE DESC;
--
-- -- 2. 카테고리별 포스트 수 통계
-- SELECT
--     n.LABEL AS CATEGORY_NAME,
--     COUNT(p.ID) AS POST_COUNT,
--     SUM(p.VIEW_COUNT) AS TOTAL_VIEWS,
--     SUM(p.LIKE_COUNT) AS TOTAL_LIKES
-- FROM LAB_NAVIGATION n
--          LEFT JOIN LAB_POST p ON n.ID = p.CATEGORY_ID AND p.STATUS = 'PUBLISHED'
-- WHERE n.HREF IS NOT NULL
-- GROUP BY n.ID, n.LABEL
-- ORDER BY POST_COUNT DESC;
--
-- -- 3. 포스트별 댓글 트리 구조 조회
-- WITH COMMENT_TREE AS (
--     -- 최상위 댓글
--     SELECT
--         c.ID,
--         c.POST_ID,
--         c.CONTENT,
--         c.DEPTH,
--         c.CREATED_DATE,
--         u.NICKNAME AS AUTHOR_NAME,
--         CAST(c.ID AS VARCHAR2(1000)) AS PATH
--     FROM LAB_COMMENT c
--              JOIN LAB_USERS u ON c.AUTHOR_ID = u.ID
--     WHERE c.PARENT_ID IS NULL
--       AND c.IS_DELETED = 0
--       AND c.POST_ID = 1  -- 특정 포스트 ID
--
--     UNION ALL
--
--     -- 대댓글
--     SELECT
--         c.ID,
--         c.POST_ID,
--         c.CONTENT,
--         c.DEPTH,
--         c.CREATED_DATE,
--         u.NICKNAME AS AUTHOR_NAME,
--         ct.PATH || '/' || c.ID
--     FROM LAB_COMMENT c
--              JOIN LAB_USERS u ON c.AUTHOR_ID = u.ID
--              JOIN COMMENT_TREE ct ON c.PARENT_ID = ct.ID
--     WHERE c.IS_DELETED = 0
-- )
-- SELECT * FROM COMMENT_TREE
-- ORDER BY PATH;
--
-- -- 4. 인기 포스트 조회 (조회수 + 좋아요 기준)
-- SELECT
--     p.ID,
--     p.TITLE,
--     p.VIEW_COUNT,
--     p.LIKE_COUNT,
--     p.COMMENT_COUNT,
--     (p.VIEW_COUNT + p.LIKE_COUNT * 2 + p.COMMENT_COUNT * 3) AS POPULARITY_SCORE,
--     u.NICKNAME AS AUTHOR_NAME
-- FROM LAB_POST p
--          JOIN LAB_USERS u ON p.AUTHOR_ID = u.ID
-- WHERE p.STATUS = 'PUBLISHED'
--   AND p.PUBLISHED_DATE >= CURRENT_TIMESTAMP - INTERVAL '30' DAY
-- ORDER BY POPULARITY_SCORE DESC
--     FETCH FIRST 10 ROWS ONLY;
--
-- -- 5. 태그별 포스트 검색
-- SELECT
--     p.ID,
--     p.TITLE,
--     p.TAGS,
--     p.VIEW_COUNT,
--     p.PUBLISHED_DATE
-- FROM LAB_POST p
-- WHERE p.STATUS = 'PUBLISHED'
--   AND (p.TAGS LIKE '%react%' OR p.TAGS LIKE '%javascript%')
-- ORDER BY p.PUBLISHED_DATE DESC;
--
-- -- 6. 사용자별 포스트 통계
-- SELECT
--     u.NICKNAME,
--     COUNT(p.ID) AS POST_COUNT,
--     SUM(p.VIEW_COUNT) AS TOTAL_VIEWS,
--     SUM(p.LIKE_COUNT) AS TOTAL_LIKES,
--     SUM(p.COMMENT_COUNT) AS TOTAL_COMMENTS,
--     AVG(p.VIEW_COUNT) AS AVG_VIEWS
-- FROM LAB_USERS u
--          LEFT JOIN LAB_POST p ON u.ID = p.AUTHOR_ID AND p.STATUS = 'PUBLISHED'
-- GROUP BY u.ID, u.NICKNAME
-- HAVING COUNT(p.ID) > 0
-- ORDER BY POST_COUNT DESC;
--
-- -- 7. 최근 7일간 활동 통계
-- SELECT
--     TO_CHAR(TRUNC(p.PUBLISHED_DATE), 'YYYY-MM-DD') AS DATE_STR,
--     COUNT(p.ID) AS POSTS_PUBLISHED,
--     COUNT(c.ID) AS COMMENTS_POSTED
-- FROM LAB_POST p
--          FULL OUTER JOIN LAB_COMMENT c ON TO_CHAR(TRUNC(p.PUBLISHED_DATE), 'YYYY-MM-DD') = TO_CHAR(TRUNC(c.CREATED_DATE), 'YYYY-MM-DD')
-- WHERE p.PUBLISHED_DATE >= CURRENT_TIMESTAMP - INTERVAL '7' DAY
--    OR c.CREATED_DATE >= CURRENT_TIMESTAMP - INTERVAL '7' DAY
-- GROUP BY TRUNC(p.PUBLISHED_DATE), TRUNC(c.CREATED_DATE)
-- ORDER BY DATE_STR DESC;

-- ============================================================================
-- 관리용 프로시저
-- ============================================================================

-- 포스트 조회수 증가 프로시저
CREATE OR REPLACE PROCEDURE PROC_INCREMENT_POST_VIEW(
    p_post_id IN NUMBER
) IS
BEGIN
    UPDATE LAB_POST
    SET VIEW_COUNT = VIEW_COUNT + 1
    WHERE ID = p_post_id;

    COMMIT;
END;

-- 포스트의 댓글 수 업데이트 프로시저
CREATE OR REPLACE PROCEDURE PROC_UPDATE_POST_COMMENT_COUNT(
    p_post_id IN NUMBER
) IS
    v_comment_count NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_comment_count
    FROM LAB_COMMENT
    WHERE POST_ID = p_post_id
      AND IS_DELETED = 0;

    UPDATE LAB_POST
    SET COMMENT_COUNT = v_comment_count
    WHERE ID = p_post_id;

    COMMIT;
END;

-- 포스트 상태 일괄 변경 프로시저
CREATE OR REPLACE PROCEDURE PROC_BULK_UPDATE_POST_STATUS(
    p_author_id IN NUMBER,
    p_old_status IN VARCHAR2,
    p_new_status IN VARCHAR2
) IS
BEGIN
    UPDATE LAB_POST
    SET STATUS = p_new_status,
        PUBLISHED_DATE = CASE
                             WHEN p_new_status = 'PUBLISHED' AND PUBLISHED_DATE IS NULL
                                 THEN CURRENT_TIMESTAMP
                             ELSE PUBLISHED_DATE
            END
    WHERE AUTHOR_ID = p_author_id
      AND STATUS = p_old_status;

    COMMIT;
END;

-- 오래된 임시저장 포스트 정리 프로시저
CREATE OR REPLACE PROCEDURE PROC_CLEANUP_OLD_DRAFTS(
    p_days_old IN NUMBER DEFAULT 30
) IS
BEGIN
    DELETE FROM LAB_POST
    WHERE STATUS = 'DRAFT'
      AND CREATED_DATE < CURRENT_TIMESTAMP - INTERVAL p_days_old DAY
    AND CONTENT IS NULL;

    COMMIT;
END;

-- ============================================================================
-- 성능 최적화를 위한 VIEW
-- ============================================================================

-- 발행된 포스트 VIEW
CREATE OR REPLACE VIEW V_PUBLISHED_POSTS AS
SELECT
    p.ID,
    p.TITLE,
    p.CONTENT,
    p.SUMMARY,
    p.THUMBNAIL_URL,
    p.TAGS,
    p.VIEW_COUNT,
    p.LIKE_COUNT,
    p.COMMENT_COUNT,
    p.IS_FEATURED,
    p.PUBLISHED_DATE,
    p.CREATED_DATE,
    p.MODIFIED_DATE,
    u.NICKNAME AS AUTHOR_NAME,
    u.PROFILE_IMAGE AS AUTHOR_IMAGE,
    n.LABEL AS CATEGORY_NAME,
    n.HREF AS CATEGORY_HREF
FROM LAB_POST p
         JOIN LAB_USERS u ON p.AUTHOR_ID = u.ID
         LEFT JOIN LAB_NAVIGATION n ON p.CATEGORY_ID = n.ID
WHERE p.STATUS = 'PUBLISHED';

-- 댓글 통계 VIEW
CREATE OR REPLACE VIEW V_COMMENT_STATS AS
SELECT
    p.ID AS POST_ID,
    p.TITLE AS POST_TITLE,
    COUNT(c.ID) AS TOTAL_COMMENTS,
    COUNT(CASE WHEN c.DEPTH = 0 THEN 1 END) AS ROOT_COMMENTS,
    COUNT(CASE WHEN c.DEPTH > 0 THEN 1 END) AS REPLY_COMMENTS,
    MAX(c.CREATED_DATE) AS LAST_COMMENT_DATE
FROM LAB_POST p
         LEFT JOIN LAB_COMMENT c ON p.ID = c.POST_ID AND c.IS_DELETED = 0
WHERE p.STATUS = 'PUBLISHED'
GROUP BY p.ID, p.TITLE;

-- 포스트 인기도 VIEW
CREATE OR REPLACE VIEW V_POST_POPULARITY AS
SELECT
    p.ID,
    p.TITLE,
    p.VIEW_COUNT,
    p.LIKE_COUNT,
    p.COMMENT_COUNT,
    (p.VIEW_COUNT + p.LIKE_COUNT * 2 + p.COMMENT_COUNT * 3) AS POPULARITY_SCORE,
    RANK() OVER (ORDER BY (p.VIEW_COUNT + p.LIKE_COUNT * 2 + p.COMMENT_COUNT * 3) DESC) AS POPULARITY_RANK
FROM LAB_POST p
WHERE p.STATUS = 'PUBLISHED';

-- ============================================================================
-- 데이터 검증 쿼리
-- ============================================================================

-- 1. 고아 댓글 검사 (존재하지 않는 포스트나 부모 댓글 참조)
-- SELECT 'Orphaned comments (invalid post)' AS issue_type, COUNT(*) AS count
-- FROM LAB_COMMENT c
-- WHERE NOT EXISTS (SELECT 1 FROM LAB_POST p WHERE p.ID = c.POST_ID)
--
-- UNION ALL
--
-- SELECT 'Orphaned comments (invalid parent)' AS issue_type, COUNT(*) AS count
-- FROM LAB_COMMENT c
-- WHERE c.PARENT_ID IS NOT NULL
--   AND NOT EXISTS (SELECT 1 FROM LAB_COMMENT p WHERE p.ID = c.PARENT_ID);
--
-- -- 2. 댓글 수 불일치 검사
-- SELECT
--     p.ID AS POST_ID,
--     p.TITLE,
--     p.COMMENT_COUNT AS STORED_COUNT,
--     COUNT(c.ID) AS ACTUAL_COUNT,
--     ABS(p.COMMENT_COUNT - COUNT(c.ID)) AS DIFFERENCE
-- FROM LAB_POST p
--          LEFT JOIN LAB_COMMENT c ON p.ID = c.POST_ID AND c.IS_DELETED = 0
-- GROUP BY p.ID, p.TITLE, p.COMMENT_COUNT
-- HAVING p.COMMENT_COUNT != COUNT(c.ID);
--
-- -- 3. 잘못된 댓글 깊이 검사
-- SELECT c.*
-- FROM LAB_COMMENT c
--          LEFT JOIN LAB_COMMENT parent ON c.PARENT_ID = parent.ID
-- WHERE (c.PARENT_ID IS NULL AND c.DEPTH != 0)
--    OR (c.PARENT_ID IS NOT NULL AND c.DEPTH != parent.DEPTH + 1);
--
-- -- 4. 발행일시가 없는 발행된 포스트 검사
-- SELECT ID, TITLE, STATUS, PUBLISHED_DATE
-- FROM LAB_POST
-- WHERE STATUS = 'PUBLISHED'
--   AND PUBLISHED_DATE IS NULL;
--
-- -- 5. 태그 형식 검사 (쉼표로 끝나거나 연속 쉼표 있는 경우)
-- SELECT ID, TITLE, TAGS
-- FROM LAB_POST
-- WHERE TAGS IS NOT NULL
--   AND (TAGS LIKE '%,,' OR TAGS LIKE '%,' OR TAGS LIKE ',%');
--
-- COMMIT;






-- Oracle DB 초기 테이블 생성 및 데이터 삽입 스크립트
-- 1. 시퀀스 생성
CREATE SEQUENCE LAB_ADMIN_SEQ
    START WITH 1
    INCREMENT BY 1
    NOMAXVALUE
    NOCACHE;

-- 2. LAB_ADMIN 테이블 생성
CREATE TABLE LAB_ADMIN (
                           ID NUMBER(19) NOT NULL,
                           NAME VARCHAR2(100) NOT NULL,
                           ROLE VARCHAR2(200) NOT NULL,
                           BIO CLOB,
                           PROFILE_IMAGE VARCHAR2(500),
                           LOCATION VARCHAR2(100) NOT NULL,
                           EMAIL VARCHAR2(100) NOT NULL,
                           GITHUB_URL VARCHAR2(200),
                           TOTAL_VIEWS NUMBER(19) DEFAULT 0,
                           START_YEAR NUMBER(4),
                           IS_ACTIVE NUMBER(1) DEFAULT 1,
                           CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           CONSTRAINT PK_LAB_ADMIN PRIMARY KEY (ID),
                           CONSTRAINT UK_LAB_ADMIN_EMAIL UNIQUE (EMAIL),
                           CONSTRAINT CK_LAB_ADMIN_IS_ACTIVE CHECK (IS_ACTIVE IN (0, 1))
);

-- 3. 테이블에 인덱스 추가
CREATE INDEX IDX_LAB_ADMIN_ACTIVE ON LAB_ADMIN(IS_ACTIVE);
CREATE INDEX IDX_LAB_ADMIN_EMAIL ON LAB_ADMIN(EMAIL);

-- 4. 업데이트 시간 자동 갱신을 위한 트리거 생성
CREATE OR REPLACE TRIGGER TRG_LAB_ADMIN_UPDATED_AT
    BEFORE UPDATE ON LAB_ADMIN
    FOR EACH ROW
BEGIN
    :NEW.UPDATED_AT := CURRENT_TIMESTAMP;
END;
/

-- 5. 초기 관리자 데이터 삽입
INSERT INTO LAB_ADMIN (
    id,
    name,
    role,
    bio,
    profile_image,
    location,
    email,
    github_url,
    total_views,
    start_year,
    is_active,
    created_at,
    updated_at
) VALUES (
             LAB_ADMIN_SEQ.NEXTVAL,
             '김개발자',
             'Full Stack Developer',
             '안녕하세요! 웹 개발과 새로운 기술에 관심이 많은 개발자입니다. React, Spring Boot를 주로 사용하며, 사용자 경험을 중시하는 서비스를 만들고 있습니다. 현재는 모던 웹 기술과 클라우드 아키텍처에 깊은 관심을 가지고 있으며, 개발자 커뮤니티에 기여하고자 합니다.',
             'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
             'Seoul, Korea',
             'developer@example.com',
             'https://github.com/developer',
             12534,
             2020,
             1,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
         );

-- 6. 데이터 확인
SELECT * FROM LAB_ADMIN WHERE is_active = 1;

-- 7. 추가 샘플 데이터 (필요시)
/*
INSERT INTO admins (
    id, name, role, bio, profile_image, location, email, github_url,
    total_views, start_year, is_active
) VALUES (
    ADMIN_SEQ.NEXTVAL,
    '박서버',
    'Backend Engineer',
    '백엔드 개발 전문가입니다. Spring Boot, Oracle, Redis를 주로 다루며, 대용량 트래픽 처리와 시스템 아키텍처 설계에 관심이 많습니다.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'Busan, Korea',
    'backend@example.com',
    'https://github.com/backend-dev',
    8420,
    2018,
    0  -- 비활성화된 관리자
);
*/

-- 8. 권한 부여 (필요시 DBA 권한으로 실행)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON admins TO your_app_user;
-- GRANT SELECT ON ADMIN_SEQ TO your_app_user;

COMMIT;

-- 9. 검증 쿼리들
-- SELECT
--     id,
--     name,
--     role,
--     SUBSTR(bio, 1, 50) || '...' as bio_preview,
--     location,
--     email,
--     total_views,
--     start_year,
--     is_active,
--     TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
-- FROM admins
-- ORDER BY created_at DESC;
--
-- -- 조회수 포맷팅 테스트
-- SELECT
--     name,
--     total_views,
--     CASE
--         WHEN total_views >= 1000000 THEN ROUND(total_views/1000000, 1) || 'M'
--         WHEN total_views >= 1000 THEN ROUND(total_views/1000, 1) || 'K'
--         ELSE TO_CHAR(total_views)
--         END as formatted_views
-- FROM admins
-- WHERE is_active = 1;