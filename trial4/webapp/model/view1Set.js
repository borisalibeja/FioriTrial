// model/dataSet.js

const data = {
    ProductCollection: [
        {
            Name: "Laptop Pro",
            ProductID: "LP1001",
            Quantity: 25,
            Status: "Available",
            Available: true,
            Price: 1200.00,
            CurrencyCode: "USD",
            SupplierName: "TechSupplier Inc.",
            ProductPicUrl: "https://example.com/images/laptop-pro.jpg",
            Heavy: false,
            Category: "Electronics",
            // AdditionalCategory: "Accessories",
            // AdditionalCategoriesSelection: [
            //     { Key: "ACC001", Name: "Accessories" },
            //     { Key: "BAT001", Name: "Batteries" }
            // ],
            DeliveryDate: "/Date(1672444800000)/" // Timestamp format
        },
        {
            Name: "Smartphone X",
            ProductID: "SP2001",
            Quantity: 50,
            Status: "Out of Stock",
            Available: false,
            Price: 899.99,
            CurrencyCode: "USD",
            SupplierName: "MobileWorld Co.",
            ProductPicUrl: "https://example.com/images/smartphone-x.jpg",
            Heavy: false,
            Category: "Mobile",
            // AdditionalCategory: "Chargers",
            // AdditionalCategoriesSelection: [
            //     { Key: "CHG001", Name: "Chargers" },
            //     { Key: "CSE001", Name: "Cases" }
            // ],
            DeliveryDate: "/Date(1675123200000)/" // Timestamp format
        },
        {
            Name: "Wireless Headphones",
            ProductID: "WH3001",
            Quantity: 100,
            Status: "Available",
            Available: true,
            Price: 299.99,
            CurrencyCode: "USD",
            SupplierName: "AudioKing Ltd.",
            ProductPicUrl: "https://example.com/images/wireless-headphones.jpg",
            Heavy: false,
            Category: "Audio",
            AdditionalCategory: "Accessories",
            AdditionalCategoriesSelection: [
                { Key: "SPK001", Name: "Speakers" },
                { Key: "ACC001", Name: "Accessories" }
            ],
            DeliveryDate: "/Date(1677801600000)/" // Timestamp format
        }
    ],
    Suppliers: [
        { Name: "TechSupplier Inc.", SupplierID: "S001" },
        { Name: "MobileWorld Co.", SupplierID: "S002" },
        { Name: "AudioKing Ltd.", SupplierID: "S003" }
    ],
    Categories: [
        { Name: "Electronics", CategoryID: "C001" },
        { Name: "Mobile", CategoryID: "C002" },
        { Name: "Audio", CategoryID: "C003" },
        { Name: "Accessories", CategoryID: "C004" },
        { Name: "Chargers", CategoryID: "C005" }
    ]
};


