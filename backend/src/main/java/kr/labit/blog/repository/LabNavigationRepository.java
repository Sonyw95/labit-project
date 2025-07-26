package kr.labit.blog.repository;

import kr.labit.blog.entity.LabNavigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabNavigationRepository extends JpaRepository<LabNavigation, Long> {

    /**
     * 활성화된 네비게이션 메뉴를 정렬 순서대로 조회
     */
    @Query("SELECT n FROM LabNavigation n WHERE n.isActive = true ORDER BY n.sortOrder, n.id")
    List<LabNavigation> findAllActiveOrderBySortOrder();

    /**
     * 활서화된 네비게이션 중 홈 제외.
     */
    @Query("SELECT n FROM LabNavigation n WHERE n.isActive = true AND n.href != :href ORDER BY n.sortOrder, n.id ")
    List<LabNavigation> findActiveByNonHref();


    /**
     * 특정 부모의 자식 메뉴들을 조회
     */
    @Query("SELECT n FROM LabNavigation n WHERE n.parentId = :parentId AND n.isActive = true ORDER BY n.sortOrder, n.id")
    List<LabNavigation> findChildrenByParentId(@Param("parentId") Long parentId);

    /**
     * 루트 메뉴들만 조회
     */
    @Query("SELECT n FROM LabNavigation n WHERE n.parentId IS NULL AND n.isActive = true ORDER BY n.sortOrder, n.id")
    List<LabNavigation> findRootMenus();

    /**
     * 특정 경로로 메뉴 찾기
     */
    @Query("SELECT n FROM LabNavigation n WHERE n.href = :href AND n.isActive = true")
    List<LabNavigation> findByHref(@Param("href") String href);

    /**
     * 특정 깊이의 메뉴들 조회
     */
    @Query("SELECT n FROM LabNavigation n WHERE n.depth = :depth AND n.isActive = true ORDER BY n.sortOrder, n.id")
    List<LabNavigation> findByDepth(@Param("depth") Integer depth);
}
