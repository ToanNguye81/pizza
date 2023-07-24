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

import com.api.pizza.entity.ProductLine;
import com.api.pizza.repository.IProductLineRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class ProductLineController {
    @Autowired
    IProductLineRepository gProductLineRepository;

    // get all ProductLine
    @GetMapping("/product-lines")
    public ResponseEntity<List<ProductLine>> getAllProductLine(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            // tạo ra một đối tượng Pageable để đại diện cho thông tin về phân trang.
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductLine> productLinePage = gProductLineRepository.findAll(pageable);
            List<ProductLine> productLineList = productLinePage.getContent();
            Long totalElement = productLinePage.getTotalElements();

            return ResponseEntity.ok()
                    .header("totalCount", String.valueOf(totalElement))
                    .body(productLineList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // create new product-line
    @PostMapping("/product-lines")
    public ResponseEntity<Object> createNewProductLine(
            @Valid @RequestBody ProductLine pProductLine) {
        try {
            ProductLine vProductLine = new ProductLine();
            vProductLine.setDescription(pProductLine.getDescription());
            vProductLine.setProductLine(pProductLine.getProductLine());
            vProductLine.setProducts(pProductLine.getProducts());
            vProductLine.setCreatedDate(new Date());
            ProductLine vProductLineSave = gProductLineRepository.save(vProductLine);
            return new ResponseEntity<>(vProductLineSave, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity()
                    .body("Failed to Create specified ProductLine: " + e.getCause().getCause().getMessage());
        }

    }

    // get product-line by id
    @GetMapping("/product-lines/{productLineId}")
    public ResponseEntity<Object> getProductLineById(
            @PathVariable Integer productLineId) {
        Optional<ProductLine> vProductLineData = gProductLineRepository.findById(productLineId);
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

    // Update product-line by id
    @PutMapping("/product-lines/{productLineId}")
    public ResponseEntity<Object> updateProductLine(
            @PathVariable Integer productLineId,
            @Valid @RequestBody ProductLine pProductLine) {
        Optional<ProductLine> vProductLineData = gProductLineRepository.findById(productLineId);
        if (vProductLineData.isPresent()) {
            try {
                ProductLine vProductLine = vProductLineData.get();
                vProductLine.setProductLine(pProductLine.getProductLine());
                vProductLine.setDescription(pProductLine.getDescription());
                vProductLine.setProducts(pProductLine.getProducts());
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

    // Delete product-line by id
    @DeleteMapping("/product-lines/{productLineId}")
    private ResponseEntity<Object> deleteProductLineById(
            @PathVariable Integer productLineId) {
        Optional<ProductLine> vProductLineData = gProductLineRepository.findById(productLineId);
        if (vProductLineData.isPresent()) {
            try {
                gProductLineRepository.deleteById(productLineId);
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
