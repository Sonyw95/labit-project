package kr.labit.blog.repository;

import kr.labit.blog.entity.LabAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LabAssetRepository extends JpaRepository<LabAsset, Long> {

    /**
     * 모든 에셋을 정렬 순서대로 조회
     */
    @Query("SELECT a FROM LabAsset a ORDER BY a.sortOrder, a.id")
    List<LabAsset> findAllOrderBySortOrder();

    /**
     * 부모 ID 또는 폴더 ID로 에셋 조회
     */
    @Query("SELECT a FROM LabAsset a WHERE a.parentId = :id OR a.folderId = :id ORDER BY a.sortOrder, a.id")
    List<LabAsset> findByParentIdOrFolderId(@Param("id") Long id, @Param("id") Long folderId);

    /**
     * 부모 ID와 타입으로 조회
     */
    @Query("SELECT a FROM LabAsset a WHERE a.parentId = :parentId AND a.type = :type ORDER BY a.sortOrder, a.id")
    List<LabAsset> findByParentIdAndType(@Param("parentId") Long parentId, @Param("type") String type);

    /**
     * 폴더 ID와 타입으로 조회
     */
    @Query("SELECT a FROM LabAsset a WHERE a.folderId = :folderId AND a.type = :type ORDER BY a.sortOrder, a.id")
    List<LabAsset> findByFolderIdAndType(@Param("folderId") Long folderId, @Param("type") String type);

    /**
     * 타입별 개수 조회
     */
    @Query("SELECT COUNT(a) FROM LabAsset a WHERE a.type = :type")
    Long countByType(@Param("type") String type);

    /**
     * 폴더별 파일 개수 조회
     */
    @Query("SELECT COUNT(a) FROM LabAsset a WHERE a.folderId = :folderId AND a.type = :type")
    Integer countByFolderIdAndType(@Param("folderId") Long folderId, @Param("type") String type);

    /**
     * 타입과 생성일 기준으로 개수 조회
     */
    @Query("SELECT COUNT(a) FROM LabAsset a WHERE a.type = :type AND a.createdDate < :date")
    Long countByTypeAndCreatedDateBefore(@Param("type") String type, @Param("date") LocalDateTime date);

    @Query("SELECT COUNT(a) FROM LabAsset a WHERE a.type = :type AND a.createdDate > :date")
    Long countByTypeAndCreatedDateAfter(@Param("type") String type, @Param("date") LocalDateTime date);

    /**
     * 타입별 총 파일 크기 조회
     */
    @Query("SELECT COALESCE(SUM(a.size), 0) FROM LabAsset a WHERE a.type = :type")
    Long sumSizeByType(@Param("type") String type);
}