package com.example.server.service;

import com.example.server.entities.TokenBlacklist;
import com.example.server.repositories.TokenBlacklistRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    private final TokenBlacklistRepository tokenBlacklistRepository;
    private final JwtService jwtService;

    public void addToken(@NonNull String token){
        TokenBlacklist tokenBlacklist=new TokenBlacklist();
        tokenBlacklist.setToken(token);
        tokenBlacklist.setExpiry(jwtService.extractExpiration(token));
        tokenBlacklistRepository.save(tokenBlacklist);
    }

    public boolean isTokenPresent(@NonNull String token){
        Optional<TokenBlacklist> optionalTokenBlacklist=tokenBlacklistRepository.findByToken(token);
        return optionalTokenBlacklist.isPresent();
    }

    public void clearStorage(){
        List<TokenBlacklist> expired=tokenBlacklistRepository.findExpiredToken(new Date());
        tokenBlacklistRepository.deleteAll(expired);
    }





}
