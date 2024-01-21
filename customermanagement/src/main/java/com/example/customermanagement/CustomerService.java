package com.example.customermanagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public boolean checkCustomerExistence(String email) {
        Optional<Customer> existingCustomer = customerRepository.findByEmail(email);
        return existingCustomer.isPresent();
    }

    public void updateCustomer(Customer updatedCustomer) {
        customerRepository.save(updatedCustomer);
    }

    public void addCustomer(Customer newCustomer) {
        customerRepository.save(newCustomer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("student not found with id " + id));
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Optional<Customer> optionalCustomer = customerRepository.findById(id);

        if (optionalCustomer.isPresent()) {
            Customer existingCustomer = optionalCustomer.get();
            existingCustomer.setFirstName(customerDetails.getFirstName());
            existingCustomer.setLastName(customerDetails.getLastName());
            existingCustomer.setStreet(customerDetails.getStreet());
            existingCustomer.setAddress(customerDetails.getAddress());
            existingCustomer.setCity(customerDetails.getCity());
            existingCustomer.setState(customerDetails.getState());
            existingCustomer.setEmail(customerDetails.getEmail());
            existingCustomer.setPhone(customerDetails.getPhone());

            return customerRepository.save(existingCustomer);
        } else {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
    }

    public void deleteCustomer(Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
    }
}
