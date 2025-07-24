package kr.labit.blog.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kr.labit.blog.dto.asset.*;
import kr.labit.blog.service.AssetManageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Asset", description = "관리자 에셋 관리 API")
@CrossOrigin(origins = "${app.frontend-url}", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') ")
public class AssetMangeController {

    private final AssetManageService assetManageService;

    @GetMapping("/all")
    @Operation(summary = "모든 에셋 조회", description = "관리자용 모든 에셋(폴더 및 파일)을 조회합니다.")
    public ResponseEntity<List<Object>> getAllAssets() {
        log.info("관리자 에셋 전체 조회 요청");

        List<Object> assets = assetManageService.getAllAssets();

        return ResponseEntity.ok(assets);
    }

    @PostMapping("/folder")
    @Operation(summary = "에셋 폴더 생성", description = "새로운 에셋 폴더를 생성합니다.")
    public ResponseEntity<AssetFolderResponseDto> createAssetFolder(
            @Valid @RequestBody AssetFolderRequestDto requestDto) {

        log.info("에셋 폴더 생성 요청: {}", requestDto.getName());

        AssetFolderResponseDto created = assetManageService.createAssetFolder(requestDto);

        return ResponseEntity.ok(created);
    }

    @PutMapping("/folder/{id}")
    @Operation(summary = "에셋 폴더 수정", description = "기존 에셋 폴더를 수정합니다.")
    public ResponseEntity<AssetFolderResponseDto> updateAssetFolder(
            @Parameter(description = "폴더 ID") @PathVariable Long id,
            @Valid @RequestBody AssetFolderRequestDto requestDto) {

        log.info("에셋 폴더 수정 요청: ID={}, Name={}", id, requestDto.getName());

        AssetFolderResponseDto updated = assetManageService.updateAssetFolder(id, requestDto);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/folder/{id}")
    @Operation(summary = "에셋 폴더 삭제", description = "에셋 폴더를 삭제합니다. 하위 파일도 함께 삭제됩니다.")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteAssetFolder(
            @Parameter(description = "폴더 ID") @PathVariable Long id) {

        log.info("에셋 폴더 삭제 요청: ID={}", id);

        assetManageService.deleteAssetFolder(id);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    @Operation(summary = "에셋 파일 업로드", description = "에셋 파일을 업로드합니다.")
    public ResponseEntity<AssetFileResponseDto> uploadAssetFile(
            @Parameter(description = "업로드할 파일") @RequestParam("file") MultipartFile file,
            @Parameter(description = "업로드할 폴더 ID (선택사항)") @RequestParam(required = false) Long folderId) {

        log.info("에셋 파일 업로드 요청: 파일명={}, 폴더ID={}", file.getOriginalFilename(), folderId);

        AssetFileResponseDto uploaded = assetManageService.uploadAssetFile(file, folderId);

        return ResponseEntity.ok(uploaded);
    }

    @DeleteMapping("/file/{id}")
    @Operation(summary = "에셋 파일 삭제", description = "에셋 파일을 삭제합니다.")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteAssetFile(
            @Parameter(description = "파일 ID") @PathVariable Long id) {

        log.info("에셋 파일 삭제 요청: ID={}", id);

        assetManageService.deleteAssetFile(id);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{assetId}/move")
    @Operation(summary = "에셋 이동", description = "에셋을 다른 폴더로 이동합니다.")
    public ResponseEntity<Void> moveAsset(
            @Parameter(description = "이동할 에셋 ID") @PathVariable Long assetId,
            @Valid @RequestBody MoveAssetDto moveAssetDto) {

        log.info("에셋 이동 요청: 에셋ID={}, 목표 폴더ID={}", assetId, moveAssetDto.getTargetFolderId());

        assetManageService.moveAsset(assetId, moveAssetDto.getTargetFolderId());

        return ResponseEntity.ok().build();
    }

    @PutMapping("/order")
    @Operation(summary = "에셋 순서 변경", description = "에셋의 순서를 변경합니다.")
    public ResponseEntity<Void> updateAssetOrder(
            @Valid @RequestBody List<AssetOrderDto> orderData) {

        log.info("에셋 순서 변경 요청: {} 개 에셋", orderData.size());

        assetManageService.updateAssetOrder(orderData);

        return ResponseEntity.ok().build();
    }
}
