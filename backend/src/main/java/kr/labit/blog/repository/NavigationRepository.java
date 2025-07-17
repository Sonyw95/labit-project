package kr.labit.blog.repository;

import kr.labit.blog.entity.Navigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NavigationRepository extends JpaRepository<Navigation, Long> {

    // 모든 네비게이션을 계층 구조로 조회
    @Query("SELECT n FROM Navigation n WHERE n.isActive = 'Y' ORDER BY n.navLevel ASC, n.navOrder ASC")
    List<Navigation> findAllActiveNavigations();

    // 루트 네비게이션 조회
    @Query("SELECT n FROM Navigation n WHERE n.parentId IS NULL AND n.isActive = 'Y' ORDER BY n.navOrder ASC")
    List<Navigation> findRootNavigations();

    // 특정 부모의 자식 네비게이션 조회
    @Query("SELECT n FROM Navigation n WHERE n.parentId = :parentId AND n.isActive = 'Y' ORDER BY n.navOrder ASC")
    List<Navigation> findChildrenByParentId(Long parentId);

    // URL로 네비게이션 조회
    @Query("SELECT n FROM Navigation n WHERE n.navUrl = :url AND n.isActive = 'Y'")
    Navigation findByNavUrl(String url);

    // 특정 네비게이션의 전체 경로 조회 (부모까지 포함)
    @Query(value = """
        WITH navigation_path AS (
            SELECT nav_id, nav_name, nav_url, parent_id, nav_level
            FROM LAB_NAVIGATION
            WHERE nav_id = :navId AND is_active = 'Y'
            UNION ALL
            SELECT n.nav_id, n.nav_name, n.nav_url, n.parent_id, n.nav_level
            FROM LAB_NAVIGATION n
            INNER JOIN navigation_path np ON n.nav_id = np.parent_id
            WHERE n.is_active = 'Y'
        )
        SELECT * FROM navigation_path ORDER BY nav_level ASC
        """, nativeQuery = true)
    List<Navigation> findNavigationPath(Long navId);
}