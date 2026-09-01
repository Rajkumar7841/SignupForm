package com.example.registration.service;

import com.example.registration.repository.PincodeRepository;
import org.springframework.stereotype.Service;

@Service
public class PincodeService {

    private final PincodeRepository pincodeRepository;

    public PincodeService(PincodeRepository pincodeRepository) {
        this.pincodeRepository = pincodeRepository;
    }

    public boolean isValidPincode(String pincode) {
        return pincodeRepository.existsByPincode(pincode);
    }
}