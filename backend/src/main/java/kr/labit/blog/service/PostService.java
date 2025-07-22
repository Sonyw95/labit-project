package kr.labit.blog.service;

import kr.labit.blog.dto.PostCreateRequestDto;
import kr.labit.blog.dto.PostResponseDto;
import kr.labit.blog.dto.PostUpdateRequestDto;
import kr.labit.blog.entity.LabNavigation;
import kr.labit.blog.entity.LabPost;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.entity.PostStatus;
import kr.labit.blog.repository.LabNavigationRepository;
import kr.labit.blog.repository.LabPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PostService {

    private final LabPostRepository postRepository;
    private final LabNavigationRepository navigationRepository;

    /**
     * 포스트 생성
     */
    @Transactional
    @CacheEvict(value = {"posts", "popularPosts", "recentPosts"}, allEntries = true)
    public PostResponseDto createPost(PostCreateRequestDto requestDto, LabUsers author) {
        log.info("포스트 생성 요청: 제목 = {}, 작성자 = {}", requestDto.getTitle(), author.getNickname());

        LabNavigation category = null;
        if (requestDto.getCategoryId() != null) {
            category = navigationRepository.findById(requestDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
        }

        LabPost post = LabPost.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .summary(requestDto.getSummary())
                .thumbnailUrl(requestDto.getThumbnailUrl())
                .category(category)
                .author(author)
                .status(PostStatus.valueOf(requestDto.getStatus() != null ? requestDto.getStatus() : "DRAFT"))
                .isFeatured(requestDto.getIsFeatured() != null ? requestDto.getIsFeatured() : false)
                .build();

        post.setTagList(requestDto.getTags());

        // 발행 상태인 경우 발행일시 설정
        if (post.getStatus() == PostStatus.PUBLISHED) {
            post.setPublishedDate(LocalDateTime.now());
        }

        LabPost savedPost = postRepository.save(post);
        log.info("포스트 생성 완료: ID = {}", savedPost.getId());

        return PostResponseDto.fromEntity(savedPost);
    }

    /**
     * 포스트 수정
     */
    @Transactional
    @CacheEvict(value = {"posts", "popularPosts", "recentPosts"}, allEntries = true)
    public PostResponseDto updatePost(Long postId, PostUpdateRequestDto requestDto, LabUsers currentUser) {
        log.info("포스트 수정 요청: ID = {}, 사용자 = {}", postId, currentUser.getNickname());

        LabPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("포스트를 찾을 수 없습니다."));

        // 권한 확인 (작성자 또는 관리자만 수정 가능)
        if (!post.isOwnedBy(currentUser) && !currentUser.isAdmin()) {
            throw new RuntimeException("포스트를 수정할 권한이 없습니다.");
        }

        // 카테고리 업데이트
        if (requestDto.getCategoryId() != null) {
            LabNavigation category = navigationRepository.findById(requestDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
            post.setCategory(category);
        }

        // 포스트 정보 업데이트
        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setSummary(requestDto.getSummary());
        post.setThumbnailUrl(requestDto.getThumbnailUrl());
        post.setTagList(requestDto.getTags());

        if (requestDto.getIsFeatured() != null) {
            post.setIsFeatured(requestDto.getIsFeatured());
        }

        // 상태 변경 처리
        PostStatus newStatus = PostStatus.valueOf(requestDto.getStatus());
        if (post.getStatus() != newStatus) {
            if (newStatus == PostStatus.PUBLISHED && post.getPublishedDate() == null) {
                post.setPublishedDate(LocalDateTime.now());
            } else if (newStatus != PostStatus.PUBLISHED) {
                post.setPublishedDate(null);
            }
            post.setStatus(newStatus);
        }

        LabPost updatedPost = postRepository.save(post);
        log.info("포스트 수정 완료: ID = {}", updatedPost.getId());

        return PostResponseDto.fromEntity(updatedPost);
    }

    /**
     * 포스트 조회 (조회수 증가)
     */
    @Transactional
    public PostResponseDto getPost(Long postId) {
        log.info("포스트 조회 요청: ID = {}", postId);

        LabPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("포스트를 찾을 수 없습니다."));

        // 조회수 증가
        postRepository.incrementViewCount(postId);
        post.incrementViewCount();

        return PostResponseDto.fromEntity(post);
    }

    /**
     * 포스트 목록 조회
     */
    @Cacheable(value = "posts", key = "#pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<PostResponseDto> getPosts(Pageable pageable) {
        log.info("포스트 목록 조회 요청: 페이지 = {}, 크기 = {}", pageable.getPageNumber(), pageable.getPageSize());

        Page<LabPost> posts = postRepository.findPublishedPosts(pageable);
        return posts.map(PostResponseDto::fromEntity);
    }

    /**
     * 카테고리별 포스트 조회
     */
    public Page<PostResponseDto> getPostsByCategory(Long categoryId, Pageable pageable) {
        log.info("카테고리별 포스트 조회 요청: 카테고리 ID = {}", categoryId);

        Page<LabPost> posts = postRepository.findPublishedPostsByCategory(categoryId, pageable);
        return posts.map(PostResponseDto::fromEntity);
    }

    /**
     * 작성자별 포스트 조회
     */
    public Page<PostResponseDto> getPostsByAuthor(LabUsers author, Pageable pageable) {
        log.info("작성자별 포스트 조회 요청: 작성자 = {}", author.getNickname());

        Page<LabPost> posts = postRepository.findPostsByAuthor(author, pageable);
        return posts.map(PostResponseDto::fromEntity);
    }

    /**
     * 포스트 검색
     */
    public Page<PostResponseDto> searchPosts(String keyword, Pageable pageable) {
        log.info("포스트 검색 요청: 키워드 = {}", keyword);

        Page<LabPost> posts = postRepository.searchPublishedPosts(keyword, pageable);
        return posts.map(PostResponseDto::fromEntity);
    }

    /**
     * 태그별 포스트 조회
     */
    public Page<PostResponseDto> getPostsByTag(String tag, Pageable pageable) {
        log.info("태그별 포스트 조회 요청: 태그 = {}", tag);

        Page<LabPost> posts = postRepository.findPublishedPostsByTag(tag, pageable);
        return posts.map(PostResponseDto::fromEntity);
    }

    /**
     * 추천 포스트 조회
     */
    @Cacheable(value = "featuredPosts")
    public List<PostResponseDto> getFeaturedPosts() {
        log.info("추천 포스트 조회 요청");

        List<LabPost> posts = postRepository.findFeaturedPosts();
        return posts.stream()
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 인기 포스트 조회 (최근 7일)
     */
    @Cacheable(value = "popularPosts")
    public List<PostResponseDto> getPopularPosts(int limit) {
        log.info("인기 포스트 조회 요청: 제한 = {}", limit);

        LocalDateTime fromDate = LocalDateTime.now().minusDays(7);
        Pageable pageable = PageRequest.of(0, limit);

        List<LabPost> posts = postRepository.findPopularPosts(fromDate, pageable);
        return posts.stream()
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 최근 포스트 조회
     */
    @Cacheable(value = "recentPosts")
    public List<PostResponseDto> getRecentPosts(int limit) {
        log.info("최근 포스트 조회 요청: 제한 = {}", limit);

        Pageable pageable = PageRequest.of(0, limit);
        List<LabPost> posts = postRepository.findRecentPosts(pageable);
        return posts.stream()
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 포스트 삭제
     */
    @Transactional
    @CacheEvict(value = {"posts", "popularPosts", "recentPosts", "featuredPosts"}, allEntries = true)
    public void deletePost(Long postId, LabUsers currentUser) {
        log.info("포스트 삭제 요청: ID = {}, 사용자 = {}", postId, currentUser.getNickname());

        LabPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("포스트를 찾을 수 없습니다."));

        // 권한 확인 (작성자 또는 관리자만 삭제 가능)
        if (!post.isOwnedBy(currentUser) && !currentUser.isAdmin()) {
            throw new RuntimeException("포스트를 삭제할 권한이 없습니다.");
        }

        postRepository.delete(post);
        log.info("포스트 삭제 완료: ID = {}", postId);
    }

    /**
     * 포스트 좋아요/취소
     */
    @Transactional
    public PostResponseDto togglePostLike(Long postId, LabUsers currentUser) {
        log.info("포스트 좋아요 토글 요청: ID = {}, 사용자 = {}", postId, currentUser.getNickname());

        LabPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("포스트를 찾을 수 없습니다."));

        // TODO: 실제로는 별도의 좋아요 테이블을 만들어서 중복 방지 처리
        // 여기서는 단순히 카운트만 증가/감소
        post.incrementLikeCount();
        LabPost updatedPost = postRepository.save(post);

        return PostResponseDto.fromEntity(updatedPost);
    }

    /**
     * 댓글 수 업데이트
     */
    @Transactional
    public void updateCommentCount(Long postId, Long commentCount) {
        postRepository.updateCommentCount(postId, commentCount);
    }
}