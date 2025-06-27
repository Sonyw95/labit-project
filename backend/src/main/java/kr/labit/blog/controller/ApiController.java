package kr.labit.blog.controller;


import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "http://localhost:5173")
public class ApiController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello Word");
    }

    @PostMapping("/data")
    public Map<String, Object> date(@RequestBody Map<String, Object> param) {
        return Map.of("received", param);
    }
}

