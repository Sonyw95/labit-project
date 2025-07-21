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
SELECT LEVEL,
       LPAD(' ', (LEVEL - 1) * 4) || LABEL AS TREE_LABEL,
       ID,
       LABEL,
       HREF,
       PARENT_ID,
       SORT_ORDER,
       DEPTH,
       ICON,
       IS_ACTIVE
FROM LAB_NAVIGATION
WHERE IS_ACTIVE = 1
START WITH PARENT_ID IS NULL
CONNECT BY PRIOR ID = PARENT_ID
ORDER SIBLINGS BY SORT_ORDER;

-- 2. 특정 메뉴의 모든 하위 메뉴 조회
SELECT LEVEL,
       LPAD(' ', (LEVEL - 1) * 2) || LABEL AS TREE_LABEL,
       ID,
       LABEL,
       HREF
FROM LAB_NAVIGATION
WHERE IS_ACTIVE = 1
START WITH ID = 2 -- Backend 메뉴
CONNECT BY PRIOR ID = PARENT_ID
ORDER SIBLINGS BY SORT_ORDER;

-- 3. 특정 메뉴까지의 경로 조회 (Breadcrumb)
SELECT ID,
       LABEL,
       HREF,
       LEVEL
FROM LAB_NAVIGATION
WHERE IS_ACTIVE = 1
START WITH ID = (SELECT ID FROM LAB_NAVIGATION WHERE HREF = '/posts/java')
CONNECT BY ID = PRIOR PARENT_ID
ORDER BY LEVEL;

-- 4. 깊이별 메뉴 개수 통계
SELECT DEPTH,
       COUNT(*)                                     AS MENU_COUNT,
       COUNT(CASE WHEN HREF IS NOT NULL THEN 1 END) AS LINK_COUNT,
       COUNT(CASE WHEN HREF IS NULL THEN 1 END)     AS FOLDER_COUNT
FROM LAB_NAVIGATION
WHERE IS_ACTIVE = 1
GROUP BY DEPTH
ORDER BY DEPTH;

-- 5. 부모 메뉴별 하위 메뉴 개수
SELECT p.ID        AS PARENT_ID,
       p.LABEL     AS PARENT_LABEL,
       COUNT(c.ID) AS CHILD_COUNT
FROM LAB_NAVIGATION p
         LEFT JOIN LAB_NAVIGATION c ON p.ID = c.PARENT_ID AND c.IS_ACTIVE = 1
WHERE p.IS_ACTIVE = 1
GROUP BY p.ID, p.LABEL
ORDER BY p.SORT_ORDER;

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
SELECT *
FROM LAB_NAVIGATION n1
WHERE n1.PARENT_ID IS NOT NULL
  AND NOT EXISTS (SELECT 1
                  FROM LAB_NAVIGATION n2
                  WHERE n2.ID = n1.PARENT_ID);

-- 2. 순환 참조 검사
SELECT *
FROM LAB_NAVIGATION
WHERE ID = PARENT_ID;

-- 3. 깊이 불일치 검사
SELECT *
FROM (SELECT n.*,
             LEVEL AS ACTUAL_LEVEL
      FROM LAB_NAVIGATION n
      WHERE IS_ACTIVE = 1
      START WITH PARENT_ID IS NULL
      CONNECT BY PRIOR ID = PARENT_ID)
WHERE DEPTH != ACTUAL_LEVEL;

COMMIT;


























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
INSERT INTO LAB_USERS (
    ID,
    KAKAO_ID,
    EMAIL,
    NICKNAME,
    PROFILE_IMAGE,
    ROLE,
    IS_ACTIVE,
    LAST_LOGIN_DATE
) VALUES (
             LAB_USERS_SEQ.NEXTVAL,
             1234567890, -- 실제 카카오 ID로 교체
             'admin@example.com',
             '시스템관리자',
             NULL,
             'SUPER_ADMIN',
             1,
             CURRENT_TIMESTAMP
         );

-- 일반 관리자 계정 (테스트용)
INSERT INTO LAB_USERS (
    ID,
    KAKAO_ID,
    EMAIL,
    NICKNAME,
    PROFILE_IMAGE,
    ROLE,
    IS_ACTIVE,
    LAST_LOGIN_DATE
) VALUES (
             LAB_USERS_SEQ.NEXTVAL,
             9876543210, -- 실제 카카오 ID로 교체
             'manager@example.com',
             '일반관리자',
             NULL,
             'ADMIN',
             1,
             CURRENT_TIMESTAMP
         );

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
SELECT
    ID,
    KAKAO_ID,
    EMAIL,
    NICKNAME,
    ROLE,
    LAST_LOGIN_DATE,
    CREATED_DATE
