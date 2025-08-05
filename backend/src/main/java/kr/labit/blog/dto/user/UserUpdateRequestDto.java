package kr.labit.blog.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "사용자 정보 수정 요청 DTO")
public class UserUpdateRequestDto {

    @NotBlank(message = "닉네임은 필수입니다")
    @Size(min = 2, max = 20, message = "닉네임은 2자 이상 20자 이하여야 합니다")
    @Schema(description = "닉네임", example = "홍길동", required = true)
    private String nickname;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @Size(max = 255, message = "이메일은 255자 이하여야 합니다")
    @Schema(description = "이메일", example = "hong@example.com", required = true)
    private String email;

    @Size(max = 500, message = "프로필 이미지 URL은 500자 이하여야 합니다")
    @Schema(description = "프로필 이미지 URL", example = "http://localhost:10001/api/files/profiles/2025/01/image.jpg")
    private String profileImage;
}