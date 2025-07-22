package kr.labit.blog.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PostStatus {
    DRAFT("DRAFT", "임시저장"),
    PUBLISHED("PUBLISHED", "발행됨"),
    PRIVATE("PRIVATE", "비공개"),
    DELETED("DELETED", "삭제됨");

    private final String code;
    private final String description;
}