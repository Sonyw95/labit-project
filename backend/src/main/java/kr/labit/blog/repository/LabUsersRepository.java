package kr.labit.blog.repository;

import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabUsersRepository extends JpaRepository<LabUsers, Long> {

    /**
     * 카카오 ID로 사용자 조회
     */
    Optional<LabUsers> findByKakaoId(Long kakaoId);

    /**
     * 이메일로 사용자 조회
     */
    Optional<LabUsers> findByEmail(String email);

    /**
     * 닉네임으로 사용자 조회
     */
    Optional<LabUsers> findByNickname(String nickname);

    /**
     * 활성화된 사용자만 조회
     */
    @Query("SELECT u FROM LabUsers u WHERE u.isActive = true AND u.kakaoId = :kakaoId")
    Optional<LabUsers> findActiveUserByKakaoId(@Param("kakaoId") Long kakaoId);

    /**
     * 역할별 사용자 조회
     */
    List<LabUsers> findByRoleAndIsActive(UserRole role, Boolean isActive);

    /**
     * 최근 로그인 일시 업데이트
     */
    @Modifying
    @Query("UPDATE LabUsers u SET u.lastLoginDate = :loginDate WHERE u.id = :userId")
    void updateLastLoginDate(@Param("userId") Long userId, @Param("loginDate") LocalDateTime loginDate);

    /**
     * 카카오 ID 존재 여부 확인
     */
    boolean existsByKakaoId(Long kakaoId);

    /**
     * 이메일 존재 여부 확인
     */
    boolean existsByEmail(String email);
}