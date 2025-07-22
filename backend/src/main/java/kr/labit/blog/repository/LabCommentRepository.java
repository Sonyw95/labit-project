package kr.labit.blog.repository;


import kr.labit.blog.entity.LabComment;
import kr.labit.blog.entity.LabPost;
import kr.labit.blog.entity.LabUsers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabCommentRepository extends JpaRepository<LabComment, Long> {

    /**
     * 포스트의 댓글 조회 (트리 구조)
     */
    @Query("SELECT c FROM LabComment c WHERE c.post = :post AND c.isDeleted = false ORDER BY c.createdDate ASC")
    List<LabComment> findCommentsByPost(@Param("post") LabPost post);

    /**
     * 포스트의 최상위 댓글만 조회
     */
    @Query("SELECT c FROM LabComment c WHERE c.post = :post AND c.parent IS NULL AND c.isDeleted = false ORDER BY c.createdDate ASC")
    List<LabComment> findRootCommentsByPost(@Param("post") LabPost post);

    /**
     * 특정 댓글의 대댓글 조회
     */
    @Query("SELECT c FROM LabComment c WHERE c.parent = :parent AND c.isDeleted = false ORDER BY c.createdDate ASC")
    List<LabComment> findRepliesByParent(@Param("parent") LabComment parent);

    /**
     * 포스트의 댓글 수 조회
     */
    @Query("SELECT COUNT(c) FROM LabComment c WHERE c.post = :post AND c.isDeleted = false")
    Long countCommentsByPost(@Param("post") LabPost post);

    /**
     * 사용자의 댓글 조회
     */
    @Query("SELECT c FROM LabComment c WHERE c.author = :author AND c.isDeleted = false ORDER BY c.createdDate DESC")
    Page<LabComment> findCommentsByAuthor(@Param("author") LabUsers author, Pageable pageable);

    /**
     * 최근 댓글 조회
     */
    @Query("SELECT c FROM LabComment c WHERE c.isDeleted = false ORDER BY c.createdDate DESC")
    List<LabComment> findRecentComments(Pageable pageable);
}
