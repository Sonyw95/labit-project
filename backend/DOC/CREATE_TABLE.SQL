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