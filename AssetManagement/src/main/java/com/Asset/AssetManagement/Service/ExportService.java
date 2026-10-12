package com.Asset.AssetManagement.Service;

import com.Asset.AssetManagement.Dtos.AssetsRequestDtos;
import com.Asset.AssetManagement.Dtos.ImportExcel;
import com.Asset.AssetManagement.Entity.Assets;
import com.Asset.AssetManagement.Repo.DrdoAssetRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ExportService {
    private final String[] HEADERS = new String[]{"S.No", "PC User", "PC Assign To", "PC Making Model", "PC Name", "IP Address", "MAC Address", "PC Serial No", "Printer Attached", "Printer Name And Maker Model", "Colour/Black and White", "OS", "OS Version", "MS Office", "Antivirus", "Building No", "Purchase Year", "Ram Capacity", "Asset No", "Processer", "End Point System", "Remark"};
    @Autowired
    private DrdoAssetRepository repository;

    public ExportService() {
    }

    private String formatData(String value) {
        return value != null && !value.trim().isEmpty() ? value : "N/A";
    }

    private String formatData(Object value) {
        return value == null ? "N/A" : value.toString();
    }

    public Assets addAsset(AssetsRequestDtos dto) {
        Assets asset = new Assets();
        this.mapDtoToEntity(dto, asset);
        return (Assets)this.repository.save(asset);
    }

    public Assets updateAsset(Long id, AssetsRequestDtos dto) {
        Assets existingAsset = (Assets) this.repository.findById(id).orElseThrow(() -> {
            return new RuntimeException("Asset not found with S.No: " + id);
        });
        this.mapDtoToEntity(dto, existingAsset);
        return (Assets)this.repository.save(existingAsset);
    }

    public void deleteAsset(Long id) {
        if (!this.repository.existsById(id)) {
            throw new RuntimeException("Asset not found with S.No: " + id);
        } else {
            this.repository.deleteById(id);
        }
    }

    private void mapDtoToEntity(AssetsRequestDtos dto, Assets asset) {
        asset.setPcUser(dto.getPcUser());
        asset.setPcAssignTo(dto.getPcAssignTo());
        asset.setPcMakingModel(dto.getPcMakingModel());
        asset.setPcName(dto.getPcName());
        asset.setIpAddress(dto.getIpAddress());
        asset.setMacAddress(dto.getMacAddress());
        asset.setPcSerialNo(dto.getPcSerialNo());
        asset.setPrinterAttached(dto.getPrinterAttached());
        asset.setPrinterNameAndMakerModel(dto.getPrinterNameAndMakerModel());
        asset.setColourBlackAndWhite(dto.getColourBlackAndWhite());
        asset.setOs(dto.getOs());
        asset.setOsVersion(dto.getOsVersion());
        asset.setMsOffice(dto.getMsOffice());
        asset.setAntivirus(dto.getAntivirus());
        asset.setBuildingNo(dto.getBuildingNo());
        asset.setPurchaseYear(dto.getPurchaseYear());
        asset.setRamCapacity(dto.getRamCapacity());
        asset.setAssetNo(dto.getAssetNo());
        asset.setProcesser(dto.getProcesser());
        asset.setEndPointSystem(dto.getEndPointSystem());
        asset.setRemark(dto.getRemark());
    }

    public ByteArrayInputStream exportToExcel(List<Assets> assets) throws IOException {
        Workbook workbook = new XSSFWorkbook();

        ByteArrayInputStream var17;
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            try {
                Sheet sheet = workbook.createSheet("Sheet1");
                Row headerRow = sheet.createRow(0);
                CellStyle headerStyle = workbook.createCellStyle();
                Font excelFont = workbook.createFont();
                excelFont.setBold(true);
                headerStyle.setFont(excelFont);
                int i = 0;

                while(true) {
                    if (i >= this.HEADERS.length) {
                        i = 1;
                        Iterator var16 = assets.iterator();

                        while(var16.hasNext()) {
                            Assets asset = (Assets) var16.next();
                            Row row = sheet.createRow(i++);
                            row.createCell(0).setCellValue(this.formatData((Object)asset.getSNo()));
                            row.createCell(1).setCellValue(this.formatData(asset.getPcUser()));
                            row.createCell(2).setCellValue(this.formatData(asset.getPcAssignTo()));
                            row.createCell(3).setCellValue(this.formatData(asset.getPcMakingModel()));
                            row.createCell(4).setCellValue(this.formatData(asset.getPcName()));
                            row.createCell(5).setCellValue(this.formatData(asset.getIpAddress()));
                            row.createCell(6).setCellValue(this.formatData(asset.getMacAddress()));
                            row.createCell(7).setCellValue(this.formatData(asset.getPcSerialNo()));
                            row.createCell(8).setCellValue(this.formatData(asset.getPrinterAttached()));
                            row.createCell(9).setCellValue(this.formatData(asset.getPrinterNameAndMakerModel()));
                            row.createCell(10).setCellValue(this.formatData(asset.getColourBlackAndWhite()));
                            row.createCell(11).setCellValue(this.formatData(asset.getOs()));
                            row.createCell(12).setCellValue(this.formatData(asset.getOsVersion()));
                            row.createCell(13).setCellValue(this.formatData(asset.getMsOffice()));
                            row.createCell(14).setCellValue(this.formatData(asset.getAntivirus()));
                            row.createCell(15).setCellValue(this.formatData(asset.getBuildingNo()));
                            row.createCell(16).setCellValue(this.formatData((Object)asset.getPurchaseYear()));
                            row.createCell(17).setCellValue(this.formatData(asset.getRamCapacity()));
                            row.createCell(18).setCellValue(this.formatData(asset.getAssetNo()));
                            row.createCell(19).setCellValue(this.formatData(asset.getProcesser()));
                            row.createCell(20).setCellValue(this.formatData(asset.getEndPointSystem()));
                            row.createCell(21).setCellValue(this.formatData(asset.getRemark()));
                        }

                        workbook.write(out);
                        var17 = new ByteArrayInputStream(out.toByteArray());
                        break;
                    }

                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(this.HEADERS[i]);
                    cell.setCellStyle(headerStyle);
                    ++i;
                }
            } catch (Throwable var14) {
                try {
                    out.close();
                } catch (Throwable var13) {
                    var14.addSuppressed(var13);
                }

                throw var14;
            }

            out.close();
        } catch (Throwable var15) {
            try {
                workbook.close();
            } catch (Throwable var12) {
                var15.addSuppressed(var12);
            }

            throw var15;
        }

        workbook.close();
        return var17;
    }

    public ByteArrayInputStream exportToPdf(List<Assets> assets) throws DocumentException {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();
        PdfPTable table = new PdfPTable(22);
        table.setWidthPercentage(100.0F);
        com.lowagie.text.Font headFont = FontFactory.getFont("Helvetica-Bold", 6.0F);
        com.lowagie.text.Font dataFont = FontFactory.getFont("Helvetica", 5.0F);
        String[] var7 = this.HEADERS;
        int var8 = var7.length;

        for(int var9 = 0; var9 < var8; ++var9) {
            String header = var7[var9];
            PdfPCell hCell = new PdfPCell(new Phrase(header, headFont));
            hCell.setHorizontalAlignment(1);
            table.addCell(hCell);
        }

        Iterator var12 = assets.iterator();

        while(var12.hasNext()) {
            Assets asset = (Assets) var12.next();
            table.addCell(new PdfPCell(new Phrase(this.formatData((Object)asset.getSNo()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getPcUser()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getPcAssignTo()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getPcMakingModel()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getPcName()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getIpAddress()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getMacAddress()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getPcSerialNo()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getPrinterAttached()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getPrinterNameAndMakerModel()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getColourBlackAndWhite()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getOs()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getOsVersion()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getMsOffice()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getAntivirus()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getBuildingNo()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData((Object)asset.getPurchaseYear()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getRamCapacity()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getAssetNo()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getProcesser()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getEndPointSystem()), dataFont)));
            table.addCell(new PdfPCell(new Phrase(this.formatData(asset.getRemark()), dataFont)));
        }

        document.add(table);
        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Transactional
    public ImportExcel importExcel(MultipartFile file) throws Exception {
        if (file != null && !file.isEmpty()) {
            String filename = file.getOriginalFilename();
            if (filename != null && filename.toLowerCase().endsWith(".xlsx")) {
                int totalRows = 0;
                int successfulRows = 0;
                int skippedRows = 0;
                List<String> errors = new ArrayList();

                try {
                    InputStream inputStream = file.getInputStream();

                    try {
                        Workbook workbook = new XSSFWorkbook(inputStream);

                        try {
                            Sheet sheet = workbook.getSheetAt(0);
                            DataFormatter formatter = new DataFormatter();

                            for(int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); ++rowIndex) {
                                Row row = sheet.getRow(rowIndex);
                                if (row != null && !this.isRowEmpty(row)) {
                                    ++totalRows;

                                    try {
                                        String pcUser = this.getCellValue(row.getCell(1), formatter);
                                        String pcAssignTo = this.getCellValue(row.getCell(2), formatter);
                                        String pcMakingModel = this.getCellValue(row.getCell(3), formatter);
                                        String pcName = this.getCellValue(row.getCell(4), formatter);
                                        String ipAddress = this.getCellValue(row.getCell(5), formatter);
                                        String macAddress = this.getCellValue(row.getCell(6), formatter);
                                        String pcSerialNo = this.getCellValue(row.getCell(7), formatter);
                                        String printerAttached = this.getCellValue(row.getCell(8), formatter);
                                        String printerNameAndMakerModel = this.getCellValue(row.getCell(9), formatter);
                                        String colourBlackAndWhite = this.getCellValue(row.getCell(10), formatter);
                                        String os = this.getCellValue(row.getCell(11), formatter);
                                        String osVersion = this.getCellValue(row.getCell(12), formatter);
                                        String msOffice = this.getCellValue(row.getCell(13), formatter);
                                        String antivirus = this.getCellValue(row.getCell(14), formatter);
                                        String buildingNo = this.getCellValue(row.getCell(15), formatter);
                                        Integer purchaseYear = null;
                                        String purchaseYearValue = this.getCellValue(row.getCell(16), formatter);
                                        if (purchaseYearValue != null) {
                                            purchaseYear = Integer.valueOf(purchaseYearValue);
                                        }

                                        String ramCapacity = this.getCellValue(row.getCell(17), formatter);
                                        String assetNo = this.getCellValue(row.getCell(18), formatter);
                                        String processer = this.getCellValue(row.getCell(19), formatter);
                                        String endPointSystem = this.getCellValue(row.getCell(20), formatter);
                                        String remark = this.getCellValue(row.getCell(21), formatter);
                                        Assets drdoAsset = new Assets();
                                        drdoAsset.setPcUser(pcUser);
                                        drdoAsset.setPcAssignTo(pcAssignTo);
                                        drdoAsset.setPcMakingModel(pcMakingModel);
                                        drdoAsset.setPcName(pcName);
                                        drdoAsset.setIpAddress(ipAddress);
                                        drdoAsset.setMacAddress(macAddress);
                                        drdoAsset.setPcSerialNo(pcSerialNo);
                                        drdoAsset.setPrinterAttached(printerAttached);
                                        drdoAsset.setPrinterNameAndMakerModel(printerNameAndMakerModel);
                                        drdoAsset.setColourBlackAndWhite(colourBlackAndWhite);
                                        drdoAsset.setOs(os);
                                        drdoAsset.setOsVersion(osVersion);
                                        drdoAsset.setMsOffice(msOffice);
                                        drdoAsset.setAntivirus(antivirus);
                                        drdoAsset.setBuildingNo(buildingNo);
                                        drdoAsset.setPurchaseYear(purchaseYear);
                                        drdoAsset.setRamCapacity(ramCapacity);
                                        drdoAsset.setAssetNo(assetNo);
                                        drdoAsset.setProcesser(processer);
                                        drdoAsset.setEndPointSystem(endPointSystem);
                                        drdoAsset.setRemark(remark);
                                        this.repository.save(drdoAsset);
                                        ++successfulRows;
                                    } catch (NumberFormatException var38) {
                                        ++skippedRows;
                                        errors.add("Row " + (rowIndex + 1) + ": Invalid number format - " + var38.getMessage());
                                    } catch (Exception var39) {
                                        ++skippedRows;
                                        errors.add("Row " + (rowIndex + 1) + ": " + var39.getMessage());
                                    }
                                }
                            }
                        } catch (Throwable var40) {
                            try {
                                workbook.close();
                            } catch (Throwable var37) {
                                var40.addSuppressed(var37);
                            }

                            throw var40;
                        }

                        workbook.close();
                    } catch (Throwable var41) {
                        if (inputStream != null) {
                            try {
                                inputStream.close();
                            } catch (Throwable var36) {
                                var41.addSuppressed(var36);
                            }
                        }

                        throw var41;
                    }

                    if (inputStream != null) {
                        inputStream.close();
                    }
                } catch (IOException var42) {
                    throw new Exception("Unable to read Excel file.", var42);
                }

                return new ImportExcel(totalRows, successfulRows, skippedRows, errors);
            } else {
                throw new RuntimeException("Only .xlsx Excel files are supported");
            }
        } else {
            throw new RuntimeException("Please upload a valid Excel file");
        }
    }

    private String getCellValue(Cell cell, DataFormatter formatter) {
        if (cell == null) {
            return null;
        } else {
            String value = formatter.formatCellValue(cell);
            return value != null && !value.trim().isEmpty() ? value.trim() : null;
        }
    }

    private boolean isRowEmpty(Row row) {
        if (row == null) {
            return true;
        } else {
            DataFormatter formatter = new DataFormatter();

            for(int i = 0; i < row.getLastCellNum(); ++i) {
                Cell cell = row.getCell(i);
                if (cell != null) {
                    String value = formatter.formatCellValue(cell);
                    if (value != null && !value.trim().isEmpty()) {
                        return false;
                    }
                }
            }

            return true;
        }
    }
}