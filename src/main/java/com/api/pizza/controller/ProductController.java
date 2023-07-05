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
import com.api.pizza.model.Product;
import com.api.pizza.repository.ICustomerRepository;
import com.api.pizza.repository.IProductRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class ProductController {
    @Autowired
    IProductRepository gProductRepository;
    @Autowired
    ICustomerRepository gCustomerRepository;

    // get all Product
    @GetMapping("products")
    public ResponseEntity<List<Product>> getAllProduct(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            // tạo ra một đối tượng Pageable để đại diện cho thông tin về phân trang.
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> countryPage = gProductRepository.findAll(pageable);
            List<Product> countryList = countryPage.getContent();
            Long totalElement = countryPage.getTotalElements();

            return ResponseEntity.ok()
                    .header("totalCount", String.valueOf(totalElement))
                    .body(countryList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // get product by id
    @GetMapping("products/{productId}")
    public ResponseEntity<Object> getProductById(@PathVariable Integer productId) {
        Optional<Product> vProductData = gProductRepository.findById(productId);
        if (vProductData.isPresent()) {
            try {
                Product vProduct = vProductData.get();
                return new ResponseEntity<>(vProduct, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Product vProductNull = new Product();
            return new ResponseEntity<>(vProductNull, HttpStatus.NOT_FOUND);
        }
    }

    // create new product
    @PostMapping("product-lines/{productLineId}products")
    public ResponseEntity<Object> createNewProduct(@Valid @RequestBody Product pProduct,
            @PathVariable Integer productLineId) {
        Optional<Customer> vCustomerData = gCustomerRepository.findById(productLineId);
        if (vCustomerData.isPresent()) {
            try {
                Product vProduct = new Product();
                vProduct.setCustomer(vCustomerData.get());
                vProduct.setAmount(pProduct.getAmount());
                vProduct.setCheckNumber(pProduct.getCheckNumber());
                vProduct.setProductDate(pProduct.getProductDate());
                // save product & return
                Product vSavedProduct = gProductRepository.save(vProduct);
                return new ResponseEntity<>(vSavedProduct, HttpStatus.CREATED);
            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity()
                        .body("Failed to Create specified Product: " + e.getCause().getCause().getMessage());
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }

    }

    // Update product by id
    @PutMapping("product-lines/{productLineId}products/{id}")
    public ResponseEntity<Object> updateProduct(
            @PathVariable Integer productLineId,
            @PathVariable Integer productId,
            @Valid @RequestBody Product pProduct) {
        Optional<Product> vProductData = gProductRepository.findById(productId);
        if (vProductData.isPresent()) {
            Optional<Customer> vCustomerData = gCustomerRepository.findById(productLineId);
            if (vCustomerData.isPresent()) {
                try {
                    Product vProduct = vProductData.get();
                    vProduct.setAmount(pProduct.getAmount());
                    vProduct.setCheckNumber(pProduct.getCheckNumber());
                    vProduct.setProductDate(pProduct.getProductDate());
                    Product vSavedProduct = gProductRepository.save(vProduct);
                    return new ResponseEntity<>(vSavedProduct, HttpStatus.OK);
                } catch (Exception e) {
                    return ResponseEntity.unprocessableEntity()
                            .body("Failed to Update specified Customer: " + e.getCause().getCause().getMessage());
                }
            } else {
                Product vProductNull = new Product();
                return new ResponseEntity<>(vProductNull, HttpStatus.NOT_FOUND);
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }
    }

    // Delete product by id
    @DeleteMapping("products/{productId}")
    private ResponseEntity<Object> deleteProductById(@PathVariable Integer productId) {
        Optional<Product> vProductData = gProductRepository.findById(productId);
        if (vProductData.isPresent()) {
            try {
                gProductRepository.deleteById(productId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Product vProductNull = new Product();
            return new ResponseEntity<>(vProductNull, HttpStatus.NOT_FOUND);
        }
    }

}
