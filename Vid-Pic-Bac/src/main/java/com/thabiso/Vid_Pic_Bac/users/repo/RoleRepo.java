package com.thabiso.Vid_Pic_Bac.users.repo;

import com.thabiso.Vid_Pic_Bac.users.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
