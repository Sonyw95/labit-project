package kr.labit.blog.service;

import kr.labit.blog.dto.CommentCreateRequestDto;
import kr.labit.blog.dto.CommentResponseDto;
import kr.labit.blog.dto.CommentUpdateRequestDto;
import kr.labit.blog.entity.LabComment;
import kr.labit.blog.entity.LabPost;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.repository.LabCommentRepository;
import kr.labit.blog.repository.LabPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CommentService {

    private final LabCommentRepository commentRepository;
    private final LabPostRepository postRepository;
    private final PostService postService;

    /**
     * 댓글 생성
     */
    @Transactional
    public CommentResponseDto createComment(CommentCreateRequestDto requestDto, LabUsers author) {
        log.info("댓글 생성 요청: 포스트 ID = {}, 작성자 = {}", requestDto.getPostId(), author.getNickname());

        LabPost post = postRepository.findById(requestDto.getPostId())
                .orElseThrow(() -> new RuntimeException("포스트를 찾을 수 없습니다."));

        LabComment parent = null;
        int depth = 0;

        // 대댓글인 경우
        if (requestDto.getParentId() != null) {
            parent = commentRepository.findById(requestDto.getParentId())
                    .orElseThrow(() -> new RuntimeException("부모 댓글을 찾을 수 없습니다."));

            if (!parent.canReply()) {
                throw new RuntimeException("더 이상 대댓글을 작성할 수 없습니다.");
            }

            depth = parent.getDepth() + 1;
        }

        LabComment comment = LabComment.builder()
                .post(post)
                .author(author)
                .parent(parent)
                .content(requestDto.getContent())
                .depth(depth)
                .build();

        LabComment savedComment = commentRepository.save(comment);

        // 포스트의 댓글 수 업데이트
        updatePostCommentCount(post.getId());

        log.info("댓글 생성 완료: ID = {}", savedComment.getId());
        return CommentResponseDto.fromEntity(savedComment);
    }

    /**
     * 댓글 수정
     */
    @Transactional
    public CommentResponseDto updateComment(Long commentId, CommentUpdateRequestDto requestDto, LabUsers currentUser) {
        log.info("댓글 수정 요청: ID = {}, 사용자 = {}", commentId, currentUser.getNickname());

        LabComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        // 권한 확인
        if (!comment.isOwnedBy(currentUser) && !currentUser.isAdmin()) {
            throw new RuntimeException("댓글을 수정할 권한이 없습니다.");
        }

        // 삭제된 댓글은 수정 불가
        if (comment.getIsDeleted()) {
            throw new RuntimeException("삭제된 댓글은 수정할 수 없습니다.");
        }

        comment.setContent(requestDto.getContent());
        LabComment updatedComment = commentRepository.save(comment);

        log.info("댓글 수정 완료: ID = {}", updatedComment.getId());
        return CommentResponseDto.fromEntity(updatedComment);
    }

    /**
     * 댓글 삭제
     */
    @Transactional
    public void deleteComment(Long commentId, LabUsers currentUser) {
        log.info("댓글 삭제 요청: ID = {}, 사용자 = {}", commentId, currentUser.getNickname());

        LabComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        // 권한 확인
        if (!comment.isOwnedBy(currentUser) && !currentUser.isAdmin()) {
            throw new RuntimeException("댓글을 삭제할 권한이 없습니다.");
        }

        Long postId = comment.getPost().getId();

        // 소프트 삭제
        comment.delete();
        commentRepository.save(comment);

        // 포스트의 댓글 수 업데이트
        updatePostCommentCount(postId);

        log.info("댓글 삭제 완료: ID = {}", commentId);
    }

    /**
     * 포스트의 댓글 목록 조회 (트리 구조)
     */
    public List<CommentResponseDto> getCommentsByPost(Long postId) {
        log.info("포스트 댓글 조회 요청: 포스트 ID = {}", postId);

        LabPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("포스트를 찾을 수 없습니다."));

        List<LabComment> comments = commentRepository.findCommentsByPost(post);
        return buildCommentTree(comments);
    }

    /**
     * 사용자의 댓글 목록 조회
     */
    public Page<CommentResponseDto> getCommentsByAuthor(LabUsers author, Pageable pageable) {
        log.info("사용자별 댓글 조회 요청: 작성자 = {}", author.getNickname());

        Page<LabComment> comments = commentRepository.findCommentsByAuthor(author, pageable);
        return comments.map(CommentResponseDto::fromEntity);
    }

    /**
     * 댓글 좋아요/취소
     */
    @Transactional
    public CommentResponseDto toggleCommentLike(Long commentId, LabUsers currentUser) {
        log.info("댓글 좋아요 토글 요청: ID = {}, 사용자 = {}", commentId, currentUser.getNickname());

        LabComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        // TODO: 실제로는 별도의 좋아요 테이블을 만들어서 중복 방지 처리
        comment.incrementLikeCount();
        LabComment updatedComment = commentRepository.save(comment);

        return CommentResponseDto.fromEntity(updatedComment);
    }

    /**
     * 댓글 트리 구조 구성
     */
    private List<CommentResponseDto> buildCommentTree(List<LabComment> comments) {
        // 부모 ID별로 그룹핑
        Map<Long, List<LabComment>> commentsByParentId = comments.stream()
                .filter(comment -> comment.getParent() != null)
                .collect(Collectors.groupingBy(comment -> comment.getParent().getId()));

        // 최상위 댓글들
        List<LabComment> rootComments = comments.stream()
                .filter(comment -> comment.getParent() == null)
                .collect(Collectors.toList());

        return rootComments.stream()
                .map(comment -> buildCommentDto(comment, commentsByParentId))
                .collect(Collectors.toList());
    }

    /**
     * 댓글 DTO 구성 (재귀적으로 대댓글 포함)
     */
    private CommentResponseDto buildCommentDto(LabComment comment, Map<Long, List<LabComment>> commentsByParentId) {
        CommentResponseDto dto = CommentResponseDto.fromEntity(comment);

        List<LabComment> replies = commentsByParentId.get(comment.getId());
        if (replies != null && !replies.isEmpty()) {
            List<CommentResponseDto> replyDtos = replies.stream()
                    .map(reply -> buildCommentDto(reply, commentsByParentId))
                    .collect(Collectors.toList());
            dto.setReplies(replyDtos);
        } else {
            dto.setReplies(new ArrayList<>());
        }

        return dto;
    }

    /**
     * 포스트의 댓글 수 업데이트
     */
    private void updatePostCommentCount(Long postId) {
        LabPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("포스트를 찾을 수 없습니다."));

        Long commentCount = commentRepository.countCommentsByPost(post);
        postService.updateCommentCount(postId, commentCount);
    }
}