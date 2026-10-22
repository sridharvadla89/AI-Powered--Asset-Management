package com.Asset.AssetManagement.Controller;

import com.Asset.AssetManagement.Dtos.AssetsRequestDtos;
import com.Asset.AssetManagement.Dtos.ImportExcel;
import com.Asset.AssetManagement.Entity.Assets;
import com.Asset.AssetManagement.Entity.User;
import com.Asset.AssetManagement.Repo.DrdoAssetRepository;
import com.Asset.AssetManagement.Security.JwtService;
import com.Asset.AssetManagement.Service.ExportService;
import com.Asset.AssetManagement.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
    @RequestMapping({"/auth"})
    @CrossOrigin(
            origins = {"http://localhost:5173"}
    )
    public class AssetController {
        private final AuthenticationManager authenticationManager;
        private final JwtService jwtService;
        private final UserService userService;
        @Autowired
        private DrdoAssetRepository repository;
        @Autowired
        private ExportService exportService;

        public AssetController(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService) {
            this.authenticationManager = authenticationManager;
            this.jwtService = jwtService;
            this.userService = userService;
        }

        @PostMapping({"/login"})
        public ResponseEntity<String> login(@RequestBody User user) {
            this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            String token = this.jwtService.generateToken(user.getUsername());
            return ResponseEntity.ok(token);
        }

        @PostMapping({"/Register"})
        public ResponseEntity<User> register(@RequestBody User user) throws Exception {
            return ResponseEntity.ok(this.userService.Register(user));
        }

        @GetMapping({"/asset/{assetNo}"})
        public ResponseEntity<?> getAsset(@PathVariable String assetNo) {
            try {
                Assets asset = (Assets) this.repository.findByAssetNo(assetNo).orElseThrow(() -> {
                    return new RuntimeException("Asset not found with Asset No: " + assetNo);
                });
                return ResponseEntity.ok(asset);
            } catch (RuntimeException var3) {
                return ResponseEntity.status(404).body(var3.getMessage());
            }
        }

        @PostMapping({"/add"})
        public ResponseEntity<String> addAsset(@RequestBody AssetsRequestDtos requestDto) {
            Assets savedAsset = this.exportService.addAsset(requestDto);
            return ResponseEntity.ok("Successfully added new asset with S.No: " + savedAsset.getSNo());
        }

        @PutMapping({"/update/{id}"})
        public ResponseEntity<String> updateAsset(@PathVariable String id, @RequestBody AssetsRequestDtos requestDto) {
            try {
                Assets updatedAsset = this.exportService.updateAsset(Long.valueOf(id), requestDto);
                return ResponseEntity.ok("Successfully updated asset with S.No: " + updatedAsset.getSNo());
            } catch (RuntimeException var4) {
                return ResponseEntity.badRequest().body(var4.getMessage());
            }
        }

        @GetMapping({"/search"})
        public ResponseEntity<List<Assets>> searchAssets(@RequestParam(required = false) String field, @RequestParam(required = false) String value) {
            List data;
            if (field != null && !field.isEmpty() && value != null && !value.isEmpty()) {
                data = this.repository.findAll(AssetSpecification.hasFieldWithValue(field, value));
            } else {
                data = this.repository.findAll();
            }

            return ResponseEntity.ok(data);
        }

        @DeleteMapping({"/delete/{id}"})
        public ResponseEntity<String> deleteAsset(@PathVariable Long id) {
            try {
                this.exportService.deleteAsset(id);
                return ResponseEntity.ok("Successfully deleted asset with S.No: " + id);
            } catch (RuntimeException var3) {
                return ResponseEntity.badRequest().body(var3.getMessage());
            }
        }

        @PostMapping({"/import"})
        public ResponseEntity<ImportExcel> importExcel(@RequestParam("file") MultipartFile file) throws Exception {
            ImportExcel excel = this.exportService.importExcel(file);
            return ResponseEntity.status(HttpStatus.OK).body(excel);
        }


        @GetMapping("/export")
        public ResponseEntity<InputStreamResource> exportData(
                @RequestParam(required = false) String field,
                @RequestParam(required = false) String value,
                @RequestParam String format,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size,
                @RequestParam(defaultValue = "sNo") String sortBy,
                @RequestParam(defaultValue = "asc") String direction
        ) throws Exception {

            // 1. Validate pagination parameters
            if (page < 0 || size < 1 || size > 500) {
                return ResponseEntity.badRequest().build();
            }

            // 2. Allow only valid entity properties for sorting
            Set<String> allowedSortFields = Set.of(
                    "sNo",
                    "pcUser",
                    "pcAssignTo",
                    "pcName",
                    "ipAddress",
                    "assetNo",
                    "purchaseYear"
            );

            if (!allowedSortFields.contains(sortBy)) {
                return ResponseEntity.badRequest().build();
            }

            // 3. Validate sort direction
            Sort.Direction sortDirection;

            try {
                sortDirection = Sort.Direction.fromString(direction);
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().build();
            }

            // 4. Create pagination and sorting configuration
            Pageable pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(sortDirection, sortBy)
            );

            // 5. Fetch filtered, sorted, paginated records
            Page<Assets> assetPage;

            if (field != null && !field.isBlank()
                    && value != null && !value.isBlank()) {

                assetPage = repository.findAll(
                        AssetSpecification.hasFieldWithValue(field, value),
                        pageable
                );

            } else {
                assetPage = repository.findAll(pageable);
            }

            // 6. Get only the current page's records
            List<Assets> data = assetPage.getContent();

            // 7. Generate the requested file
            InputStreamResource file;

            if ("excel".equalsIgnoreCase(format)) {

                file = new InputStreamResource(
                        exportService.exportToExcel(data)
                );

                return ResponseEntity.ok()
                        .header(
                                "Content-Disposition",
                                "attachment; filename=DRDO_data.xlsx"
                        )
                        .contentType(MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        ))
                        .body(file);

            } else if ("pdf".equalsIgnoreCase(format)) {

                file = new InputStreamResource(
                        exportService.exportToPdf(data)
                );

                return ResponseEntity.ok()
                        .header(
                                "Content-Disposition",
                                "attachment; filename=DRDO_data.pdf"
                        )
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(file);

            } else {
                return ResponseEntity.badRequest().build();
            }
        }

    }

