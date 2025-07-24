package kr.labit.blog.repository;

import kr.labit.blog.entity.LabActivityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabActivityLogRepository extends JpaRepository<LabActivityLog, Long> {

    /**
     * 최근 로그 조회
     */
    @Query("SELECT l FROM LabActivityLog l ORDER BY l.createdDate DESC")
    List<LabActivityLog> findRecentLogs(Pageable pageable);

    /**
     * 사용자별 로그 조회
     */
    @Query("SELECT l FROM LabActivityLog l WHERE l.user.id = :userId ORDER BY l.createdDate DESC")
    List<LabActivityLog> findByUserId(Long userId, Pageable pageable);

    /**
     * 리소스 타입별 로그 조회
     */
    @Query("SELECT l FROM LabActivityLog l WHERE l.resourceType = :resourceType ORDER BY l.createdDate DESC")
    List<LabActivityLog> findByResourceType(String resourceType, Pageable pageable);
}