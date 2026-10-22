package com.Asset.AssetManagement.Repo;

import com.Asset.AssetManagement.Entity.Assets;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface DrdoAssetRepository
        extends JpaRepository<Assets, Long>,
        JpaSpecificationExecutor<Assets> {

    Optional<Assets> findByAssetNo(String assetNo);

    Page<Assets> findAll(Specification<Assets> assetsSpecification, Pageable pageable);
}
