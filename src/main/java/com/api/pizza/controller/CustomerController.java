package com.api.pizza.controller;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;
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

import com.api.pizza.entity.Customer;
import com.api.pizza.repository.ICustomerRepository;
import com.api.pizza.service.CustomerExcelExporter;

@RestController
@CrossOrigin
@RequestMapping("/")
public class CustomerController {
    @Autowired
    ICustomerRepository gCustomerRepository;

    // get all Customer
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomer(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            // tạo ra một đối tượng Pageable để đại diện cho thông tin về phân trang.
            Pageable pageable = PageRequest.of(page, size);
            Page<Customer> customerPage = gCustomerRepository.findAll(pageable);
            List<Customer> customerList = customerPage.getContent();
            Long totalElement = customerPage.getTotalElements();

            return ResponseEntity.ok()
                    .header("totalCount", String.valueOf(totalElement))
                    .body(customerList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // create new customer
    @PostMapping("/customers")
    public ResponseEntity<Object> createNewCustomer(
            @Valid @RequestBody Customer pCustomer) {
        try {
            Customer vCustomer = new Customer();
            vCustomer.setAddress(pCustomer.getAddress());
            vCustomer.setCity(pCustomer.getCity());
            vCustomer.setCountry(pCustomer.getCountry());
            vCustomer.setCreditLimit(pCustomer.getCreditLimit());
            vCustomer.setEmail(pCustomer.getEmail());
            vCustomer.setFirstName(pCustomer.getFirstName());
            vCustomer.setLastName(pCustomer.getLastName());
            vCustomer.setPhoneNumber(pCustomer.getPhoneNumber());
            vCustomer.setPostalCode(pCustomer.getPostalCode());
            vCustomer.setSalesRepEmployeeNumber(pCustomer.getSalesRepEmployeeNumber());
            vCustomer.setState(pCustomer.getState());
            vCustomer.setCreatedDate(new Date());

            Customer vCustomerSave = gCustomerRepository.save(vCustomer);
            return new ResponseEntity<>(vCustomerSave, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity()
                    .body("Failed to Create specified Customer: " + e.getCause().getCause().getMessage());
        }

    }

    // get customer by id
    @GetMapping("/customers/{customerId}")
    public ResponseEntity<Object> getCustomerById(
            @PathVariable Integer customerId) {
        Optional<Customer> vCustomerData = gCustomerRepository.findById(customerId);
        if (vCustomerData.isPresent()) {
            try {
                Customer vCustomer = vCustomerData.get();
                return new ResponseEntity<>(vCustomer, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }
    }

    // Update customer by id
    @PutMapping("/customers/{customerId}")
    public ResponseEntity<Object> updateCustomer(
            @PathVariable Integer customerId,
            @Valid @RequestBody Customer pCustomer) {
        Optional<Customer> vCustomerData = gCustomerRepository.findById(customerId);
        if (vCustomerData.isPresent()) {
            try {
                Customer vCustomer = vCustomerData.get();
                vCustomer.setAddress(pCustomer.getAddress());
                vCustomer.setCity(pCustomer.getCity());
                vCustomer.setCountry(pCustomer.getCountry());
                vCustomer.setCreditLimit(pCustomer.getCreditLimit());
                vCustomer.setEmail(pCustomer.getEmail());
                vCustomer.setFirstName(pCustomer.getFirstName());
                vCustomer.setLastName(pCustomer.getLastName());
                vCustomer.setPhoneNumber(pCustomer.getPhoneNumber());
                vCustomer.setPostalCode(pCustomer.getPostalCode());
                vCustomer.setSalesRepEmployeeNumber(pCustomer.getSalesRepEmployeeNumber());
                vCustomer.setState(pCustomer.getState());
                vCustomer.setUpdatedDate(new Date());
                Customer vCustomerSave = gCustomerRepository.save(vCustomer);
                return new ResponseEntity<>(vCustomerSave, HttpStatus.OK);
            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity()
                        .body("Failed to Update specified Customer: " + e.getCause().getCause().getMessage());
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }
    }

    // Delete customer by id
    @DeleteMapping("/customers/{customerId}")
    private ResponseEntity<Object> deleteCustomerById(
            @PathVariable Integer customerId) {
        Optional<Customer> vCustomerData = gCustomerRepository.findById(customerId);
        if (vCustomerData.isPresent()) {
            try {
                gCustomerRepository.deleteById(customerId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/export/customers/excel")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=users_" + currentDateTime +
                ".xlsx";
        response.setHeader(headerKey, headerValue);
        List<Customer> customer = new ArrayList<Customer>();
        gCustomerRepository.findAll().forEach(customer::add);
        CustomerExcelExporter excelExporter = new CustomerExcelExporter(customer);
        excelExporter.export(response);
    }

    @GetMapping("/customers/count")
    public ResponseEntity<List<Map<String, Object>>> getCustomerCountByCountry(@RequestParam List<String> countries) {
        try {
            // Thực hiện truy vấn động để lấy số lượng khách hàng cho từng quốc gia
            List<Map<String, Object>> customerList = new ArrayList<>();

            for (String country : countries) {
                long customerCount = gCustomerRepository.countCustomersByCountry(country);
                Map<String, Object> customerMap = new HashMap<>();
                customerMap.put("country", country);
                customerMap.put("customerCount", customerCount);
                customerList.add(customerMap);
            }

            return ResponseEntity.ok().body(customerList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
