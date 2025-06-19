package com.example.sr03_kebli_naitbahloul_d2.repository;

import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Users findByEmail(String email);
    Page<Users> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
            String firstname, String lastname, Pageable pageable);

    List<Users> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
            String firstname, String lastname);

    Page<Users> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    Page<Users> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstname, String lastname, String email, Pageable pageable);

    long countByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(String firstname, String lastname);

    Long email(String email);
}
