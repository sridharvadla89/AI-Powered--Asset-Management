package com.Asset.AssetManagement.Controller;

import com.Asset.AssetManagement.Entity.Assets;
import org.springframework.data.jpa.domain.Specification;

public class AssetSpecification {
    AssetSpecification() {
    }

    public static Specification<Assets> hasFieldWithValue(String fieldName, String value) {
        return (root, query, criteriaBuilder) -> {
            return fieldName != null && value != null ? criteriaBuilder.equal(root.get(fieldName).as(String.class), value) : null;
        };
    }

}
