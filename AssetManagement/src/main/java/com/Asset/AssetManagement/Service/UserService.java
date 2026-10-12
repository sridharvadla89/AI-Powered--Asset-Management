package com.Asset.AssetManagement.Service;

import com.Asset.AssetManagement.Entity.User;
import com.Asset.AssetManagement.Repo.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = (User)this.userRepo.findByUsername(username).orElseThrow(() -> {
            return new UsernameNotFoundException("User not found");
        });
        return org.springframework.security.core.userdetails.User.withUsername(user.getUsername()).password(user.getPassword()).build();
    }

    public User Register(User user) throws Exception {
        if (this.userRepo.checkUserExists(user.getUsername())) {
            throw new Exception("User is already Exists");
        } else {
            user.setPassword(this.passwordEncoder.encode(user.getPassword()));
            return (User)this.userRepo.save(user);
        }
    }
}

