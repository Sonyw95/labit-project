package app.labit.controller.api.oauth;

import app.labit.dto.oauth.OauthDto;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;

import javax.annotation.Resource;

@Service
public class OauthConnectionManager {

    @Resource
    private RestTemplate restTemplate;

    public OauthDto getOauthPost(UriComponents requestBuilder, HttpHeaders headers) {
        ResponseEntity<OauthDto> responseEntity = null;
        try {
             responseEntity = restTemplate.exchange(requestBuilder.toUri(), HttpMethod.POST, new HttpEntity<>(headers), OauthDto.class );

        }catch (Exception e){
            e.getMessage();
            e.getStackTrace();
        }finally {
            return responseEntity.getBody();
        }
    }

    public String getOauthGet(UriComponents requestBuilder, HttpHeaders headers){
        ResponseEntity<String> responseEntity = restTemplate.exchange(requestBuilder.toUri(), HttpMethod.GET, new HttpEntity<>(headers), String.class );
        return responseEntity.getBody();

    }
}
