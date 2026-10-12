package com.Asset.AssetManagement.Repo;

import com.Asset.AssetManagement.Entity.Assets;
import org.springframework.data.jpa.domain.Specification;

public class AssetSpecification {

    public static Specification<Assets> hasFieldWithValue(String fieldName, String value) {
        return (root, query, criteriaBuilder) -> {
            if (fieldName == null || value == null) return null;
            // Dynamically checks if the provided column matches the provided data
            return criteriaBuilder.equal(root.get(fieldName), value);
        };
    }

}
