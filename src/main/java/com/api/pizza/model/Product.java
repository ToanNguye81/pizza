package com.api.pizza.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "payments")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "product_code")
    @NotNull(message = "input product code")
    @Size(min = 2, message = "input product code at least 2 characters")
    private String productCode;

    @Column(name = "product_name")
    @NotNull(message = "input product name")
    @Size(min = 2, message = "input product name at least 2 characters")
    private String productName;

    @Column(name = "product_description")
    private String productDescription;

    @Column(name = "product_scale")
    private String productScale;

    @Column(name = "product_vendor")
    private String productVendor;

    @Column(name = "quantity_in_stock")
    private int quantityInStock;

    @Column(name = "buy_price")
    private BigDecimal buyPrice;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "product_line_id", nullable = false)
    private ProductLine productLine;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_date", nullable = true)
    @LastModifiedDate
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_date", nullable = true)
    @LastModifiedDate
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date updatedDate;

    public Product() {
        super();
        // TODO Auto-generated constructor stub
    }

    public void setBuyPrice(BigDecimal buyPrice) {
        this.buyPrice = buyPrice;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public void setProductLine(ProductLine productLine) {
        this.productLine = productLine;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setProductScale(String productScale) {
        this.productScale = productScale;
    }

    public void setProductVendor(String productVendor) {
        this.productVendor = productVendor;
    }

    public void setQuantityInStock(int quantityInStock) {
        this.quantityInStock = quantityInStock;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public BigDecimal getBuyPrice() {
        return buyPrice;
    }

    public int getId() {
        return id;
    }

    public String getProductCode() {
        return productCode;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public ProductLine getProductLine() {
        return productLine;
    }

    public String getProductName() {
        return productName;
    }

    public String getProductScale() {
        return productScale;
    }

    public String getProductVendor() {
        return productVendor;
    }

    public int getQuantityInStock() {
        return quantityInStock;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }
}
