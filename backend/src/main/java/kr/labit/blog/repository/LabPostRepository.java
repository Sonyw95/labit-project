package kr.labit.blog.repository;

import kr.labit.blog.entity.LabPost;
import kr.labit.blog.entity.LabUsers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LabPostRepository extends JpaRepository<LabPost, Long> {

    /**
     * 발행된 포스트 목록 조회 (페이징)
     */
    @Query("SELECT p FROM LabPost p WHERE p.status = 'PUBLISHED' ORDER BY p.publishedDate DESC")
    Page<LabPost> findPublishedPosts(Pageable pageable);

    /**
     * 카테고리별 발행된 포스트 조회
     */
    @Query("SELECT p FROM LabPost p WHERE p.status = 'PUBLISHED' AND p.category.id = :categoryId ORDER BY p.publishedDate DESC")
    Page<LabPost> findPublishedPostsByCategory(@Param("categoryId") Long categoryId, Pageable pageable);

    /**
     * 작성자별 포스트 조회
     */
    @Query("SELECT p FROM LabPost p WHERE p.author = :author ORDER BY p.createdDate DESC")
    Page<LabPost> findPostsByAuthor(@Param("author") LabUsers author, Pageable pageable);

    /**
     * 제목이나 내용으로 포스트 검색
     */
    @Query("SELECT p FROM LabPost p WHERE p.status = 'PUBLISHED' AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%) ORDER BY p.publishedDate DESC")
    Page<LabPost> searchPublishedPosts(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 태그로 포스트 검색
     */
    @Query("SELECT p FROM LabPost p WHERE p.status = 'PUBLISHED' AND p.tags LIKE %:tag% ORDER BY p.publishedDate DESC")
    Page<LabPost> findPublishedPostsByTag(@Param("tag") String tag, Pageable pageable);

    /**
     * 추천 포스트 조회
     */
    @Query("SELECT p FROM LabPost p WHERE p.status = 'PUBLISHED' AND p.isFeatured = true ORDER BY p.publishedDate DESC")
    List<LabPost> findFeaturedPosts();

    /**
     * 조회수 증가
     */
    @Modifying
    @Query("UPDATE LabPost p SET p.viewCount = p.viewCount + 1 WHERE p.id = :postId")
    void incrementViewCount(@Param("postId") Long postId);

    /**
     * 댓글 수 업데이트
     */
    @Modifying
    @Query("UPDATE LabPost p SET p.commentCount = :count WHERE p.id = :postId")
    void updateCommentCount(@Param("postId") Long postId, @Param("count") Long count);

    /**
     * 인기 포스트 조회 (최근 7일간 조회수 기준)
     */
    @Query("SELECT p FROM LabPost p WHERE p.status = 'PUBLISHED' AND p.publishedDate >= :fromDate ORDER BY p.viewCount DESC")
    List<LabPost> findPopularPosts(@Param("fromDate") LocalDateTime fromDate, Pageable pageable);

    /**
     * 최근 포스트 조회
     */
    @Query("SELECT p FROM LabPost p WHERE p.status = 'PUBLISHED' ORDER BY p.publishedDate DESC")
    List<LabPost> findRecentPosts(Pageable pageable);
}