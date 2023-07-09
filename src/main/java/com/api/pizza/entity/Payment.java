package com.api.pizza.entity;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.*;
import javax.validation.constraints.Positive;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "check_number")
    private int checkNumber;

    @Column(name = "payment_date")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date paymentDate;

    @Column(name = "amount")
    @Positive(message = "Amount lớn hơn hoặc bằng 0")
    private BigDecimal amount;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "customers_id", nullable = false)
    private Customer customer;

    public Payment() {
        super();
        // TODO Auto-generated constructor stub
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setCheckNumber(int checkNumber) {
        this.checkNumber = checkNumber;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public int getCheckNumber() {
        return checkNumber;
    }

    public Customer getCustomer() {
        return customer;
    }

    public int getId() {
        return id;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }
}
