package kr.labit.blog.repository;

import kr.labit.blog.entity.NavigationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NavigationItemRepository extends JpaRepository<NavigationItem, Long> {

    @Query("SELECT n FROM NavigationItem n WHERE n.isActive = true AND (n.requiredRole IS NULL OR n.requiredRole = :role) ORDER BY n.orderIndex")
    List<NavigationItem> findByRoleOrderByOrderIndex(@Param("role") String role);

    @Query("SELECT n FROM NavigationItem n WHERE n.isActive = true ORDER BY n.orderIndex")
    List<NavigationItem> findAllByOrderByOrderIndex();

    List<NavigationItem> findByParentIdOrderByOrderIndex(Long parentId);

    List<NavigationItem> findByParentIdIsNullOrderByOrderIndex();
}