package com.example.registration.repository;

import com.example.registration.entity.Pincode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PincodeRepository extends JpaRepository<Pincode, Long> {

    boolean existsByPincode(String pincode);
}