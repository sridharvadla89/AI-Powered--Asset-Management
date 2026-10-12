package com.Asset.AssetManagement.Repo;

import com.Asset.AssetManagement.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepo  extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
            "FROM User u WHERE u.username = :username")
    boolean checkUserExists(@Param("username") String username);
}

