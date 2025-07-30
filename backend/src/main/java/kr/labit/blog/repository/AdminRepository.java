package kr.labit.blog.repository;

import kr.labit.blog.entity.LabAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<LabAdmin, Long> {

    @Query("SELECT a FROM LabAdmin a WHERE a.isActive = true ORDER BY a.id ASC")
    Optional<LabAdmin> findActiveAdmin();

    Optional<LabAdmin> findByEmailAndIsActiveTrue(String email);
}