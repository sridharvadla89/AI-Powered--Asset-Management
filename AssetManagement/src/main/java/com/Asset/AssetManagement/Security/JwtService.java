package com.Asset.AssetManagement.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtService {
    private String mySecret = "mySuperSecretKeyForJwtAuthentication12345";

    public JwtService() {
    }

    public String generateToken(String userName) {
        return Jwts.builder().subject(userName).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() * 1000L * 60L * 60L)).signWith(this.getKey()).compact();
    }

    public SecretKey getKey() {
        return Keys.hmacShaKeyFor(this.mySecret.getBytes());
    }

    public String ExtractUsername(String token) {
        return ((Claims)Jwts.parser().verifyWith(this.getKey()).build().parseSignedClaims(token).getPayload()).getSubject();
    }
}
