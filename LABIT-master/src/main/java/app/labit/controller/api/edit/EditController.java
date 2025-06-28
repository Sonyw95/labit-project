package app.labit.controller.api.edit;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import app.labit.dto.param.ParamDto;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping(value="/api/edit")
public class EditController {

    @RequestMapping(value = "/uploadImage")
    public Object editProfile(MultipartHttpServletRequest  request){
        MultipartFile file = request.getFile("file");
        String originalFilename = file.getOriginalFilename();
        String orginExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String storedFileName = UUID.randomUUID().toString().toString().replaceAll("-","") + orginExtension;
        System.out.println(orginExtension);
        System.out.println(originalFilename);
        System.out.println(storedFileName);
        String path = "D:\\newLabit\\upload\\profile\\avatar\\"+file.getOriginalFilename();

        return path;
    }

    @RequestMapping(value="/profile")
    public void saveProfile(@RequestBody ParamDto paramDto ){
    }
}
