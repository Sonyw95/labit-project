package app.labit.common;

import app.labit.dao.DatabaseDao;
import app.labit.dto.CommonDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.util.List;
import java.util.UUID;

@Service
public class CommonService {

    @Resource
    private DatabaseDao databaseDao;

    @Transactional
    public boolean fileUplad(MultipartFile file){
        String originalFilename = file.getOriginalFilename();
        String orginExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String storedFileName = UUID.randomUUID().toString().toString().replaceAll("-","") + orginExtension;


        System.out.println(orginExtension);
        System.out.println(originalFilename);
        System.out.println(storedFileName);
        return false;
    }

    public List<CommonDto> getCategoryList(){
        List<CommonDto> categoryList = (List<CommonDto>) databaseDao.execSelectList("CommonMapper", "selectCategory", 1);
        return categoryList;
    }
}
