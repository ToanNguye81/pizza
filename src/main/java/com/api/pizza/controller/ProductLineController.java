package com.api.pizza.controller;

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

import com.api.pizza.model.Customer;
import com.api.pizza.model.ProductLine;
import com.api.pizza.repository.ICustomerRepository;
import com.api.pizza.repository.IProductLineRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class ProductLineController {
    @Autowired
    IProductLineRepository gProductLineRepository;
    @Autowired
    ICustomerRepository gCustomerRepository;

    // get all ProductLine
    @GetMapping("/product-lines")
    public ResponseEntity<List<ProductLine>> getAllProductLine(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            // tạo ra một đối tượng Pageable để đại diện cho thông tin về phân trang.
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductLine> countryPage = gProductLineRepository.findAll(pageable);
            List<ProductLine> countryList = countryPage.getContent();
            Long totalElement = countryPage.getTotalElements();

            return ResponseEntity.ok()
                    .header("totalCount", String.valueOf(totalElement))
                    .body(countryList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // get payment by id
    @GetMapping("product-lines/{paymentId}")
    public ResponseEntity<Object> getProductLineById(@PathVariable Integer paymentId) {
        Optional<ProductLine> vProductLineData = gProductLineRepository.findById(paymentId);
        if (vProductLineData.isPresent()) {
            try {
                ProductLine vProductLine = vProductLineData.get();
                return new ResponseEntity<>(vProductLine, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            ProductLine vProductLineNull = new ProductLine();
            return new ResponseEntity<>(vProductLineNull, HttpStatus.NOT_FOUND);
        }
    }

    // create new payment
    @PostMapping("customers/{customerId}/product-lines")
    public ResponseEntity<Object> createNewProductLine(@Valid @RequestBody ProductLine pProductLine,
            @PathVariable Integer customerId) {
        Optional<Customer> vCustomerData = gCustomerRepository.findById(customerId);
        if (vCustomerData.isPresent()) {
            try {
                ProductLine vProductLine = new ProductLine();
                vProductLine.setCustomer(vCustomerData.get());
                vProductLine.setAmount(pProductLine.getAmount());
                vProductLine.setCheckNumber(pProductLine.getCheckNumber());
                vProductLine.setProductLineDate(pProductLine.getProductLineDate());
                // save payment & return
                ProductLine vSavedProductLine = gProductLineRepository.save(vProductLine);
                return new ResponseEntity<>(vSavedProductLine, HttpStatus.CREATED);
            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity()
                        .body("Failed to Create specified ProductLine: " + e.getCause().getCause().getMessage());
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }

    }

    // Update payment by id
    @PutMapping("customers/{customerId}/product-lines/{id}")
    public ResponseEntity<Object> updateProductLine(
            @PathVariable Integer customerId,
            @PathVariable Integer paymentId,
            @Valid @RequestBody ProductLine pProductLine) {
        Optional<ProductLine> vProductLineData = gProductLineRepository.findById(paymentId);
        if (vProductLineData.isPresent()) {
            Optional<Customer> vCustomerData = gCustomerRepository.findById(customerId);
            if (vCustomerData.isPresent()) {
                try {
                    ProductLine vProductLine = vProductLineData.get();
                    vProductLine.setAmount(pProductLine.getAmount());
                    vProductLine.setCheckNumber(pProductLine.getCheckNumber());
                    vProductLine.setProductLineDate(pProductLine.getProductLineDate());
                    ProductLine vSavedProductLine = gProductLineRepository.save(vProductLine);
                    return new ResponseEntity<>(vSavedProductLine, HttpStatus.OK);
                } catch (Exception e) {
                    return ResponseEntity.unprocessableEntity()
                            .body("Failed to Update specified Customer: " + e.getCause().getCause().getMessage());
                }
            } else {
                ProductLine vProductLineNull = new ProductLine();
                return new ResponseEntity<>(vProductLineNull, HttpStatus.NOT_FOUND);
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }
    }

    // Delete payment by id
    @DeleteMapping("/product-lines/{paymentId}")
    private ResponseEntity<Object> deleteProductLineById(@PathVariable Integer paymentId) {
        Optional<ProductLine> vProductLineData = gProductLineRepository.findById(paymentId);
        if (vProductLineData.isPresent()) {
            try {
                gProductLineRepository.deleteById(paymentId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            ProductLine vProductLineNull = new ProductLine();
            return new ResponseEntity<>(vProductLineNull, HttpStatus.NOT_FOUND);
        }
    }

}
