// Add event listeners
document.getElementById('filterButton').addEventListener('click', fetchProducts);
document.getElementById('add-product-form').addEventListener('submit', addProduct);
document.getElementById('order-form').addEventListener('submit', placeOrder);
document.getElementById('fetch-orders-button').addEventListener('click', fetchOrders); // Added listener for fetching orders
document.getElementById('fetch-order-details-button').addEventListener('click', fetchOrderDetails); // Added listener for fetching order details

// Function to fetch products based on selected filters
async function fetchProducts() {
    const category = document.getElementById('filter-category').value;
    const priceMax = document.getElementById('price_max').value;
    const page = document.getElementById('page').value || 1; // Get current page from input or default to 1
    const limit = document.getElementById('limit').value || 10; // Get limit from input or default to 10
    const sortBy = document.getElementById('sortBy').value || 'relevance'; // Get sortBy from dropdown

    let url = `http://localhost:5000/api/v1/products?page=${page}&limit=${limit}&sortBy=${sortBy}&`;

    if (category) {
        url += `category=${category}&`;
    }
    if (priceMax) {
        url += `price_max=${priceMax}&`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayProducts(data.products, data.totalPages, data.currentPage);
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('product-list').innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
}

// Function to display products on the page
function displayProducts(products, totalPages, currentPage) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            <p>${product.description}</p> <!-- Display description -->
            <p>Category: ${product.category}</p>
            <p>Stock: ${product.stock}</p>
            <button class="delete-button" onclick="deleteProduct('${product._id}')">Delete</button>
        `;
        productList.appendChild(productDiv);
    });

    // Update pagination
    updatePagination(totalPages, currentPage);
}

// Function to update pagination controls
function updatePagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.addEventListener('click', () => {
            document.getElementById('page').value = i; // Set current page
            fetchProducts(); // Fetch products for the selected page
        });
        pagination.appendChild(pageButton);
    }
}

// Function to add a new product
async function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value; // Get description from input
    const category = document.getElementById('category').value;
    const stock = document.getElementById('stock').value;
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
        const response = await fetch('http://localhost:5000/api/v1/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include JWT in header
            },
            body: JSON.stringify({ name, price, description, category, stock }), // Send description
        });

        if (!response.ok) {
            throw new Error('Failed to add product');
        }

        document.getElementById('message').textContent = 'Product added successfully!';
        document.getElementById('message').style.color = 'green';
        document.getElementById('add-product-form').reset();
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error('Error adding product:', error);
        document.getElementById('message').textContent = 'Failed to add product.';
        document.getElementById('message').style.color = 'red';
    }
}

// Function to place an order
async function placeOrder(event) {
    event.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const productId = document.getElementById('orderProductId').value; // Get product ID from order form
    const quantity = document.getElementById('quantity').value;
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
        const response = await fetch('http://localhost:5000/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include JWT in header
            },
            body: JSON.stringify({ customerName, productId, quantity }),
        });

        if (!response.ok) {
            throw new Error('Failed to place order');
        }

        document.getElementById('order-message').textContent = 'Order placed successfully!';
        document.getElementById('order-message').style.color = 'green';
        document.getElementById('order-form').reset();
    } catch (error) {
        console.error('Error placing order:', error);
        document.getElementById('order-message').textContent = 'Failed to place order.';
        document.getElementById('order-message').style.color = 'red';
    }
}

// Function to fetch orders
async function fetchOrders() {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
        const response = await fetch('http://localhost:5000/api/v1/orders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include JWT in header
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayOrders(data.orders); // Assuming the response contains an 'orders' array
    } catch (error) {
        console.error('Error fetching orders:', error);
        document.getElementById('order-list').innerHTML = '<p>Failed to load orders. Please try again later.</p>';
    }
}

// Function to display orders
function displayOrders(orders) {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    if (orders.length === 0) {
        orderList.innerHTML = '<p>No orders found.</p>';
        return;
    }

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = `
            <h2>Order ID: ${order._id}</h2>
            <p>Customer Name: ${order.customerName}</p>
            <p>Product ID: ${order.productId}</p>
            <p>Quantity: ${order.quantity}</p>
            <p>Status: ${order.status}</p> <!-- Include other relevant details -->
        `;
        orderList.appendChild(orderDiv);
    });
}

// Function to fetch order details by Order ID
async function fetchOrderDetails() {
    const orderId = document.getElementById('orderId').value; // Get order ID from input
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
        const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include JWT in header
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }

        const order = await response.json(); // Assuming the response is a single order object
        displayOrderDetails(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        document.getElementById('order-detail').innerHTML = '<p>Failed to load order details. Please try again later.</p>';
    }
}

// Function to display order details
function displayOrderDetails(order) {
    const orderDetail = document.getElementById('order-detail');
    orderDetail.innerHTML = '';

    if (!order) {
        orderDetail.innerHTML = '<p>No order found with this ID.</p>';
        return;
    }

    orderDetail.innerHTML = `
        <h2>Order ID: ${order._id}</h2>
        <p>Customer Name: ${order.customerName}</p>
        <p>Product ID: ${order.productId}</p>
        <p>Quantity: ${order.quantity}</p>
        <p>Status: ${order.status}</p>
        <p>Order Date: ${new Date(order.createdAt).toLocaleDateString()}</p> <!-- Display order date -->
    `;
}
