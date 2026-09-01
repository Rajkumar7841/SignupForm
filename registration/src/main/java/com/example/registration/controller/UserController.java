package com.example.registration.controller;

import com.example.registration.dto.RegistrationRequest;
import com.example.registration.dto.RegistrationResponse;
import com.example.registration.entity.User;
import com.example.registration.service.PincodeService;
import com.example.registration.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final PincodeService pincodeService;

    public UserController(
            UserService userService,
            PincodeService pincodeService) {

        this.userService = userService;
        this.pincodeService = pincodeService;
    }


    // =====================================================
    // POST API - REGISTER USER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegistrationRequest request) {


        // -------------------------------------------------
        // 1. Check password and repeat password
        // -------------------------------------------------

        if (!request.getPassword()
                .equals(request.getRepeatPassword())) {

            Map<String, String> errors =
                    new HashMap<>();

            errors.put(
                    "repeatPassword",
                    "Passwords do not match"
            );

            return new ResponseEntity<>(
                    errors,
                    HttpStatus.BAD_REQUEST
            );
        }


        // -------------------------------------------------
        // 2. Check ALL business validations together
        // -------------------------------------------------

        Map<String, String> errors =
                new HashMap<>();


        // Check duplicate email
        if (userService.emailExists(
                request.getEmail())) {

            errors.put(
                    "email",
                    "Email is already registered"
            );
        }


        // Check pincode
        if (!pincodeService.isValidPincode(
                request.getPincode())) {

            errors.put(
                    "pincode",
                    "Invalid or non-existent pincode"
            );
        }


        // -------------------------------------------------
        // 3. If there are errors, return ALL of them
        // -------------------------------------------------

        if (!errors.isEmpty()) {

            return new ResponseEntity<>(
                    errors,
                    HttpStatus.BAD_REQUEST
            );
        }


        // -------------------------------------------------
        // 4. Create User entity
        // -------------------------------------------------

        User user = new User();

        user.setFirstName(
                request.getFirstName()
        );

        user.setLastName(
                request.getLastName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPhone(
                request.getPhone()
        );

        user.setPassword(
                request.getPassword()
        );

        user.setPincode(
                request.getPincode()
        );


        // -------------------------------------------------
        // 5. Save user
        // -------------------------------------------------

        User savedUser =
                userService.registerUser(user);


        // -------------------------------------------------
        // 6. Create safe response
        // -------------------------------------------------

        RegistrationResponse response =
                new RegistrationResponse(

                        savedUser.getId(),

                        savedUser.getFirstName(),

                        savedUser.getLastName(),

                        savedUser.getEmail(),

                        savedUser.getPhone(),

                        savedUser.getPincode()
                );


        // -------------------------------------------------
        // 7. Return successful response
        // -------------------------------------------------

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }


    // =====================================================
    // GET API - GET USER BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(
            @PathVariable Long id) {


        User user =
                userService.getUserById(id);


        RegistrationResponse response =
                new RegistrationResponse(

                        user.getId(),

                        user.getFirstName(),

                        user.getLastName(),

                        user.getEmail(),

                        user.getPhone(),

                        user.getPincode()
                );


        return ResponseEntity.ok(response);
    }


    // =====================================================
    // HANDLE VALIDATION ERRORS
    // =====================================================

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<Map<String, String>>
    handleValidationErrors(
            MethodArgumentNotValidException exception) {


        Map<String, String> errors =
                new HashMap<>();


        for (
                FieldError error :
                exception
                        .getBindingResult()
                        .getFieldErrors()
        ) {

            errors.put(
                    error.getField(),
                    error.getDefaultMessage()
            );
        }


        return new ResponseEntity<>(
                errors,
                HttpStatus.BAD_REQUEST
        );
    }
}