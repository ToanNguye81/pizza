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

import com.api.pizza.entity.Office;
import com.api.pizza.repository.IOfficeRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class OfficeController {
    @Autowired
    IOfficeRepository gOfficeRepository;

    // get all Office
    @GetMapping("/offices")
    public ResponseEntity<List<Office>> getAllOffice(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            // tạo ra một đối tượng Pageable để đại diện cho thông tin về phân trang.
            Pageable pageable = PageRequest.of(page, size);
            Page<Office> officePage = gOfficeRepository.findAll(pageable);
            List<Office> officeList = officePage.getContent();
            Long totalElement = officePage.getTotalElements();

            return ResponseEntity.ok()
                    .header("totalCount", String.valueOf(totalElement))
                    .body(officeList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // create new office
    @PostMapping("/offices")
    public ResponseEntity<Object> createNewOffice(
            @Valid @RequestBody Office pOffice) {
        try {
            Office vOffice = new Office();

            vOffice.setAddressLine(pOffice.getTerritory());
            vOffice.setCity(pOffice.getState());
            vOffice.setCountry(pOffice.getPhone());
            vOffice.setPhone(pOffice.getCountry());
            vOffice.setState(pOffice.getCity());
            vOffice.setTerritory(pOffice.getAddressLine());
            vOffice.setCreatedDate(new Date());

            Office vOfficeSave = gOfficeRepository.save(vOffice);
            return new ResponseEntity<>(vOfficeSave, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity()
                    .body("Failed to Create specified Office: " + e.getCause().getCause().getMessage());
        }

    }

    // get office by id
    @GetMapping("/offices/{officeId}")
    public ResponseEntity<Object> getOfficeById(
            @PathVariable Integer officeId) {
        Optional<Office> vOfficeData = gOfficeRepository.findById(officeId);
        if (vOfficeData.isPresent()) {
            try {
                Office vOffice = vOfficeData.get();
                return new ResponseEntity<>(vOffice, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Office vOfficeNull = new Office();
            return new ResponseEntity<>(vOfficeNull, HttpStatus.NOT_FOUND);
        }
    }

    // Update office by id
    @PutMapping("/offices/{officeId}")
    public ResponseEntity<Object> updateOffice(
            @PathVariable Integer officeId,
            @Valid @RequestBody Office pOffice) {
        Optional<Office> vOfficeData = gOfficeRepository.findById(officeId);
        if (vOfficeData.isPresent()) {
            try {
                Office vOffice = vOfficeData.get();

                vOffice.setAddressLine(pOffice.getTerritory());
                vOffice.setCity(pOffice.getState());
                vOffice.setCountry(pOffice.getPhone());
                vOffice.setPhone(pOffice.getCountry());
                vOffice.setState(pOffice.getCity());
                vOffice.setTerritory(pOffice.getAddressLine());
                vOffice.setUpdatedDate(new Date());

                Office vOfficeSave = gOfficeRepository.save(vOffice);
                return new ResponseEntity<>(vOfficeSave, HttpStatus.OK);
            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity()
                        .body("Failed to Update specified Office: " + e.getCause().getCause().getMessage());
            }
        } else {
            Office vOfficeNull = new Office();
            return new ResponseEntity<>(vOfficeNull, HttpStatus.NOT_FOUND);
        }
    }

    // Delete office by officeId
    @DeleteMapping("/offices/{officeId}")
    private ResponseEntity<Object> deleteOfficeById(
            @PathVariable Integer officeId) {
        Optional<Office> vOfficeData = gOfficeRepository.findById(officeId);
        if (vOfficeData.isPresent()) {
            try {
                gOfficeRepository.deleteById(officeId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Office vOfficeNull = new Office();
            return new ResponseEntity<>(vOfficeNull, HttpStatus.NOT_FOUND);
        }
    }

}