FROM LAB_USERS
WHERE IS_ACTIVE = 1
ORDER BY CREATED_DATE DESC;

-- 2. 역할별 사용자 수 통계
SELECT
    ROLE,
    COUNT(*) AS USER_COUNT,
    COUNT(CASE WHEN IS_ACTIVE = 1 THEN 1 END) AS ACTIVE_COUNT,
    COUNT(CASE WHEN IS_ACTIVE = 0 THEN 1 END) AS INACTIVE_COUNT
FROM LAB_USERS
GROUP BY ROLE
ORDER BY
    CASE ROLE
        WHEN 'SUPER_ADMIN' THEN 1
        WHEN 'ADMIN' THEN 2
        WHEN 'USER' THEN 3
        END;

-- 3. 최근 로그인한 사용자들 (최근 7일)
SELECT
    NICKNAME,
    EMAIL,
    ROLE,
    LAST_LOGIN_DATE
FROM LAB_USERS
WHERE LAST_LOGIN_DATE >= CURRENT_TIMESTAMP - INTERVAL '7' DAY
  AND IS_ACTIVE = 1
ORDER BY LAST_LOGIN_DATE DESC;

-- 4. 특정 사용자의 접근 가능한 네비게이션 메뉴 조회
WITH USER_ROLE AS (
    SELECT ROLE FROM LAB_USERS WHERE KAKAO_ID = :kakao_id
)
SELECT DISTINCT
    n.ID,
    n.LABEL,
    n.HREF,
    n.PARENT_ID,
    n.SORT_ORDER,
    n.DEPTH,
    n.ICON
FROM LAB_NAVIGATION n
         LEFT JOIN LAB_NAVIGATION_ROLES nr ON n.ID = nr.NAVIGATION_ID
WHERE n.IS_ACTIVE = 1
  AND (
    nr.ROLE IS NULL  -- 권한 제한이 없는 메뉴
        OR nr.ROLE = (SELECT ROLE FROM USER_ROLE)  -- 사용자 역할에 맞는 메뉴
        OR (SELECT ROLE FROM USER_ROLE) IN ('ADMIN', 'SUPER_ADMIN')  -- 관리자는 모든 메뉴 접근
    )
ORDER BY n.SORT_ORDER, n.ID;

-- 5. 비활성 사용자 정리 (30일 이상 미로그인)
SELECT
    ID,
    NICKNAME,
    EMAIL,
    LAST_LOGIN_DATE,
    CREATED_DATE
FROM LAB_USERS
WHERE IS_ACTIVE = 1
  AND (
    LAST_LOGIN_DATE < CURRENT_TIMESTAMP - INTERVAL '30' DAY
        OR LAST_LOGIN_DATE IS NULL
    )
  AND CREATED_DATE < CURRENT_TIMESTAMP - INTERVAL '30' DAY;

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
SELECT KAKAO_ID, COUNT(*)
FROM LAB_USERS
GROUP BY KAKAO_ID
HAVING COUNT(*) > 1;

-- 2. 빈 닉네임 검사
SELECT * FROM LAB_USERS
WHERE NICKNAME IS NULL OR TRIM(NICKNAME) = '';

-- 3. 유효하지 않은 역할 검사
SELECT * FROM LAB_USERS
WHERE ROLE NOT IN ('USER', 'ADMIN', 'SUPER_ADMIN');

-- 4. 관리자 계정 존재 확인
SELECT COUNT(*) AS ADMIN_COUNT
FROM LAB_USERS
WHERE ROLE IN ('ADMIN', 'SUPER_ADMIN')
  AND IS_ACTIVE = 1;

-- 관리자가 없는 경우 경고
SELECT
    CASE
        WHEN (SELECT COUNT(*) FROM LAB_USERS WHERE ROLE IN ('ADMIN', 'SUPER_ADMIN') AND IS_ACTIVE = 1) = 0
            THEN '경고: 활성 관리자 계정이 없습니다!'
        ELSE '정상: 관리자 계정이 존재합니다.'
        END AS ADMIN_STATUS
FROM DUAL;

COMMIT;