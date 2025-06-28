package app.labit.common;

import app.labit.dto.session.SessionUser;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;

@Service
public class PrivateTokenProvider {

    public String encSHA256(String key) throws NoSuchAlgorithmException {
        String SHA= "";

        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        messageDigest.update(key.getBytes());

        byte bytePassword[] = messageDigest.digest();
        StringBuffer stringBuffer = new StringBuffer();

        for(int i = 0 ; i < bytePassword.length ; i++){
            stringBuffer.append(Integer.toString( (bytePassword[i] & 0xff ) + 0x100, 16 ).substring(1));
        }
        SHA = stringBuffer.toString();

        return SHA;
    }

    public String createSecretKey(String userId, String password){
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append(userId).append(password);

        String encyKey = null;
        try {
            encyKey = encSHA256(stringBuffer.toString());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return Base64.getEncoder().encodeToString(encyKey.getBytes());
    }

    public String createTokenKey(String userId, String password){
        StringBuffer key = new StringBuffer();
        key.append(createSecretKey(userId,password));

        Claims claims = Jwts.claims();
        claims.put("userId", userId);
        Date date = new Date();

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setClaims(claims)
                .setIssuedAt(date)
                .setExpiration(new Date(date.getTime() + (1000L *60 * 30)))
                .signWith(SignatureAlgorithm.HS256, key.toString())
                .compact();
    }

    public boolean validTokenCheck(String jwtToken, SessionUser sessionUser){
        Jws<Claims> claimsJws = Jwts.parser()
                .setSigningKey(createSecretKey(sessionUser.getEmail(), sessionUser.getPassword()))
                .parseClaimsJws(jwtToken);
        return !claimsJws.getBody().getExpiration().before(new Date());
    }

    public Claims getInformation(String token,String userId, String password) {
        Claims claims =Jwts.parser().setSigningKey(createSecretKey(userId, password)).parseClaimsJws(token).getBody();
        return claims;
    }
}
