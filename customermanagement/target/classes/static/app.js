$(document).ready(function () {
    var authToken; // Variable to store the authentication token

    // Function to authenticate the user and fetch the authentication token
    function authenticateUser() {

        const apiUrl = 'https://qa.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';

        fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "login_id": "",
            "password": ""
        })
        })
        .then(response => response.json())
        .then(data => {
            authToken = data.token;
            fetchRemoteCustomerList();
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });

    }

    // Function to fetch the customer list from the remote API
    function fetchRemoteCustomerList() {
        // GET request to the remote API for customer list
        $.ajax({
            url: "https://qa.sunbasedata.com/sunbase/portal/api/assignment.jsp",
            type: "GET",
            data: { cmd: "get_customer_list" },
            headers: {
                Authorization: "Bearer " + authToken
            },
            success: function (remoteCustomers) {
                // Sync the remote customers with the local database
                syncCustomers(remoteCustomers);
            },
            error: function (error) {
                console.error("Error fetching remote customer list:", error);
            }
        });
    }

    // Function to sync the remote customers with the local database
    function syncCustomers(remoteCustomers) {
        remoteCustomers.forEach(function (remoteCustomer) {
            // Check if the customer already exists in the local database
            // Assuming local database API has an endpoint for checking existence
            $.ajax({
                url: "http://localhost:8080/api/customers/checkExistence",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ email: remoteCustomer.email }),
                success: function (exists) {
                    if (exists) {
                        // Customer exists, update the existing customer
                        updateLocalCustomer(remoteCustomer);
                    } else {
                        // Customer does not exist, add the new customer
                        addLocalCustomer(remoteCustomer);
                    }
                },
                error: function (error) {
                    console.error("Error checking customer existence:", error);
                }
            });
        });
    }

    // Function to update an existing customer in the local database
    function updateLocalCustomer(remoteCustomer) {
        // Assuming local database API has an endpoint for updating customers
        $.ajax({
            url: "http://localhost:8080/api/customers/update",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(remoteCustomer),
            success: function () {
                // Log success or perform additional actions if needed
                console.log("Customer updated:", remoteCustomer.email);
            },
            error: function (error) {
                console.error("Error updating customer:", error);
            }
        });
    }

    // Function to add a new customer to the local database
    function addLocalCustomer(remoteCustomer) {
        // Assuming your local database API has an endpoint for adding customers
        $.ajax({
            url: "http://localhost:8080/api/customers/add",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(remoteCustomer),
            success: function () {
                // Log success or perform additional actions if needed
                console.log("Customer added:", remoteCustomer.email);
            },
            error: function (error) {
                console.error("Error adding customer:", error);
            }
        });
    }

    // Click event handler for the "Sync" button
    $("#syncButton").click(function () {
        console.log("Clicked");
        authenticateUser();
    });

    // Function to add a new customer
    window.addCustomer = function () {
        var newCustomer = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            street: $('#street').val(),
            address: $('#address').val(),
            city: $('#city').val(),
            state: $('#state').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
        };

        // POST request to the backend to add the new customer
        $.ajax({
            url: 'http://localhost:8080/api/customers',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newCustomer),
            success: function (data) {
                // Fetch the updated customer list from the backend
                fetchCustomerList();
            },
            error: function (error) {
                console.error('Error adding customer:', error);
            }
        });
    };

    // Function to fetch the customer list from the backend
    function fetchCustomerList() {
        // GET request to the backend to get the list of customers
        $.ajax({
            url: 'http://localhost:8080/api/customers',
            type: 'GET',
            success: function (data) {
                // Display the updated customer list
                displayCustomerList(data);
            },
            error: function (error) {
                console.error('Error fetching customer list:', error);
            }
        });
    }

    // Function to display the customer list in the table
    function displayCustomerList(customers) {
        var tbody = $('#customerTable tbody');
        tbody.empty();

        customers.forEach(function (customer) {
            var row = '<tr>';
            row += '<td>' + customer.firstName + '</td>';
            row += '<td>' + customer.lastName + '</td>';
            row += '<td>' + customer.address + '</td>';
            row += '<td>' + customer.city + '</td>';
            row += '<td>' + customer.state + '</td>';
            row += '<td>' + customer.email + '</td>';
            row += '<td>' + customer.phone + '</td>';
            row += '<td><button onclick="updateCustomer(' + customer.id + ')">Edit</button>' +
                   '<button onclick="deleteCustomer(' + customer.id + ')">Delete</button></td>';
            row += '</tr>';

            tbody.append(row);
        });
    }

    // Function to handle editing a customer
    window.updateCustomer = function (customerId) {
        // Implement the logic to handle editing a customer
        console.log('Edit customer with ID:', customerId);
    };

    // Function to handle deleting a customer
    window.deleteCustomer = function (customerId) {
        // DELETE request to the backend to delete the customer
        $.ajax({
            url: 'http://localhost:8080/api/customers/' + customerId,
            type: 'DELETE',
            success: function () {
                // Fetch the updated customer list from the backend after deletion
                fetchCustomerList();
            },
            error: function (error) {
                console.error('Error deleting customer:', error);
            }
        });
    };

    // Fetch the initial customer list when the page loads
    fetchCustomerList();
});
