package kr.labit.blog.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.labit.blog.dto.PostCreateRequestDto;
import kr.labit.blog.dto.PostResponseDto;
import kr.labit.blog.dto.PostUpdateRequestDto;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Post", description = "포스트 관리 API")
@CrossOrigin(origins = "${app.frontend-url}", maxAge = 3600)
public class PostController {

    private final PostService postService;

    @PostMapping
    @Operation(summary = "포스트 생성", description = "새로운 포스트를 생성합니다.")
    public ResponseEntity<PostResponseDto> createPost(@RequestBody PostCreateRequestDto requestDto) {
        LabUsers currentUser = getCurrentUser();
        PostResponseDto post = postService.createPost(requestDto, currentUser);
        return ResponseEntity.ok(post);
    }

    @PutMapping("/{postId}")
    @Operation(summary = "포스트 수정", description = "기존 포스트를 수정합니다.")
    public ResponseEntity<PostResponseDto> updatePost(
            @PathVariable Long postId,
            @RequestBody PostUpdateRequestDto requestDto) {
        LabUsers currentUser = getCurrentUser();
        PostResponseDto post = postService.updatePost(postId, requestDto, currentUser);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/{postId}")
    @Operation(summary = "포스트 조회", description = "특정 포스트를 조회합니다.")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long postId) {
        PostResponseDto post = postService.getPost(postId);
        return ResponseEntity.ok(post);
    }

    @GetMapping
    @Operation(summary = "포스트 목록 조회", description = "발행된 포스트 목록을 조회합니다.")
    public ResponseEntity<Page<PostResponseDto>> getPosts(
            @Parameter(description = "페이지 번호 (0부터 시작)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기") @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponseDto> posts = postService.getPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "카테고리별 포스트 조회", description = "특정 카테고리의 포스트를 조회합니다.")
    public ResponseEntity<Page<PostResponseDto>> getPostsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponseDto> posts = postService.getPostsByCategory(categoryId, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search")
    @Operation(summary = "포스트 검색", description = "키워드로 포스트를 검색합니다.")
    public ResponseEntity<Page<PostResponseDto>> searchPosts(
            @Parameter(description = "검색 키워드") @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponseDto> posts = postService.searchPosts(keyword, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/tag/{tag}")
    @Operation(summary = "태그별 포스트 조회", description = "특정 태그의 포스트를 조회합니다.")
    public ResponseEntity<Page<PostResponseDto>> getPostsByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponseDto> posts = postService.getPostsByTag(tag, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/featured")
    @Operation(summary = "추천 포스트 조회", description = "추천 포스트 목록을 조회합니다.")
    public ResponseEntity<List<PostResponseDto>> getFeaturedPosts() {
        List<PostResponseDto> posts = postService.getFeaturedPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/popular")
    @Operation(summary = "인기 포스트 조회", description = "인기 포스트 목록을 조회합니다.")
    public ResponseEntity<List<PostResponseDto>> getPopularPosts(
            @RequestParam(defaultValue = "10") int limit) {
        List<PostResponseDto> posts = postService.getPopularPosts(limit);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/recent")
    @Operation(summary = "최근 포스트 조회", description = "최근 포스트 목록을 조회합니다.")
    public ResponseEntity<List<PostResponseDto>> getRecentPosts(
            @RequestParam(defaultValue = "10") int limit) {
        List<PostResponseDto> posts = postService.getRecentPosts(limit);
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "포스트 삭제", description = "포스트를 삭제합니다.")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        LabUsers currentUser = getCurrentUser();
        postService.deletePost(postId, currentUser);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/like")
    @Operation(summary = "포스트 좋아요", description = "포스트에 좋아요를 추가/제거합니다.")
    public ResponseEntity<PostResponseDto> togglePostLike(@PathVariable Long postId) {
        LabUsers currentUser = getCurrentUser();
        PostResponseDto post = postService.togglePostLike(postId, currentUser);
        return ResponseEntity.ok(post);
    }

    private LabUsers getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                !(authentication.getPrincipal() instanceof LabUsers)) {
            throw new RuntimeException("인증이 필요합니다.");
        }
        return (LabUsers) authentication.getPrincipal();
    }
}