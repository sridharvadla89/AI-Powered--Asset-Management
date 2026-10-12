package com.Asset.AssetManagement.Dtos;

import lombok.Generated;

import java.util.List;

public class ImportExcel {
    private int totalRows;
    private int successfulRows;
    private int skippedRows;
    private List<String> errors;

    @Generated
    public ImportExcel(final int totalRows, final int successfulRows, final int skippedRows, final List<String> errors) {
        this.totalRows = totalRows;
        this.successfulRows = successfulRows;
        this.skippedRows = skippedRows;
        this.errors = errors;
    }

    @Generated
    public ImportExcel() {
    }

    @Generated
    public int getTotalRows() {
        return this.totalRows;
    }

    @Generated
    public int getSuccessfulRows() {
        return this.successfulRows;
    }

    @Generated
    public int getSkippedRows() {
        return this.skippedRows;
    }

    @Generated
    public List<String> getErrors() {
        return this.errors;
    }

    @Generated
    public void setTotalRows(final int totalRows) {
        this.totalRows = totalRows;
    }

    @Generated
    public void setSuccessfulRows(final int successfulRows) {
        this.successfulRows = successfulRows;
    }

    @Generated
    public void setSkippedRows(final int skippedRows) {
        this.skippedRows = skippedRows;
    }

    @Generated
    public void setErrors(final List<String> errors) {
        this.errors = errors;
    }
}