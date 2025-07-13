package kr.labit.blog.repository;

import kr.labit.blog.entity.NavigationMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NavigationRepository extends JpaRepository<NavigationMenu, Long> {

    @Query("SELECT N FROM NAVIGATIONMENU N" +
            "WHERE N.PARENTID IS NULL" +
            "AND N.ISVISIBLE = :")
    List<NavigationMenu> findRootMenuByRoleAndVisible(
            @Param("role") String role,
            @Param("isVisible") Boolean isVisible
    );
}
