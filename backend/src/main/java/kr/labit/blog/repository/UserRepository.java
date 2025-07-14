package kr.labit.blog.repository;

import kr.labit.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    List<User> findByRole(String role);

    List<User> findByIsActiveTrue();

    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.lastLoginAt > :since")
    List<User> findActiveUsersSince(@Param("since") LocalDateTime since);

    boolean existsByEmail(String email);
}