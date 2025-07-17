package kr.labit.blog.repository;

import kr.labit.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.kakaoId = :kakaoId AND u.isActive = 'Y'")
    Optional<User> findByKakaoIdAndActive(@Param("kakaoId") String kakaoId);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = 'Y'")
    Optional<User> findByEmailAndActive(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.userId = :userId AND u.isActive = 'Y'")
    Optional<User> findByUserIdAndActive(@Param("userId") Long userId);

    boolean existsByKakaoId(String kakaoId);

    boolean existsByEmail(String email);
}