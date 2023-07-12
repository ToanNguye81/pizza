package com.api.pizza.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "status")
    private String status;

    @Column(name = "comments")
    private String comments;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "customers_id", nullable = false)
    private Customer customer;
    @Temporal(TemporalType.TIMESTAMP)

    // 1-n => order- orderDetail
    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;

    @Column(name = "required_date", nullable = true, updatable = false)
    // @CreatedDate
    @JsonFormat(pattern = "yyyy-mm-dd")
    private Date requiredDate;

    @Column(name = "order_date", nullable = true, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    // @CreatedDate
    @JsonFormat(pattern = "yyyy-mm-dd")
    private Date orderDate;

    @Column(name = "shipped_date", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    // @LastModifiedDate
    @JsonFormat(pattern = "yyyy-mm-dd")
    private Date shippedDate;

    @Column(name = "updated_date", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    // @LastModifiedDate
    @JsonFormat(pattern = "yyyy-mm-dd")
    private Date updatedDate;

    public Order() {
        super();
        // TODO Auto-generated constructor stub
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public void setRequiredDate(Date requiredDate) {
        this.requiredDate = requiredDate;
    }

    public void setShippedDate(Date shippedDate) {
        this.shippedDate = shippedDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getComments() {
        return comments;
    }

    public Customer getCustomer() {
        return customer;
    }

    public int getId() {
        return id;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public Date getRequiredDate() {
        return requiredDate;
    }

    public Date getShippedDate() {
        return shippedDate;
    }

    public String getStatus() {
        return status;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setOrderDetails(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }

    public List<OrderDetail> getOrderDetails() {
        return orderDetails;
    }
}
