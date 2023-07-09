package com.api.pizza.entity;

import java.util.Date;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @NotNull(message = "Nhập First Name")
    @Size(min = 2, message = "First Name at least 2 characters ")
    @Column(name = "first_name")
    private String firstName;

    @NotNull(message = "Nhập Last Name")
    @Size(min = 2, message = "Last Name at least 2 characters ")
    @Column(name = "last_name")
    private String lastName;

    @Column(name = "extension")
    private String extension;

    @NotNull(message = "Nhập email")
    @Email(message = "Email not valid")
    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "officeCode")
    private String officeCode;

    @Column(name = "report_to")
    private String reportTo;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "created_date", nullable = true, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date createdDate;

    @Column(name = "updated_date", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    @LastModifiedDate
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date updatedDate;

    public Employee() {
        super();
        // TODO Auto-generated constructor stub
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setOfficeCode(String officeCode) {
        this.officeCode = officeCode;
    }

    public void setReportTo(String reportTo) {
        this.reportTo = reportTo;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public String getEmail() {
        return email;
    }

    public String getExtension() {
        return extension;
    }

    public String getFirstName() {
        return firstName;
    }

    public int getId() {
        return id;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getLastName() {
        return lastName;
    }

    public String getOfficeCode() {
        return officeCode;
    }

    public String getReportTo() {
        return reportTo;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }
}
