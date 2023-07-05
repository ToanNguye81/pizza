package com.api.pizza.controller;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.pizza.model.Employee;
import com.api.pizza.repository.IEmployeeRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class EmployeeController {
    @Autowired
    IEmployeeRepository gEmployeeRepository;

    // get all Employee
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployee(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            // tạo ra một đối tượng Pageable để đại diện cho thông tin về phân trang.
            Pageable pageable = PageRequest.of(page, size);
            Page<Employee> countryPage = gEmployeeRepository.findAll(pageable);
            List<Employee> countryList = countryPage.getContent();
            Long totalElement = countryPage.getTotalElements();

            return ResponseEntity.ok()
                    .header("totalCount", String.valueOf(totalElement))
                    .body(countryList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // create new employee
    @PostMapping("/employees")
    public ResponseEntity<Object> createNewEmployee(
            @Valid @RequestBody Employee pEmployee) {
        try {
            Employee vEmployee = new Employee();
            vEmployee.setCreatedDate(new Date());
            vEmployee.setEmail(pEmployee.getEmail());
            vEmployee.setExtension(pEmployee.getExtension());
            vEmployee.setFirstName(pEmployee.getFirstName());
            vEmployee.setJobTitle(pEmployee.getJobTitle());
            vEmployee.setLastName(pEmployee.getLastName());
            vEmployee.setOfficeCode(pEmployee.getOfficeCode());
            vEmployee.setReportTo(pEmployee.getReportTo());

            Employee vEmployeeSave = gEmployeeRepository.save(vEmployee);
            return new ResponseEntity<>(vEmployeeSave, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity()
                    .body("Failed to Create specified Employee: " + e.getCause().getCause().getMessage());
        }

    }

    // get employee by id
    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<Object> getEmployeeById(
            @PathVariable Integer employeeId) {
        Optional<Employee> vEmployeeData = gEmployeeRepository.findById(employeeId);
        if (vEmployeeData.isPresent()) {
            try {
                Employee vEmployee = vEmployeeData.get();
                return new ResponseEntity<>(vEmployee, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Employee vEmployeeNull = new Employee();
            return new ResponseEntity<>(vEmployeeNull, HttpStatus.NOT_FOUND);
        }
    }

    // Update employee by id
    @PutMapping("/employees/{id}")
    public ResponseEntity<Object> updateEmployee(
            @PathVariable Integer id,
            @Valid @RequestBody Employee pEmployee) {
        Optional<Employee> vEmployeeData = gEmployeeRepository.findById(id);
        if (vEmployeeData.isPresent()) {
            try {
                Employee vEmployee = vEmployeeData.get();
                vEmployee.setUpdatedDate(new Date());
                vEmployee.setEmail(pEmployee.getEmail());
                vEmployee.setExtension(pEmployee.getExtension());
                vEmployee.setFirstName(pEmployee.getFirstName());
                vEmployee.setJobTitle(pEmployee.getJobTitle());
                vEmployee.setLastName(pEmployee.getLastName());
                vEmployee.setOfficeCode(pEmployee.getOfficeCode());
                vEmployee.setReportTo(pEmployee.getReportTo());
                Employee vEmployeeSave = gEmployeeRepository.save(vEmployee);
                return new ResponseEntity<>(vEmployeeSave, HttpStatus.OK);
            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity()
                        .body("Failed to Update specified Employee: " + e.getCause().getCause().getMessage());
            }
        } else {
            Employee vEmployeeNull = new Employee();
            return new ResponseEntity<>(vEmployeeNull, HttpStatus.NOT_FOUND);
        }
    }

    // Delete employee by id
    @DeleteMapping("/employees/{id}")
    private ResponseEntity<Object> deleteEmployeeById(
            @PathVariable Integer id) {
        Optional<Employee> vEmployeeData = gEmployeeRepository.findById(id);
        if (vEmployeeData.isPresent()) {
            try {
                gEmployeeRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Employee vEmployeeNull = new Employee();
            return new ResponseEntity<>(vEmployeeNull, HttpStatus.NOT_FOUND);
        }
    }

}
