package kr.labit.blog.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.labit.blog.dto.CommentCreateRequestDto;
import kr.labit.blog.dto.CommentResponseDto;
import kr.labit.blog.dto.CommentUpdateRequestDto;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Comment", description = "댓글 관리 API")
@CrossOrigin(origins = "${app.frontend-url}", maxAge = 3600)
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @Operation(summary = "댓글 생성", description = "새로운 댓글을 생성합니다.")
    public ResponseEntity<CommentResponseDto> createComment(@RequestBody CommentCreateRequestDto requestDto) {
        LabUsers currentUser = getCurrentUser();
        CommentResponseDto comment = commentService.createComment(requestDto, currentUser);
        return ResponseEntity.ok(comment);
    }

    @PutMapping("/{commentId}")
    @Operation(summary = "댓글 수정", description = "기존 댓글을 수정합니다.")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentUpdateRequestDto requestDto) {
        LabUsers currentUser = getCurrentUser();
        CommentResponseDto comment = commentService.updateComment(commentId, requestDto, currentUser);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{commentId}")
    @Operation(summary = "댓글 삭제", description = "댓글을 삭제합니다.")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        LabUsers currentUser = getCurrentUser();
        commentService.deleteComment(commentId, currentUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/{postId}")
    @Operation(summary = "포스트 댓글 조회", description = "특정 포스트의 댓글을 조회합니다.")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByPost(@PathVariable Long postId) {
        List<CommentResponseDto> comments = commentService.getCommentsByPost(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{commentId}/like")
    @Operation(summary = "댓글 좋아요", description = "댓글에 좋아요를 추가/제거합니다.")
    public ResponseEntity<CommentResponseDto> toggleCommentLike(@PathVariable Long commentId) {
        LabUsers currentUser = getCurrentUser();
        CommentResponseDto comment = commentService.toggleCommentLike(commentId, currentUser);
        return ResponseEntity.ok(comment);
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