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

import com.api.pizza.entity.Customer;
import com.api.pizza.entity.Payment;
import com.api.pizza.repository.ICustomerRepository;
import com.api.pizza.repository.IPaymentRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class PaymentController {
    @Autowired
    IPaymentRepository gPaymentRepository;
    @Autowired
    ICustomerRepository gCustomerRepository;

    // get all Payment
    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayment(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            // tạo ra một đối tượng Pageable để đại diện cho thông tin về phân trang.
            Pageable pageable = PageRequest.of(page, size);
            Page<Payment> paymentPage = gPaymentRepository.findAll(pageable);
            List<Payment> paymentList = paymentPage.getContent();
            Long totalElement = paymentPage.getTotalElements();

            return ResponseEntity.ok()
                    .header("totalCount", String.valueOf(totalElement))
                    .body(paymentList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // get payment by id
    @GetMapping("/payments/{paymentId}")
    public ResponseEntity<Object> getPaymentById(@PathVariable Integer paymentId) {
        Optional<Payment> vPaymentData = gPaymentRepository.findById(paymentId);
        if (vPaymentData.isPresent()) {
            try {
                Payment vPayment = vPaymentData.get();
                return new ResponseEntity<>(vPayment, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Payment vPaymentNull = new Payment();
            return new ResponseEntity<>(vPaymentNull, HttpStatus.NOT_FOUND);
        }
    }

    // Get Payment by customerId
    @GetMapping("/customers/{customerId}/payments")
    public List<Payment> getPaymentByCustomerId(@PathVariable Integer customerId) {
        return gPaymentRepository.findByCustomerId(customerId);
    }

    // create new payment
    @PostMapping("/customers/{customerId}/payments")
    public ResponseEntity<Object> createNewPayment(@Valid @RequestBody Payment pPayment,
            @PathVariable Integer customerId) {
        Optional<Customer> vCustomerData = gCustomerRepository.findById(customerId);
        if (vCustomerData.isPresent()) {
            try {
                Payment vPayment = new Payment();
                vPayment.setCustomer(vCustomerData.get());
                vPayment.setAmount(pPayment.getAmount());
                vPayment.setCheckNumber(pPayment.getCheckNumber());
                vPayment.setPaymentDate(pPayment.getPaymentDate());
                // save payment & return
                Payment vSavedPayment = gPaymentRepository.save(vPayment);
                return new ResponseEntity<>(vSavedPayment, HttpStatus.CREATED);
            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity()
                        .body("Failed to Create specified Payment: " + e.getCause().getCause().getMessage());
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }

    }

    // Update payment by paymentId and customerId
    @PutMapping("/customers/{customerId}/payments/{paymentId}")
    public ResponseEntity<Object> updatePayment(
            @PathVariable Integer customerId,
            @PathVariable Integer paymentId,
            @Valid @RequestBody Payment pPayment) {
        Optional<Payment> vPaymentData = gPaymentRepository.findById(paymentId);
        if (vPaymentData.isPresent()) {
            Optional<Customer> vCustomerData = gCustomerRepository.findById(customerId);
            if (vCustomerData.isPresent()) {
                try {
                    Payment vPayment = vPaymentData.get();
                    vPayment.setAmount(pPayment.getAmount());
                    vPayment.setCheckNumber(pPayment.getCheckNumber());
                    vPayment.setPaymentDate(pPayment.getPaymentDate());
                    vPayment.setCustomer(vCustomerData.get());
                    Payment vSavedPayment = gPaymentRepository.save(vPayment);
                    return new ResponseEntity<>(vSavedPayment, HttpStatus.OK);
                } catch (Exception e) {
                    return ResponseEntity.unprocessableEntity()
                            .body("Failed to Update specified Customer: " + e.getCause().getCause().getMessage());
                }
            } else {
                Payment vPaymentNull = new Payment();
                return new ResponseEntity<>(vPaymentNull, HttpStatus.NOT_FOUND);
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }
    }

    // Update payment by only paymentId
    @PutMapping(value = "/payments/{paymentId}")
    public ResponseEntity<Object> updatePaymentById(
            @PathVariable Integer paymentId,
            @RequestBody Payment pPayment) {
        // find payment by id
        Optional<Payment> paymentData = gPaymentRepository.findById(paymentId);
        if (paymentData.isPresent()) {
            // get existed payment
            Payment vPayment = paymentData.get();
            // update payment
            vPayment.setAmount(pPayment.getAmount());
            vPayment.setCheckNumber(pPayment.getCheckNumber());
            vPayment.setPaymentDate(pPayment.getPaymentDate());
            Payment savedPayment = gPaymentRepository.save(vPayment);
            // return
            return new ResponseEntity<>(savedPayment, HttpStatus.OK);
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }
    }

    // Delete payment by id
    @DeleteMapping("/payments/{paymentId}")
    private ResponseEntity<Object> deletePaymentById(@PathVariable Integer paymentId) {
        Optional<Payment> vPaymentData = gPaymentRepository.findById(paymentId);
        if (vPaymentData.isPresent()) {
            try {
                gPaymentRepository.deleteById(paymentId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Payment vPaymentNull = new Payment();
            return new ResponseEntity<>(vPaymentNull, HttpStatus.NOT_FOUND);
        }
    }

}
