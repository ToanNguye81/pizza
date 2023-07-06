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

import com.api.pizza.model.ProductLine;
import com.api.pizza.repository.IProductLineRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class ProductLineController {
    @Autowired
    IProductLineRepository gProductLineRepository;

    // get all ProductLine
    @GetMapping("/customers")
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

    // create new customer
    @PostMapping("/customers")
    public ResponseEntity<Object> createNewProductLine(
            @Valid @RequestBody ProductLine pProductLine) {
        try {
            ProductLine vProductLine = new ProductLine();

            vProductLine.setDescription(pProductLine.getDescription());
            vProductLine.setProductLine(pProductLine.getProductLine());
            vProductLine.setCreatedDate(new Date());

            vProductLine.setCreatedDate(new Date());

            ProductLine vProductLineSave = gProductLineRepository.save(vProductLine);
            return new ResponseEntity<>(vProductLineSave, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity()
                    .body("Failed to Create specified ProductLine: " + e.getCause().getCause().getMessage());
        }

    }

    // get customer by id
    @GetMapping("/customers/{customerId}")
    public ResponseEntity<Object> getProductLineById(
            @PathVariable Integer customerId) {
        Optional<ProductLine> vProductLineData = gProductLineRepository.findById(customerId);
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

    // Update customer by id
    @PutMapping("/customers/{id}")
    public ResponseEntity<Object> updateProductLine(
            @PathVariable Integer id,
            @Valid @RequestBody ProductLine pProductLine) {
        Optional<ProductLine> vProductLineData = gProductLineRepository.findById(id);
        if (vProductLineData.isPresent()) {
            try {
                ProductLine vProductLine = vProductLineData.get();

                vProductLine.setDescription(pProductLine.getDescription());
                vProductLine.setProductLine(pProductLine.getProductLine());
                vProductLine.setUpdatedDate(new Date());

                ProductLine vProductLineSave = gProductLineRepository.save(vProductLine);
                return new ResponseEntity<>(vProductLineSave, HttpStatus.OK);
            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity()
                        .body("Failed to Update specified ProductLine: " + e.getCause().getCause().getMessage());
            }
        } else {
            ProductLine vProductLineNull = new ProductLine();
            return new ResponseEntity<>(vProductLineNull, HttpStatus.NOT_FOUND);
        }
    }

    // Delete customer by id
    @DeleteMapping("/customers/{id}")
    private ResponseEntity<Object> deleteProductLineById(
            @PathVariable Integer id) {
        Optional<ProductLine> vProductLineData = gProductLineRepository.findById(id);
        if (vProductLineData.isPresent()) {
            try {
                gProductLineRepository.deleteById(id);
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
