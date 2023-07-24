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

import com.api.pizza.repository.IOrderRepository;
import com.api.pizza.entity.Order;
import com.api.pizza.entity.OrderDetail;
import com.api.pizza.repository.IOrderDetailRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class OrderDetailController {
    @Autowired
    IOrderDetailRepository gOrderDetailRepository;
    @Autowired
    IOrderRepository gOrderRepository;

    // get all OrderDetail
    @GetMapping("/order-details")
    public ResponseEntity<List<OrderDetail>> getAllOrderDetail(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            // tạo ra một đối tượng Pageable để đại diện cho thông tin về phân trang.
            Pageable pageable = PageRequest.of(page, size);
            Page<OrderDetail> orderDetailPage = gOrderDetailRepository.findAll(pageable);
            List<OrderDetail> orderDetailList = orderDetailPage.getContent();
            Long totalElement = orderDetailPage.getTotalElements();

            return ResponseEntity.ok()
                    .header("totalCount", String.valueOf(totalElement))
                    .body(orderDetailList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // get order-details by id
    @GetMapping("/order-details/{orderDetailId}")
    public ResponseEntity<Object> getOrderDetailById(@PathVariable Integer orderDetailId) {
        Optional<OrderDetail> vOrderDetailData = gOrderDetailRepository.findById(orderDetailId);
        if (vOrderDetailData.isPresent()) {
            try {
                OrderDetail vOrderDetail = vOrderDetailData.get();
                return new ResponseEntity<>(vOrderDetail, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            OrderDetail vOrderDetailNull = new OrderDetail();
            return new ResponseEntity<>(vOrderDetailNull, HttpStatus.NOT_FOUND);
        }
    }

    // Get order-detail by orderId
    @GetMapping("/orders/{orderId}/order-details")
    public List<OrderDetail> getOrderDetailByOrderId(@PathVariable Integer orderId) {
        return gOrderDetailRepository.findByOrderId(orderId);
    }

    // create new order-details
    @PostMapping("/orders/{orderId}/order-details")
    public ResponseEntity<Object> createNewOrderDetail(@Valid @RequestBody OrderDetail pOrderDetail,
            @PathVariable Integer orderId) {
        Optional<Order> vOrderData = gOrderRepository.findById(orderId);
        if (vOrderData.isPresent()) {
            try {
                OrderDetail vOrderDetail = new OrderDetail();
                vOrderDetail.setOrder(vOrderData.get());
                vOrderDetail.setProduct(pOrderDetail.getProduct());
                vOrderDetail.setQuantityOrder(pOrderDetail.getQuantityOrder());
                vOrderDetail.setPriceEach(pOrderDetail.getPriceEach());
                vOrderDetail.setCreatedDate(new Date());
                // save order-details & return
                OrderDetail vSavedOrderDetail = gOrderDetailRepository.save(vOrderDetail);
                return new ResponseEntity<>(vSavedOrderDetail, HttpStatus.CREATED);
            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity()
                        .body("Failed to Create specified OrderDetail: " + e.getCause().getCause().getMessage());
            }
        } else {
            Order vOrderNull = new Order();
            return new ResponseEntity<>(vOrderNull, HttpStatus.NOT_FOUND);
        }

    }

    // Update order-details by id
    @PutMapping("/orders/{orderId}/order-details/{orderDetailId}")
    public ResponseEntity<Object> updateOrderDetail(
            @PathVariable Integer orderId,
            @PathVariable Integer orderDetailId,
            @Valid @RequestBody OrderDetail pOrderDetail) {
        Optional<OrderDetail> vOrderDetailData = gOrderDetailRepository.findById(orderDetailId);
        if (vOrderDetailData.isPresent()) {
            Optional<Order> vOrderData = gOrderRepository.findById(orderId);
            if (vOrderData.isPresent()) {
                try {

                    OrderDetail vOrderDetail = vOrderDetailData.get();
                    vOrderDetail.setOrder(vOrderData.get());
                    vOrderDetail.setProduct(pOrderDetail.getProduct());
                    vOrderDetail.setQuantityOrder(pOrderDetail.getQuantityOrder());
                    vOrderDetail.setPriceEach(pOrderDetail.getPriceEach());
                    vOrderDetail.setUpdatedDate(new Date());

                    OrderDetail vSavedOrderDetail = gOrderDetailRepository.save(vOrderDetail);
                    return new ResponseEntity<>(vSavedOrderDetail, HttpStatus.OK);
                } catch (Exception e) {
                    return ResponseEntity.unprocessableEntity()
                            .body("Failed to Update specified Order: " + e.getCause().getCause().getMessage());
                }
            } else {
                OrderDetail vOrderDetailNull = new OrderDetail();
                return new ResponseEntity<>(vOrderDetailNull, HttpStatus.NOT_FOUND);
            }
        } else {
            Order vOrderNull = new Order();
            return new ResponseEntity<>(vOrderNull, HttpStatus.NOT_FOUND);
        }
    }

    // Delete order-details by id
    @DeleteMapping("/order-details/{orderDetailId}")
    private ResponseEntity<Object> deleteOrderDetailById(@PathVariable Integer orderDetailId) {
        Optional<OrderDetail> vOrderDetailData = gOrderDetailRepository.findById(orderDetailId);
        if (vOrderDetailData.isPresent()) {
            try {
                gOrderDetailRepository.deleteById(orderDetailId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            OrderDetail vOrderDetailNull = new OrderDetail();
            return new ResponseEntity<>(vOrderDetailNull, HttpStatus.NOT_FOUND);
        }
    }

}
