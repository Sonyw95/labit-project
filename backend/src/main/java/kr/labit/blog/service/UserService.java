package kr.labit.blog.service;

import kr.labit.blog.entity.User;
import kr.labit.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증되지 않은 사용자입니다.");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public boolean hasRole(String role) {
        try {
            User currentUser = getCurrentUser();
            return role.equals(currentUser.getRole()) || "ADMIN".equals(currentUser.getRole());
        } catch (Exception e) {
            return false;
        }
    }
}