package kr.labit.blog.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.upload.base.url}")
    private String baseUrl;

    /**
     * 프로필 이미지 업로드
     */
    public String uploadProfileImage(MultipartFile file) throws IOException {
        validateImageFile(file);

        // 업로드 디렉토리 생성
        Path uploadPath = createUploadDirectory("profiles");

        // 고유한 파일명 생성
        String fileName = generateUniqueFileName(file.getOriginalFilename());

        // 파일 저장
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Backend API URL 반환
        String fileUrl = generateFileUrl("profiles", fileName);

        log.info("프로필 이미지 업로드 완료: {}", fileUrl);
        log.info("실제 파일 경로: {}", filePath.toAbsolutePath());

        return fileUrl;
    }

    /**
     * 포스트 이미지 업로드 (향후 확장용)
     */
    public String uploadPostImage(MultipartFile file) throws IOException {
        validateImageFile(file);

        Path uploadPath = createUploadDirectory("posts");
        String fileName = generateUniqueFileName(file.getOriginalFilename());

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = generateFileUrl("posts", fileName);
        log.info("포스트 이미지 업로드 완료: {}", fileUrl);

        return fileUrl;
    }

    /**
     * 이미지 파일 검증
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
     * 업로드 디렉토리 생성
     */
    private Path createUploadDirectory(String subDir) throws IOException {
        // 년/월 기반 디렉토리 구조
        String yearMonth = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
        Path uploadPath = Paths.get(uploadDir, subDir, yearMonth);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("업로드 디렉토리 생성: {}", uploadPath.toAbsolutePath());
        }

        return uploadPath;
    }

    /**
     * 고유한 파일명 생성
     */
    private String generateUniqueFileName(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String uuid = UUID.randomUUID().toString();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

        return String.format("%s_%s.%s", timestamp, uuid.substring(0, 8), extension);
    }

    /**
     * Backend API 기반 파일 URL 생성
     */
    private String generateFileUrl(String subDir, String fileName) {
        String yearMonth = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
        return String.format("%s/%s/%s/%s", baseUrl, subDir, yearMonth, fileName);
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
     * 실제 파일 경로 조회 (FileController에서 사용)
     */
    public Path getFilePath(String subDir, String yearMonth, String fileName) {
        return Paths.get(uploadDir, subDir, yearMonth, fileName);
    }

    /**
     * 파일 존재 여부 확인
     */
    public boolean fileExists(String subDir, String yearMonth, String fileName) {
        Path filePath = getFilePath(subDir, yearMonth, fileName);
        return Files.exists(filePath);
    }

    /**
     * 파일 삭제
     */
    public boolean deleteFile(String fileUrl) {
        try {
            String relativePath = extractRelativePathFromUrl(fileUrl);
            Path filePath = Paths.get(uploadDir).resolve(relativePath);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("파일 삭제 완료: {}", filePath);
                return true;
            } else {
                log.warn("삭제할 파일이 존재하지 않음: {}", filePath);
                return false;
            }
        } catch (Exception e) {
            log.error("파일 삭제 실패: {}", fileUrl, e);
            return false;
        }
    }

    /**
     * URL에서 상대 경로 추출
     */
    private String extractRelativePathFromUrl(String fileUrl) {
        String filesPattern = "/api/files/";
        int filesIndex = fileUrl.indexOf(filesPattern);

        if (filesIndex != -1) {
            return fileUrl.substring(filesIndex + filesPattern.length());
        }

        throw new IllegalArgumentException("잘못된 파일 URL 형식입니다.");
    }

    /**
     * 업로드된 파일 목록 조회
     */
    public List<String> getUploadedFiles(String subDir) throws IOException {
        Path uploadPath = Paths.get(uploadDir, subDir);

        if (!Files.exists(uploadPath)) {
            return List.of();
        }

        return Files.walk(uploadPath)
                .filter(Files::isRegularFile)
                .map(path -> {
                    String relativePath = Paths.get(uploadDir).relativize(path).toString();
                    return baseUrl + "/" + relativePath.replace("\\", "/");
                })
                .collect(Collectors.toList());
    }

    /**
     * 디렉토리 크기 조회
     */
    public long getDirectorySize() throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            return 0;
        }

        return Files.walk(uploadPath)
                .filter(Files::isRegularFile)
                .mapToLong(path -> {
                    try {
                        return Files.size(path);
                    } catch (IOException e) {
                        return 0;
                    }
                })
                .sum();
    }

    /**
     * 업로드 디렉토리 정보 조회
     */
    public String getUploadInfo() {
        Path uploadPath = Paths.get(uploadDir);
        return String.format(
                "업로드 설정 - 디렉토리: %s, 절대경로: %s, Base URL: %s",
                uploadDir,
                uploadPath.toAbsolutePath(),
                baseUrl
        );
    }
}