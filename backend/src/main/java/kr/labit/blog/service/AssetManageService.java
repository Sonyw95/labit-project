package kr.labit.blog.service;

import jakarta.persistence.EntityNotFoundException;
import kr.labit.blog.dto.asset.AssetFileResponseDto;
import kr.labit.blog.dto.asset.AssetFolderRequestDto;
import kr.labit.blog.dto.asset.AssetFolderResponseDto;
import kr.labit.blog.dto.asset.AssetOrderDto;
import kr.labit.blog.entity.LabAsset;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.repository.LabAssetRepository;
import kr.labit.blog.repository.LabUsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AssetManageService {

    private final LabAssetRepository assetRepository;
    private final LabUsersRepository usersRepository;
    private final FileStorageService fileStorageService;
    private final ActivityLogService activityLogService;

    /**
     * 모든 에셋 조회 (관리자용)
     */
    @Cacheable(value = "adminAssets")
    public List<Object> getAllAssets() {
        log.info("모든 에셋 조회");

        List<LabAsset> assets = assetRepository.findAllOrderBySortOrder();
        List<Object> result = new ArrayList<>();

        for (LabAsset asset : assets) {
            if (asset.isFolder()) {
                result.add(AssetFolderResponseDto.builder()
                        .id(asset.getId())
                        .name(asset.getName())
                        .description(asset.getDescription())
                        .parentId(asset.getParentId())
                        .sortOrder(asset.getSortOrder())
                        .depth(asset.getDepth())
                        .createdDate(asset.getCreatedDate())
                        .modifiedDate(asset.getModifiedDate())
                        .type("folder")
                        .fileCount(countFilesInFolder(asset.getId()))
                        .build());
            } else {
                result.add(AssetFileResponseDto.builder()
                        .id(asset.getId())
                        .name(asset.getName())
                        .originalName(asset.getOriginalName())
                        .url(asset.getUrl())
                        .mimeType(asset.getMimeType())
                        .size(asset.getSize())
                        .folderId(asset.getFolderId())
                        .sortOrder(asset.getSortOrder())
                        .uploadedDate(asset.getCreatedDate())
                        .type("file")
                        .uploaderName(asset.getUploader() != null ? asset.getUploader().getNickname() : null)
                        .description(asset.getDescription())
                        .build());
            }
        }

        return result;
    }

    /**
     * 에셋 폴더 생성
     */
    @Transactional
    @CacheEvict(value = "adminAssets", allEntries = true)
    public AssetFolderResponseDto createAssetFolder(AssetFolderRequestDto requestDto) {
        log.info("에셋 폴더 생성: {}", requestDto.getName());

        // 부모 폴더 검증
        if (requestDto.getParentId() != null) {
            LabAsset parent = assetRepository.findById(requestDto.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("부모 폴더를 찾을 수 없습니다: " + requestDto.getParentId()));

            if (!parent.isFolder()) {
                throw new IllegalArgumentException("부모가 폴더가 아닙니다.");
            }
        }

        Integer maxSortOrder = getMaxSortOrder(requestDto.getParentId());
        Integer depth = calculateDepth(requestDto.getParentId());

        LabAsset folder = LabAsset.builder()
                .name(requestDto.getName())
                .type("folder")
                .description(requestDto.getDescription())
                .parentId(requestDto.getParentId())
                .sortOrder(maxSortOrder + 1)
                .depth(depth)
                .uploader(getCurrentUser())
                .build();

        LabAsset saved = assetRepository.save(folder);

        // 활동 로그 기록
        activityLogService.logActivity("에셋 폴더 생성", "폴더 생성: " + saved.getName(),
                "success", "asset", saved.getId());

        return AssetFolderResponseDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .parentId(saved.getParentId())
                .sortOrder(saved.getSortOrder())
                .depth(saved.getDepth())
                .createdDate(saved.getCreatedDate())
                .modifiedDate(saved.getModifiedDate())
                .type("folder")
                .fileCount(0)
                .build();
    }

    /**
     * 에셋 폴더 수정
     */
    @Transactional
    @CacheEvict(value = "adminAssets", allEntries = true)
    public AssetFolderResponseDto updateAssetFolder(Long id, AssetFolderRequestDto requestDto) {
        log.info("에셋 폴더 수정: ID={}", id);

        LabAsset folder = assetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("폴더를 찾을 수 없습니다: " + id));

        if (!folder.isFolder()) {
            throw new IllegalArgumentException("폴더가 아닙니다.");
        }

        String oldName = folder.getName();
        folder.setName(requestDto.getName());
        folder.setDescription(requestDto.getDescription());

        LabAsset updated = assetRepository.save(folder);

        // 활동 로그 기록
        activityLogService.logActivity("에셋 폴더 수정",
                String.format("폴더 수정: %s -> %s", oldName, updated.getName()),
                "success", "asset", updated.getId());

        return AssetFolderResponseDto.builder()
                .id(updated.getId())
                .name(updated.getName())
                .description(updated.getDescription())
                .parentId(updated.getParentId())
                .sortOrder(updated.getSortOrder())
                .depth(updated.getDepth())
                .createdDate(updated.getCreatedDate())
                .modifiedDate(updated.getModifiedDate())
                .type("folder")
                .fileCount(countFilesInFolder(updated.getId()))
                .build();
    }

    /**
     * 에셋 폴더 삭제
     */
    @Transactional
    @CacheEvict(value = "adminAssets", allEntries = true)
    public void deleteAssetFolder(Long id) {
        log.info("에셋 폴더 삭제: ID={}", id);

        LabAsset folder = assetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("폴더를 찾을 수 없습니다: " + id));

        if (!folder.isFolder()) {
            throw new IllegalArgumentException("폴더가 아닙니다.");
        }

        // 하위 폴더나 파일들 확인
        List<LabAsset> children = assetRepository.findByParentIdOrFolderId(id, id);
        if (!children.isEmpty()) {
            // 하위 파일들의 물리적 파일 삭제
            for (LabAsset child : children) {
                if (child.isFile() && child.getUrl() != null) {
                    fileStorageService.deleteFile(child.getUrl());
                }
            }
            // 하위 에셋들 삭제
            assetRepository.deleteAll(children);
        }

        String deletedName = folder.getName();
        assetRepository.delete(folder);

        // 활동 로그 기록
        activityLogService.logActivity("에셋 폴더 삭제", "폴더 삭제: " + deletedName,
                "success", "asset", id);
    }

    /**
     * 에셋 파일 업로드
     */
    @Transactional
    @CacheEvict(value = "adminAssets", allEntries = true)
    public AssetFileResponseDto uploadAssetFile(MultipartFile file, Long folderId) {
        log.info("에셋 파일 업로드: 파일명={}, 폴더ID={}", file.getOriginalFilename(), folderId);

        // 폴더 검증
        if (folderId != null) {
            LabAsset folder = assetRepository.findById(folderId)
                    .orElseThrow(() -> new EntityNotFoundException("폴더를 찾을 수 없습니다: " + folderId));

            if (!folder.isFolder()) {
                throw new IllegalArgumentException("지정된 ID가 폴더가 아닙니다.");
            }
        }

        // 파일 저장
        String fileUrl = fileStorageService.storeFile(file);

        Integer maxSortOrder = getMaxSortOrderForFiles(folderId);

        LabAsset asset = LabAsset.builder()
                .name(generateUniqueFileName(file.getOriginalFilename()))
                .originalName(file.getOriginalFilename())
                .type("file")
                .url(fileUrl)
                .mimeType(file.getContentType())
                .size(file.getSize())
                .folderId(folderId)
                .sortOrder(maxSortOrder + 1)
                .uploader(getCurrentUser())
                .build();

        LabAsset saved = assetRepository.save(asset);

        // 활동 로그 기록
        activityLogService.logActivity("에셋 파일 업로드", "파일 업로드: " + saved.getOriginalName(),
                "success", "asset", saved.getId());

        return AssetFileResponseDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .originalName(saved.getOriginalName())
                .url(saved.getUrl())
                .mimeType(saved.getMimeType())
                .size(saved.getSize())
                .folderId(saved.getFolderId())
                .sortOrder(saved.getSortOrder())
                .uploadedDate(saved.getCreatedDate())
                .type("file")
                .uploaderName(saved.getUploader() != null ? saved.getUploader().getNickname() : null)
                .build();
    }

    /**
     * 에셋 파일 삭제
     */
    @Transactional
    @CacheEvict(value = "adminAssets", allEntries = true)
    public void deleteAssetFile(Long id) {
        log.info("에셋 파일 삭제: ID={}", id);

        LabAsset asset = assetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("파일을 찾을 수 없습니다: " + id));

        if (!asset.isFile()) {
            throw new IllegalArgumentException("파일이 아닙니다.");
        }

        // 물리적 파일 삭제
        if (asset.getUrl() != null) {
            fileStorageService.deleteFile(asset.getUrl());
        }

        String deletedName = asset.getOriginalName();
        assetRepository.delete(asset);

        // 활동 로그 기록
        activityLogService.logActivity("에셋 파일 삭제", "파일 삭제: " + deletedName,
                "success", "asset", id);
    }

    /**
     * 에셋 이동
     */
    @Transactional
    @CacheEvict(value = "adminAssets", allEntries = true)
    public void moveAsset(Long assetId, Long targetFolderId) {
        log.info("에셋 이동: 에셋ID={}, 목표 폴더ID={}", assetId, targetFolderId);

        LabAsset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new EntityNotFoundException("에셋을 찾을 수 없습니다: " + assetId));

        // 목표 폴더 검증
        if (targetFolderId != null) {
            LabAsset targetFolder = assetRepository.findById(targetFolderId)
                    .orElseThrow(() -> new EntityNotFoundException("목표 폴더를 찾을 수 없습니다: " + targetFolderId));

            if (!targetFolder.isFolder()) {
                throw new IllegalArgumentException("목표가 폴더가 아닙니다.");
            }

            // 폴더를 자기 자신이나 하위 폴더로 이동하는 것 방지
            if (asset.isFolder()) {
                validateFolderMove(assetId, targetFolderId);
            }
        }

        Long oldLocation = asset.isFolder() ? asset.getParentId() : asset.getFolderId();

        if (asset.isFolder()) {
            asset.setParentId(targetFolderId);
            asset.setDepth(calculateDepth(targetFolderId));
        } else {
            asset.setFolderId(targetFolderId);
        }

        asset.setSortOrder(asset.isFolder() ?
                getMaxSortOrder(targetFolderId) + 1 :
                getMaxSortOrderForFiles(targetFolderId) + 1);

        assetRepository.save(asset);

        // 활동 로그 기록
        activityLogService.logActivity("에셋 이동",
                String.format("에셋 이동: %s (%s -> %s)", asset.getName(), oldLocation, targetFolderId),
                "success", "asset", assetId);
    }

    /**
     * 에셋 순서 변경
     */
    @Transactional
    @CacheEvict(value = "adminAssets", allEntries = true)
    public void updateAssetOrder(List<AssetOrderDto> orderData) {
        log.info("에셋 순서 변경: {} 개 에셋", orderData.size());

        for (AssetOrderDto order : orderData) {
            LabAsset asset = assetRepository.findById(order.getId())
                    .orElseThrow(() -> new EntityNotFoundException("에셋을 찾을 수 없습니다: " + order.getId()));

            asset.setSortOrder(order.getSortOrder());

            if (asset.isFolder()) {
                asset.setParentId(order.getFolderId());
                asset.setDepth(calculateDepth(order.getFolderId()));
            } else {
                asset.setFolderId(order.getFolderId());
            }

            assetRepository.save(asset);
        }

        // 활동 로그 기록
        activityLogService.logActivity("에셋 순서 변경",
                orderData.size() + "개 에셋 순서 변경", "success", "asset", null);
    }

    // 헬퍼 메소드들

    private LabUsers getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return usersRepository.findByEmail(username).orElse(null);
    }

    private Integer countFilesInFolder(Long folderId) {
        return assetRepository.countByFolderIdAndType(folderId, "file");
    }

    private Integer getMaxSortOrder(Long parentId) {
        List<LabAsset> siblings = assetRepository.findByParentIdAndType(parentId, "folder");
        return siblings.stream()
                .mapToInt(asset -> asset.getSortOrder() != null ? asset.getSortOrder() : 0)
                .max()
                .orElse(0);
    }

    private Integer getMaxSortOrderForFiles(Long folderId) {
        List<LabAsset> files = assetRepository.findByFolderIdAndType(folderId, "file");
        return files.stream()
                .mapToInt(asset -> asset.getSortOrder() != null ? asset.getSortOrder() : 0)
                .max()
                .orElse(0);
    }

    private Integer calculateDepth(Long parentId) {
        if (parentId == null) {
            return 0;
        }

        LabAsset parent = assetRepository.findById(parentId)
                .orElseThrow(() -> new EntityNotFoundException("부모 폴더를 찾을 수 없습니다: " + parentId));

        return (parent.getDepth() != null ? parent.getDepth() : 0) + 1;
    }

    private String generateUniqueFileName(String originalFilename) {
        String extension = "";
        int lastDotIndex = originalFilename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            extension = originalFilename.substring(lastDotIndex);
        }

        String baseName = originalFilename.substring(0, lastDotIndex > 0 ? lastDotIndex : originalFilename.length());
        String timestamp = String.valueOf(System.currentTimeMillis());

        return baseName + "_" + timestamp + extension;
    }

    private void validateFolderMove(Long folderId, Long targetFolderId) {
        if (folderId.equals(targetFolderId)) {
            throw new IllegalArgumentException("폴더를 자기 자신으로 이동할 수 없습니다.");
        }

        // 하위 폴더로 이동하는지 검사
        LabAsset targetFolder = assetRepository.findById(targetFolderId)
                .orElseThrow(() -> new EntityNotFoundException("목표 폴더를 찾을 수 없습니다: " + targetFolderId));

        checkCircularReference(folderId, targetFolder);
    }

    private void checkCircularReference(Long folderId, LabAsset candidate) {
        if (candidate.getParentId() == null) {
            return; // 루트에 도달했으므로 순환 참조 없음
        }

        if (candidate.getParentId().equals(folderId)) {
            throw new IllegalArgumentException("폴더를 자신의 하위 폴더로 이동할 수 없습니다.");
        }

        LabAsset parent = assetRepository.findById(candidate.getParentId())
                .orElse(null);

        if (parent != null && parent.isFolder()) {
            checkCircularReference(folderId, parent);
        }
    }
}