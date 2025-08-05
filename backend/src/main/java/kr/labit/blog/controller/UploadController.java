package kr.labit.blog.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.labit.blog.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Upload", description = "파일 업로드 관련 API")
@CrossOrigin(origins = "${app.frontend-url}", maxAge = 3600)
public class UploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/image")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "이미지 파일 업로드",
            description = "프로필 이미지나 포스트 이미지를 업로드합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "업로드 성공",
                            content = @Content(schema = @Schema(example = """
                    {
                        "success": true,
                        "message": "이미지 업로드 완료",
                        "fileUrl": "http://localhost:10001/api/files/profiles/2025/01/20250101_123456_abc12345.jpg",
                        "fileName": "20250101_123456_abc12345.jpg"
                    }
                    """))
                    ),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청"),
                    @ApiResponse(responseCode = "401", description = "인증 필요"),
                    @ApiResponse(responseCode = "413", description = "파일 크기 초과"),
                    @ApiResponse(responseCode = "415", description = "지원하지 않는 파일 형식")
            }
    )
    public ResponseEntity<Map<String, Object>> uploadImage(
            @Parameter(description = "업로드할 이미지 파일", required = true)
            @RequestParam("file") MultipartFile file,
            @Parameter(description = "이미지 타입 (기본값: profile)", example = "profile")
            @RequestParam(value = "type", defaultValue = "profile") String type) {

        log.info("이미지 업로드 요청: fileName={}, fileSize={}, type={}",
                file.getOriginalFilename(), file.getSize(), type);

        try {
            // 파일 유효성 검사
            validateImageFile(file);

            String fileUrl;
            switch (type.toLowerCase()) {
                case "profile":
                case "thumbnail":
                    fileUrl = fileUploadService.uploadProfileImage(file);
                    break;
                case "post":
                case "image":
                    fileUrl = fileUploadService.uploadPostImage(file);
                    break;
                default:
                    // 기본적으로 프로필 이미지로 처리
                    fileUrl = fileUploadService.uploadProfileImage(file);
                    break;
            }

            // 파일명 추출
            String fileName = extractFileNameFromUrl(fileUrl);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "이미지 업로드 완료",
                    "fileUrl", fileUrl,
                    "fileName", fileName
            );

            log.info("이미지 업로드 성공: fileUrl={}", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("이미지 업로드 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {
            log.error("이미지 업로드 실패", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "success", false,
                            "message", "이미지 업로드 중 오류가 발생했습니다."
                    ));
        }
    }

    @PostMapping("/file")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "일반 파일 업로드",
            description = "문서, 동영상 등 일반 파일을 업로드합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "업로드 성공"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청"),
                    @ApiResponse(responseCode = "401", description = "인증 필요")
            }
    )
    public ResponseEntity<Map<String, Object>> uploadFile(
            @Parameter(description = "업로드할 파일", required = true)
            @RequestParam("file") MultipartFile file) {

        log.info("파일 업로드 요청: fileName={}, fileSize={}",
                file.getOriginalFilename(), file.getSize());

        try {
            // 기본 파일 유효성 검사
            validateFile(file);

            // 현재는 이미지만 지원하므로 이미지로 처리
            String fileUrl = fileUploadService.uploadPostImage(file);
            String fileName = extractFileNameFromUrl(fileUrl);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "파일 업로드 완료",
                    "fileUrl", fileUrl,
                    "fileName", fileName
            );

            log.info("파일 업로드 성공: fileUrl={}", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("파일 업로드 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {
            log.error("파일 업로드 실패", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "success", false,
                            "message", "파일 업로드 중 오류가 발생했습니다."
                    ));
        }
    }

    @PostMapping("/thumbnail")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "썸네일 이미지 업로드",
            description = "포스트 썸네일 이미지를 업로드합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "업로드 성공"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청"),
                    @ApiResponse(responseCode = "401", description = "인증 필요")
            }
    )
    public ResponseEntity<Map<String, Object>> uploadThumbnail(
            @Parameter(description = "업로드할 썸네일 이미지", required = true)
            @RequestParam("file") MultipartFile file) {

        log.info("썸네일 업로드 요청: fileName={}, fileSize={}",
                file.getOriginalFilename(), file.getSize());

        try {
            validateImageFile(file);

            String fileUrl = fileUploadService.uploadProfileImage(file); // 썸네일도 프로필 디렉토리 사용
            String fileName = extractFileNameFromUrl(fileUrl);

            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "썸네일 업로드 완료",
                    "fileUrl", fileUrl,
                    "fileName", fileName
            );

            log.info("썸네일 업로드 성공: fileUrl={}", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("썸네일 업로드 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {
            log.error("썸네일 업로드 실패", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "success", false,
                            "message", "썸네일 업로드 중 오류가 발생했습니다."
                    ));
        }
    }

    @GetMapping("/validate-url")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "이미지 URL 검증",
            description = "외부 이미지 URL의 유효성을 검증합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "검증 완료"),
                    @ApiResponse(responseCode = "400", description = "유효하지 않은 URL"),
                    @ApiResponse(responseCode = "401", description = "인증 필요")
            }
    )
    public ResponseEntity<Map<String, Object>> validateImageUrl(
            @Parameter(description = "검증할 이미지 URL", required = true)
            @RequestParam("url") String url) {
        log.info("이미지 URL 검증 요청: url={}", url);

        try {
            // 간단한 URL 형식 검증
            if (url == null || url.trim().isEmpty()) {
                throw new IllegalArgumentException("URL이 비어있습니다.");
            }

            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                throw new IllegalArgumentException("올바른 URL 형식이 아닙니다.");
            }

            // 이미지 확장자 검증
            String lowerUrl = url.toLowerCase();
            boolean isImageUrl = lowerUrl.endsWith(".jpg") || lowerUrl.endsWith(".jpeg") ||
                    lowerUrl.endsWith(".png") || lowerUrl.endsWith(".gif") ||
                    lowerUrl.endsWith(".webp");

            Map<String, Object> response = Map.of(
                    "valid", isImageUrl,
                    "url", url,
                    "message", isImageUrl ? "유효한 이미지 URL입니다." : "이미지 URL이 아닙니다."
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("URL 검증 실패: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "valid", false,
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {
            log.error("URL 검증 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "valid", false,
                            "message", "URL 검증 중 오류가 발생했습니다."
                    ));
        }
    }

    /**
     * 이미지 파일 유효성 검사
     */
    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        // 파일 크기 체크 (5MB)
        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("파일 크기가 5MB를 초과합니다.");
        }

        // 파일 타입 체크
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
        }

        // 허용된 확장자 체크
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("파일명이 없습니다.");
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!isAllowedImageExtension(extension)) {
            throw new IllegalArgumentException("지원하지 않는 이미지 형식입니다. (jpg, jpeg, png, gif만 지원)");
        }
    }

    /**
     * 일반 파일 유효성 검사
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        // 파일 크기 체크 (10MB)
        long maxSize = 10 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("파일 크기가 10MB를 초과합니다.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("파일명이 없습니다.");
        }
    }

    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    /**
     * 허용된 이미지 확장자인지 확인
     */
    private boolean isAllowedImageExtension(String extension) {
        return "jpg".equals(extension) || "jpeg".equals(extension) ||
                "png".equals(extension) || "gif".equals(extension);
    }

    /**
     * URL에서 파일명 추출
     */
    private String extractFileNameFromUrl(String url) {
        if (url == null) {
            return "";
        }
        return url.substring(url.lastIndexOf('/') + 1);
    }
}