package kr.labit.blog.controller;

import kr.labit.blog.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileUploadService fileUploadService;

    /**
     * 파일 서빙 (공개 API)
     * GET /api/files/profiles/2025/01/filename.jpg
     */
    @GetMapping("/{subDir}/{yearMonth}/{fileName:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String subDir,
            @PathVariable String yearMonth,
            @PathVariable String fileName) {

        try {
            log.debug("파일 요청: subDir={}, yearMonth={}, fileName={}", subDir, yearMonth, fileName);

            // 파일 경로 조회
            Path filePath = fileUploadService.getFilePath(subDir, yearMonth, fileName);

            // 파일 존재 여부 확인
            if (!Files.exists(filePath)) {
                log.warn("파일이 존재하지 않음: {}", filePath);
                return ResponseEntity.notFound().build();
            }

            // 파일을 Resource로 변환
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                log.error("파일을 읽을 수 없음: {}", filePath);
                return ResponseEntity.notFound().build();
            }

            // Content-Type 결정
            String contentType = determineContentType(filePath);

            log.info("파일 서빙 성공: {}", filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600") // 1시간 캐시
                    .body(resource);

        } catch (Exception e) {
            log.error("파일 서빙 실패: subDir={}, yearMonth={}, fileName={}", subDir, yearMonth, fileName, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 파일 목록 조회 (관리자 전용)
     */
    @GetMapping("/list/{subDir}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<String>> getFileList(@PathVariable String subDir) {
        try {
            log.info("파일 목록 조회 요청: {}", subDir);
            List<String> files = fileUploadService.getUploadedFiles(subDir);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            log.error("파일 목록 조회 실패: {}", subDir, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 파일 삭제 (관리자 전용)
     */
    @DeleteMapping("/{subDir}/{yearMonth}/{fileName:.+}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteFile(
            @PathVariable String subDir,
            @PathVariable String yearMonth,
            @PathVariable String fileName) {

        try {
            log.info("파일 삭제 요청: subDir={}, yearMonth={}, fileName={}", subDir, yearMonth, fileName);

            String fileUrl = String.format("/api/files/%s/%s/%s", subDir, yearMonth, fileName);
            boolean deleted = fileUploadService.deleteFile(fileUrl);

            if (deleted) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "파일이 성공적으로 삭제되었습니다.",
                        "deletedFile", fileName
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "success", false,
                                "message", "파일을 찾을 수 없습니다."
                        ));
            }

        } catch (Exception e) {
            log.error("파일 삭제 실패: subDir={}, yearMonth={}, fileName={}", subDir, yearMonth, fileName, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "success", false,
                            "message", "파일 삭제 중 오류가 발생했습니다."
                    ));
        }
    }

    /**
     * 업로드 통계 조회 (관리자 전용)
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getUploadStats() {
        try {
            log.info("업로드 통계 조회 요청");

            long directorySize = fileUploadService.getDirectorySize();
            List<String> profileFiles = fileUploadService.getUploadedFiles("profiles");
            String uploadInfo = fileUploadService.getUploadInfo();

            Map<String, Object> stats = Map.of(
                    "totalSize", directorySize,
                    "totalSizeMB", Math.round(directorySize / (1024.0 * 1024.0) * 100.0) / 100.0,
                    "profileImageCount", profileFiles.size(),
                    "uploadInfo", uploadInfo,
                    "profileImages", profileFiles
            );

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            log.error("업로드 통계 조회 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 파일 존재 여부 확인 (공개 API)
     */
    @GetMapping("/exists/{subDir}/{yearMonth}/{fileName:.+}")
    public ResponseEntity<Map<String, Object>> checkFileExists(
            @PathVariable String subDir,
            @PathVariable String yearMonth,
            @PathVariable String fileName) {

        try {
            boolean exists = fileUploadService.fileExists(subDir, yearMonth, fileName);

            return ResponseEntity.ok(Map.of(
                    "exists", exists,
                    "subDir", subDir,
                    "yearMonth", yearMonth,
                    "fileName", fileName
            ));

        } catch (Exception e) {
            log.error("파일 존재 여부 확인 실패: {}/{}/{}", subDir, yearMonth, fileName, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Content-Type 결정
     */
    private String determineContentType(Path filePath) {
        try {
            String contentType = Files.probeContentType(filePath);
            if (contentType != null) {
                return contentType;
            }
        } catch (IOException e) {
            log.warn("Content-Type 결정 실패: {}", filePath, e);
        }

        // 확장자 기반 fallback
        String fileName = filePath.getFileName().toString().toLowerCase();
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.endsWith(".png")) {
            return "image/png";
        } else if (fileName.endsWith(".gif")) {
            return "image/gif";
        } else if (fileName.endsWith(".webp")) {
            return "image/webp";
        }

        return "application/octet-stream";
    }
}