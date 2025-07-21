package kr.labit.blog.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    USER("ROLE_USER", "일반 사용자"),
    ADMIN("ROLE_ADMIN", "관리자"),
    SUPER_ADMIN("ROLE_SUPER_ADMIN", "슈퍼 관리자");

    private final String authority;
    private final String description;

    public boolean isHigherThan(UserRole other) {
        return this.ordinal() > other.ordinal();
    }
}
