package com.api.pizza.model;

import java.util.Date;

import javax.persistence.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "payments")
public class ProductLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "productLines", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "product_line_id", nullable = false)
    private ProductLine productLine;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_date", nullable = true)
    @CreatedDate
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_date", nullable = true)
    @LastModifiedDate
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date updatedDate;

    public ProductLine() {
        super();
        // TODO Auto-generated constructor stub
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setProductLine(ProductLine productLine) {
        this.productLine = productLine;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public String getDescription() {
        return description;
    }

    public int getId() {
        return id;
    }

    public ProductLine getProductLine() {
        return productLine;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

}
