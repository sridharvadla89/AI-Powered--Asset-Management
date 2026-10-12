package com.Asset.AssetManagement.Entity;

import jakarta.persistence.*;
import lombok.Generated;

    @Entity
    @Table(
            name = "assets"
    )
    public class Assets {
        @Id
        @GeneratedValue(
                strategy = GenerationType.IDENTITY
        )
        @Column(
                name = "`S.No`"
        )
        private Long sNo;
        @Column(
                name = "`PC User`"
        )
        private String pcUser;
        @Column(
                name = "`PC Assign To`"
        )
        private String pcAssignTo;
        @Column(
                name = "`PC Making Model`"
        )
        private String pcMakingModel;
        @Column(
                name = "`PC Name`"
        )
        private String pcName;
        @Column(
                name = "`IP Address`"
        )
        private String ipAddress;
        @Column(
                name = "`MAC Address`"
        )
        private String macAddress;
        @Column(
                name = "`PC Serial No`"
        )
        private String pcSerialNo;
        @Column(
                name = "`Printer Attached`"
        )
        private String printerAttached;
        @Column(
                name = "`Printer Name And Maker Model`"
        )
        private String printerNameAndMakerModel;
        @Column(
                name = "`Colour/Black and White`"
        )
        private String colourBlackAndWhite;
        @Column(
                name = "`OS`"
        )
        private String os;
        @Column(
                name = "`OS Version`"
        )
        private String osVersion;
        @Column(
                name = "`MS Office`"
        )
        private String msOffice;
        @Column(
                name = "`Antivirus`"
        )
        private String antivirus;
        @Column(
                name = "`Building No`"
        )
        private String buildingNo;
        @Column(
                name = "`Purchase Year`"
        )
        private Integer purchaseYear;
        @Column(
                name = "`Ram Capacity`"
        )
        private String ramCapacity;
        @Column(
                name = "`Asset No`"
        )
        private String assetNo;
        @Column(
                name = "`Processer`"
        )
        private String processer;
        @Column(
                name = "`End Point System`"
        )
        private String endPointSystem;
        @Column(
                name = "`Remark`"
        )
        private String remark;

        @Generated
        public Assets() {
        }

        @Generated
        public Long getSNo() {
            return this.sNo;
        }

        @Generated
        public String getPcUser() {
            return this.pcUser;
        }

        @Generated
        public String getPcAssignTo() {
            return this.pcAssignTo;
        }

        @Generated
        public String getPcMakingModel() {
            return this.pcMakingModel;
        }

        @Generated
        public String getPcName() {
            return this.pcName;
        }

        @Generated
        public String getIpAddress() {
            return this.ipAddress;
        }

        @Generated
        public String getMacAddress() {
            return this.macAddress;
        }

        @Generated
        public String getPcSerialNo() {
            return this.pcSerialNo;
        }

        @Generated
        public String getPrinterAttached() {
            return this.printerAttached;
        }

        @Generated
        public String getPrinterNameAndMakerModel() {
            return this.printerNameAndMakerModel;
        }

        @Generated
        public String getColourBlackAndWhite() {
            return this.colourBlackAndWhite;
        }

        @Generated
        public String getOs() {
            return this.os;
        }

        @Generated
        public String getOsVersion() {
            return this.osVersion;
        }

        @Generated
        public String getMsOffice() {
            return this.msOffice;
        }

        @Generated
        public String getAntivirus() {
            return this.antivirus;
        }

        @Generated
        public String getBuildingNo() {
            return this.buildingNo;
        }

        @Generated
        public Integer getPurchaseYear() {
            return this.purchaseYear;
        }

        @Generated
        public String getRamCapacity() {
            return this.ramCapacity;
        }

        @Generated
        public String getAssetNo() {
            return this.assetNo;
        }

        @Generated
        public String getProcesser() {
            return this.processer;
        }

        @Generated
        public String getEndPointSystem() {
            return this.endPointSystem;
        }

        @Generated
        public String getRemark() {
            return this.remark;
        }

        @Generated
        public void setSNo(final Long sNo) {
            this.sNo = sNo;
        }

        @Generated
        public void setPcUser(final String pcUser) {
            this.pcUser = pcUser;
        }

        @Generated
        public void setPcAssignTo(final String pcAssignTo) {
            this.pcAssignTo = pcAssignTo;
        }

        @Generated
        public void setPcMakingModel(final String pcMakingModel) {
            this.pcMakingModel = pcMakingModel;
        }

        @Generated
        public void setPcName(final String pcName) {
            this.pcName = pcName;
        }

        @Generated
        public void setIpAddress(final String ipAddress) {
            this.ipAddress = ipAddress;
        }

        @Generated
        public void setMacAddress(final String macAddress) {
            this.macAddress = macAddress;
        }

        @Generated
        public void setPcSerialNo(final String pcSerialNo) {
            this.pcSerialNo = pcSerialNo;
        }

        @Generated
        public void setPrinterAttached(final String printerAttached) {
            this.printerAttached = printerAttached;
        }

        @Generated
        public void setPrinterNameAndMakerModel(final String printerNameAndMakerModel) {
            this.printerNameAndMakerModel = printerNameAndMakerModel;
        }

        @Generated
        public void setColourBlackAndWhite(final String colourBlackAndWhite) {
            this.colourBlackAndWhite = colourBlackAndWhite;
        }

        @Generated
        public void setOs(final String os) {
            this.os = os;
        }

        @Generated
        public void setOsVersion(final String osVersion) {
            this.osVersion = osVersion;
        }

        @Generated
        public void setMsOffice(final String msOffice) {
            this.msOffice = msOffice;
        }

        @Generated
        public void setAntivirus(final String antivirus) {
            this.antivirus = antivirus;
        }

        @Generated
        public void setBuildingNo(final String buildingNo) {
            this.buildingNo = buildingNo;
        }

        @Generated
        public void setPurchaseYear(final Integer purchaseYear) {
            this.purchaseYear = purchaseYear;
        }

        @Generated
        public void setRamCapacity(final String ramCapacity) {
            this.ramCapacity = ramCapacity;
        }

        @Generated
        public void setAssetNo(final String assetNo) {
            this.assetNo = assetNo;
        }

        @Generated
        public void setProcesser(final String processer) {
            this.processer = processer;
        }

        @Generated
        public void setEndPointSystem(final String endPointSystem) {
            this.endPointSystem = endPointSystem;
        }

        @Generated
        public void setRemark(final String remark) {
            this.remark = remark;
        }

        @Generated
        public boolean equals(final Object o) {
            if (o == this) {
                return true;
            } else if (!(o instanceof Assets)) {
                return false;
            } else {
                Assets other = (Assets)o;
                if (!other.canEqual(this)) {
                    return false;
                } else {
                    Object this$sNo = this.getSNo();
                    Object other$sNo = other.getSNo();
                    if (this$sNo == null) {
                        if (other$sNo != null) {
                            return false;
                        }
                    } else if (!this$sNo.equals(other$sNo)) {
                        return false;
                    }

                    Object this$purchaseYear = this.getPurchaseYear();
                    Object other$purchaseYear = other.getPurchaseYear();
                    if (this$purchaseYear == null) {
                        if (other$purchaseYear != null) {
                            return false;
                        }
                    } else if (!this$purchaseYear.equals(other$purchaseYear)) {
                        return false;
                    }

                    Object this$pcUser = this.getPcUser();
                    Object other$pcUser = other.getPcUser();
                    if (this$pcUser == null) {
                        if (other$pcUser != null) {
                            return false;
                        }
                    } else if (!this$pcUser.equals(other$pcUser)) {
                        return false;
                    }

                    label254: {
                        Object this$pcAssignTo = this.getPcAssignTo();
                        Object other$pcAssignTo = other.getPcAssignTo();
                        if (this$pcAssignTo == null) {
                            if (other$pcAssignTo == null) {
                                break label254;
                            }
                        } else if (this$pcAssignTo.equals(other$pcAssignTo)) {
                            break label254;
                        }

                        return false;
                    }

                    label247: {
                        Object this$pcMakingModel = this.getPcMakingModel();
                        Object other$pcMakingModel = other.getPcMakingModel();
                        if (this$pcMakingModel == null) {
                            if (other$pcMakingModel == null) {
                                break label247;
                            }
                        } else if (this$pcMakingModel.equals(other$pcMakingModel)) {
                            break label247;
                        }

                        return false;
                    }

                    Object this$pcName = this.getPcName();
                    Object other$pcName = other.getPcName();
                    if (this$pcName == null) {
                        if (other$pcName != null) {
                            return false;
                        }
                    } else if (!this$pcName.equals(other$pcName)) {
                        return false;
                    }

                    label233: {
                        Object this$ipAddress = this.getIpAddress();
                        Object other$ipAddress = other.getIpAddress();
                        if (this$ipAddress == null) {
                            if (other$ipAddress == null) {
                                break label233;
                            }
                        } else if (this$ipAddress.equals(other$ipAddress)) {
                            break label233;
                        }

                        return false;
                    }

                    label226: {
                        Object this$macAddress = this.getMacAddress();
                        Object other$macAddress = other.getMacAddress();
                        if (this$macAddress == null) {
                            if (other$macAddress == null) {
                                break label226;
                            }
                        } else if (this$macAddress.equals(other$macAddress)) {
                            break label226;
                        }

                        return false;
                    }

                    Object this$pcSerialNo = this.getPcSerialNo();
                    Object other$pcSerialNo = other.getPcSerialNo();
                    if (this$pcSerialNo == null) {
                        if (other$pcSerialNo != null) {
                            return false;
                        }
                    } else if (!this$pcSerialNo.equals(other$pcSerialNo)) {
                        return false;
                    }

                    Object this$printerAttached = this.getPrinterAttached();
                    Object other$printerAttached = other.getPrinterAttached();
                    if (this$printerAttached == null) {
                        if (other$printerAttached != null) {
                            return false;
                        }
                    } else if (!this$printerAttached.equals(other$printerAttached)) {
                        return false;
                    }

                    label205: {
                        Object this$printerNameAndMakerModel = this.getPrinterNameAndMakerModel();
                        Object other$printerNameAndMakerModel = other.getPrinterNameAndMakerModel();
                        if (this$printerNameAndMakerModel == null) {
                            if (other$printerNameAndMakerModel == null) {
                                break label205;
                            }
                        } else if (this$printerNameAndMakerModel.equals(other$printerNameAndMakerModel)) {
                            break label205;
                        }

                        return false;
                    }

                    label198: {
                        Object this$colourBlackAndWhite = this.getColourBlackAndWhite();
                        Object other$colourBlackAndWhite = other.getColourBlackAndWhite();
                        if (this$colourBlackAndWhite == null) {
                            if (other$colourBlackAndWhite == null) {
                                break label198;
                            }
                        } else if (this$colourBlackAndWhite.equals(other$colourBlackAndWhite)) {
                            break label198;
                        }

                        return false;
                    }

                    Object this$os = this.getOs();
                    Object other$os = other.getOs();
                    if (this$os == null) {
                        if (other$os != null) {
                            return false;
                        }
                    } else if (!this$os.equals(other$os)) {
                        return false;
                    }

                    label184: {
                        Object this$osVersion = this.getOsVersion();
                        Object other$osVersion = other.getOsVersion();
                        if (this$osVersion == null) {
                            if (other$osVersion == null) {
                                break label184;
                            }
                        } else if (this$osVersion.equals(other$osVersion)) {
                            break label184;
                        }

                        return false;
                    }

                    Object this$msOffice = this.getMsOffice();
                    Object other$msOffice = other.getMsOffice();
                    if (this$msOffice == null) {
                        if (other$msOffice != null) {
                            return false;
                        }
                    } else if (!this$msOffice.equals(other$msOffice)) {
                        return false;
                    }

                    label170: {
                        Object this$antivirus = this.getAntivirus();
                        Object other$antivirus = other.getAntivirus();
                        if (this$antivirus == null) {
                            if (other$antivirus == null) {
                                break label170;
                            }
                        } else if (this$antivirus.equals(other$antivirus)) {
                            break label170;
                        }

                        return false;
                    }

                    Object this$buildingNo = this.getBuildingNo();
                    Object other$buildingNo = other.getBuildingNo();
                    if (this$buildingNo == null) {
                        if (other$buildingNo != null) {
                            return false;
                        }
                    } else if (!this$buildingNo.equals(other$buildingNo)) {
                        return false;
                    }

                    Object this$ramCapacity = this.getRamCapacity();
                    Object other$ramCapacity = other.getRamCapacity();
                    if (this$ramCapacity == null) {
                        if (other$ramCapacity != null) {
                            return false;
                        }
                    } else if (!this$ramCapacity.equals(other$ramCapacity)) {
                        return false;
                    }

                    Object this$assetNo = this.getAssetNo();
                    Object other$assetNo = other.getAssetNo();
                    if (this$assetNo == null) {
                        if (other$assetNo != null) {
                            return false;
                        }
                    } else if (!this$assetNo.equals(other$assetNo)) {
                        return false;
                    }

                    label142: {
                        Object this$processer = this.getProcesser();
                        Object other$processer = other.getProcesser();
                        if (this$processer == null) {
                            if (other$processer == null) {
                                break label142;
                            }
                        } else if (this$processer.equals(other$processer)) {
                            break label142;
                        }

                        return false;
                    }

                    label135: {
                        Object this$endPointSystem = this.getEndPointSystem();
                        Object other$endPointSystem = other.getEndPointSystem();
                        if (this$endPointSystem == null) {
                            if (other$endPointSystem == null) {
                                break label135;
                            }
                        } else if (this$endPointSystem.equals(other$endPointSystem)) {
                            break label135;
                        }

                        return false;
                    }

                    Object this$remark = this.getRemark();
                    Object other$remark = other.getRemark();
                    if (this$remark == null) {
                        if (other$remark != null) {
                            return false;
                        }
                    } else if (!this$remark.equals(other$remark)) {
                        return false;
                    }

                    return true;
                }
            }
        }

        @Generated
        protected boolean canEqual(final Object other) {
            return other instanceof Assets;
        }

        @Generated
        public int hashCode() {
            boolean PRIME = true;
            int result = 1;
            Object $sNo = this.getSNo();
            result = result * 59 + ($sNo == null ? 43 : $sNo.hashCode());
            Object $purchaseYear = this.getPurchaseYear();
            result = result * 59 + ($purchaseYear == null ? 43 : $purchaseYear.hashCode());
            Object $pcUser = this.getPcUser();
            result = result * 59 + ($pcUser == null ? 43 : $pcUser.hashCode());
            Object $pcAssignTo = this.getPcAssignTo();
            result = result * 59 + ($pcAssignTo == null ? 43 : $pcAssignTo.hashCode());
            Object $pcMakingModel = this.getPcMakingModel();
            result = result * 59 + ($pcMakingModel == null ? 43 : $pcMakingModel.hashCode());
            Object $pcName = this.getPcName();
            result = result * 59 + ($pcName == null ? 43 : $pcName.hashCode());
            Object $ipAddress = this.getIpAddress();
            result = result * 59 + ($ipAddress == null ? 43 : $ipAddress.hashCode());
            Object $macAddress = this.getMacAddress();
            result = result * 59 + ($macAddress == null ? 43 : $macAddress.hashCode());
            Object $pcSerialNo = this.getPcSerialNo();
            result = result * 59 + ($pcSerialNo == null ? 43 : $pcSerialNo.hashCode());
            Object $printerAttached = this.getPrinterAttached();
            result = result * 59 + ($printerAttached == null ? 43 : $printerAttached.hashCode());
            Object $printerNameAndMakerModel = this.getPrinterNameAndMakerModel();
            result = result * 59 + ($printerNameAndMakerModel == null ? 43 : $printerNameAndMakerModel.hashCode());
            Object $colourBlackAndWhite = this.getColourBlackAndWhite();
            result = result * 59 + ($colourBlackAndWhite == null ? 43 : $colourBlackAndWhite.hashCode());
            Object $os = this.getOs();
            result = result * 59 + ($os == null ? 43 : $os.hashCode());
            Object $osVersion = this.getOsVersion();
            result = result * 59 + ($osVersion == null ? 43 : $osVersion.hashCode());
            Object $msOffice = this.getMsOffice();
            result = result * 59 + ($msOffice == null ? 43 : $msOffice.hashCode());
            Object $antivirus = this.getAntivirus();
            result = result * 59 + ($antivirus == null ? 43 : $antivirus.hashCode());
            Object $buildingNo = this.getBuildingNo();
            result = result * 59 + ($buildingNo == null ? 43 : $buildingNo.hashCode());
            Object $ramCapacity = this.getRamCapacity();
            result = result * 59 + ($ramCapacity == null ? 43 : $ramCapacity.hashCode());
            Object $assetNo = this.getAssetNo();
            result = result * 59 + ($assetNo == null ? 43 : $assetNo.hashCode());
            Object $processer = this.getProcesser();
            result = result * 59 + ($processer == null ? 43 : $processer.hashCode());
            Object $endPointSystem = this.getEndPointSystem();
            result = result * 59 + ($endPointSystem == null ? 43 : $endPointSystem.hashCode());
            Object $remark = this.getRemark();
            result = result * 59 + ($remark == null ? 43 : $remark.hashCode());
            return result;
        }

        @Generated
        public String toString() {
            Long var10000 = this.getSNo();
            return "Assets(sNo=" + var10000 + ", pcUser=" + this.getPcUser() + ", pcAssignTo=" + this.getPcAssignTo() + ", pcMakingModel=" + this.getPcMakingModel() + ", pcName=" + this.getPcName() + ", ipAddress=" + this.getIpAddress() + ", macAddress=" + this.getMacAddress() + ", pcSerialNo=" + this.getPcSerialNo() + ", printerAttached=" + this.getPrinterAttached() + ", printerNameAndMakerModel=" + this.getPrinterNameAndMakerModel() + ", colourBlackAndWhite=" + this.getColourBlackAndWhite() + ", os=" + this.getOs() + ", osVersion=" + this.getOsVersion() + ", msOffice=" + this.getMsOffice() + ", antivirus=" + this.getAntivirus() + ", buildingNo=" + this.getBuildingNo() + ", purchaseYear=" + this.getPurchaseYear() + ", ramCapacity=" + this.getRamCapacity() + ", assetNo=" + this.getAssetNo() + ", processer=" + this.getProcesser() + ", endPointSystem=" + this.getEndPointSystem() + ", remark=" + this.getRemark() + ")";
        }
    }

