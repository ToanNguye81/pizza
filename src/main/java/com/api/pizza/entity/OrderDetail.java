package com.api.pizza.entity;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "orderDetails")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "quantity_order")
    private int quantityOrder;

    @Column(name = "price_each")
    private BigDecimal priceEach;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "orderDetails_id", nullable = false)
    private Order order;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_date", nullable = true, updatable = false)
    @CreatedDate
    @JsonFormat(pattern = "yyyy-mm-dd")
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_date", nullable = true)
    @LastModifiedDate
    @JsonFormat(pattern = "yyyy-mm-dd")
    private Date updatedDate;

    public OrderDetail() {
        super();
        // TODO Auto-generated constructor stub
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setPriceEach(BigDecimal priceEach) {
        this.priceEach = priceEach;
    }

    public void setQuantityOrder(int quantityOrder) {
        this.quantityOrder = quantityOrder;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public int getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public BigDecimal getPriceEach() {
        return priceEach;
    }

    public int getQuantityOrder() {
        return quantityOrder;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }
}
