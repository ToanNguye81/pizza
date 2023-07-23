package com.api.pizza.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
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
import com.api.pizza.entity.Order;
import com.api.pizza.entity.OrderDetail;
import com.api.pizza.entity.Product;
import com.api.pizza.repository.ICustomerRepository;
import com.api.pizza.repository.IOrderDetailRepository;
import com.api.pizza.repository.IOrderRepository;
import com.api.pizza.repository.IProductRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class OrderController {
    @Autowired
    IOrderRepository gOrderRepository;
    @Autowired
    ICustomerRepository gCustomerRepository;
    @Autowired
    IProductRepository gProductRepository;
    @Autowired
    IOrderDetailRepository gOrderDetailRepository;

    // get all Order
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrder(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size) {
        try {
            // tạo ra một đối tượng Pageable để đại diện cho thông tin về phân trang.
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> countryPage = gOrderRepository.findAll(pageable);
            List<Order> countryList = countryPage.getContent();
            Long totalElement = countryPage.getTotalElements();
            return ResponseEntity.ok()
                    .header("totalCount", String.valueOf(totalElement))
                    .body(countryList);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // get order by id
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Object> getOrderById(@PathVariable Integer orderId) {
        Optional<Order> vOrderData = gOrderRepository.findById(orderId);
        if (vOrderData.isPresent()) {
            try {
                Order vOrder = vOrderData.get();
                return new ResponseEntity<>(vOrder, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Order vOrderNull = new Order();
            return new ResponseEntity<>(vOrderNull, HttpStatus.NOT_FOUND);
        }
    }

    // Get order by customerId
    @GetMapping("/customers/{customerId}/orders")
    public List<Order> getOrderByCustomerId(@PathVariable Integer customerId) {
        return gOrderRepository.findByCustomerId(customerId);
    }

    // create new order
    @PostMapping("/customers/{customerId}/orders")
    public ResponseEntity<Object> createNewOrderWithCustomerId(
            @Valid @RequestBody Order pOrder,
            @PathVariable Integer customerId) {
        Optional<Customer> vCustomerData = gCustomerRepository.findById(customerId);
        if (vCustomerData.isPresent()) {
            try {
                Order vOrder = new Order();
                vOrder.setComments(pOrder.getComments());
                vOrder.setOrderDate(new Date());
                vOrder.setRequiredDate(pOrder.getRequiredDate());
                vOrder.setShippedDate(pOrder.getShippedDate());
                vOrder.setStatus(pOrder.getStatus());
                vOrder.setCustomer(vCustomerData.get());
                // save order & return
                Order vSavedOrder = gOrderRepository.save(vOrder);
                return new ResponseEntity<>(vSavedOrder, HttpStatus.CREATED);
            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity()
                        .body("Failed to Create specified Order: " +
                                e.getCause().getCause().getMessage());
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }
    }

    // Update order by id
    @PutMapping("/customers/{customerId}/orders/{orderId}")
    public ResponseEntity<Object> updateOrder(
            @PathVariable Integer customerId,
            @PathVariable Integer orderId,
            @Valid @RequestBody Order pOrder) {
        Optional<Order> vOrderData = gOrderRepository.findById(orderId);
        if (vOrderData.isPresent()) {
            Optional<Customer> vCustomerData = gCustomerRepository.findById(customerId);
            if (vCustomerData.isPresent()) {
                try {

                    Order vOrder = vOrderData.get();
                    vOrder.setComments(pOrder.getComments());
                    vOrder.setOrderDate(pOrder.getOrderDate());
                    vOrder.setShippedDate(pOrder.getShippedDate());
                    vOrder.setStatus(pOrder.getStatus());
                    vOrder.setUpdatedDate(new Date());
                    vOrder.setRequiredDate(pOrder.getRequiredDate());
                    vOrder.setCustomer(vCustomerData.get());
                    Order vSavedOrder = gOrderRepository.save(vOrder);
                    return new ResponseEntity<>(vSavedOrder, HttpStatus.OK);
                } catch (Exception e) {
                    return ResponseEntity.unprocessableEntity()
                            .body("Failed to Update specified Customer: " + e.getCause().getCause().getMessage());
                }
            } else {
                Order vOrderNull = new Order();
                return new ResponseEntity<>(vOrderNull, HttpStatus.NOT_FOUND);
            }
        } else {
            Customer vCustomerNull = new Customer();
            return new ResponseEntity<>(vCustomerNull, HttpStatus.NOT_FOUND);
        }
    }

    // Delete order by id
    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<Object> deleteOrderById(@PathVariable Integer orderId) {
        Optional<Order> vOrderData = gOrderRepository.findById(orderId);
        if (vOrderData.isPresent()) {
            try {
                gOrderRepository.deleteById(orderId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            Order vOrderNull = new Order();
            return new ResponseEntity<>(vOrderNull, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(value = "/orders")
    public ResponseEntity<Object> createNewOrder(@Valid @RequestBody Map<String, Object> req) {
        // TODO: process POST request
        // Map<String, Object> newOrder = (Map<String, Object>) req.get("newOrder");
        Integer customerId = (Integer) req.get("customerId");
        System.out.println(customerId);
        String comments = (String) req.get("comments");
        List<Map<String, Object>> cart = (List<Map<String, Object>>) req.get("cart");

        Optional<Customer> existingCustomer = gCustomerRepository.findById(customerId);
        if (existingCustomer.isPresent()) {

            // check all product is existing
            Boolean allProductExisting = true;
            for (Map<String, Object> product : cart) {
                Integer productId = (Integer) product.get("productId");
                if (isExistingProduct(productId) == false) {

                    allProductExisting = false;
                }
            }
            if (allProductExisting) {
                // create order
                Order createdOrder = createOrder(comments, existingCustomer.get());
                // Create Order Detail List
                createOrderDetailList(cart, createdOrder);
                ;

                return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
            } else {

                return new ResponseEntity<>("At least productId is invalid", HttpStatus.BAD_REQUEST);
            }

        } else {

            return new ResponseEntity<>("Not found customer!!", HttpStatus.NOT_FOUND);
        }
    }

    // Check product is existing
    public boolean isExistingProduct(Integer productId) {
        return gProductRepository.existsById(productId);
    }

    // Create Order
    public Order createOrder(String comment, Customer customer) {
        System.out.println(customer);
        Order newOrder = new Order();
        newOrder.setOrderDate(new Date());
        newOrder.setComments(comment);
        newOrder.setStatus("Created");
        newOrder.setCustomer(customer);
        Order createdOrder = gOrderRepository.save(newOrder);
        return createdOrder;
    }

    // Create Order Detail List
    public List<OrderDetail> createOrderDetailList(List<Map<String, Object>> cart, Order order) {
        List<OrderDetail> orderDetailList = new ArrayList<>();

        for (Map<String, Object> product : cart) {
            Integer productId = (Integer) product.get("productId");
            Integer quantityOrder = (Integer) product.get("quantity");
            Product vProduct = gProductRepository.findById(productId).get();
            OrderDetail createdOrderDetail = createOrderDetail(vProduct, quantityOrder,
                    order);
            orderDetailList.add(createdOrderDetail);
        }
        return orderDetailList;
    }

    // Create Order Detail
    public OrderDetail createOrderDetail(Product product, Integer quantityOrder,
            Order order) {
        OrderDetail newOrderDetail = new OrderDetail();
        newOrderDetail.setCreatedDate(new Date());
        newOrderDetail.setProduct(product);
        newOrderDetail.setOrder(order);
        newOrderDetail.setPriceEach(product.getBuyPrice());
        newOrderDetail.setQuantityOrder(quantityOrder);
        OrderDetail createdOrderDetail = gOrderDetailRepository.save(newOrderDetail);
        return createdOrderDetail;
    }

}
