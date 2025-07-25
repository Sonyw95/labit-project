CREATE TABLE user_roles
(
    user_id NUMBER(38, 0) NOT NULL,
    roles   VARCHAR2(255)
);

CREATE TABLE LABUSER
(
    id            NUMBER(38, 0) GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    email         VARCHAR2(255)                                  NOT NULL,
    nickname      VARCHAR2(255)                                  NOT NULL,
    profile_image VARCHAR2(255),
    kakao_id      VARCHAR2(255),
    provider      VARCHAR2(255),
    created_at    TIMESTAMP,
    updated_at    TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE LABUSER
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE LABUSER
    ADD CONSTRAINT uc_users_kakaoid UNIQUE (kakao_id);

ALTER TABLE user_roles
    ADD CONSTRAINT fk_user_roles_on_user FOREIGN KEY (user_id) REFERENCES users (id);

DROP TABLE LABCODEMASTER CASCADE CONSTRAINTS;

DROP TABLE LABFILEPATH CASCADE CONSTRAINTS;

DROP TABLE LABINFOTRACE CASCADE CONSTRAINTS;

DROP TABLE LABPOSTBODY CASCADE CONSTRAINTS;

DROP TABLE LABPOSTCOMMENT CASCADE CONSTRAINTS;

DROP TABLE LABPOSTHEAD CASCADE CONSTRAINTS;

DROP TABLE LABPOSTTAGS CASCADE CONSTRAINTS;

DROP TABLE LABTIMELINE CASCADE CONSTRAINTS;

DROP TABLE LABUSER CASCADE CONSTRAINTS;

DROP TABLE LABUSERHEAD CASCADE CONSTRAINTS;

DROP SEQUENCE COMMENT_SEQ;

DROP SEQUENCE FILE_PATH_SEQ;

DROP SEQUENCE POST_BODY_SEQ;

DROP SEQUENCE POST_HEAD_SEQ;

DROP SEQUENCE TIMELINE_SEQ;