const dummyData = {
    products: [
        {
            id: 1,
            productName: "Cabai Merah",
            category: "spices",
            farmerName: "Pak Budi",
            location: "Malang",
            stock: 200,
            pricePerKg: 30000,
            image: "https://images.unsplash.com/photo-1707857204225-b526447975ab?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            productName: "Bawang Merah",
            category: "spices",
            farmerName: "Bu Siti",
            location: "Brebes",
            stock: 500,
            pricePerKg: 25000,
            image: "https://images.unsplash.com/photo-1565685225009-fc85d9109c80?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 3,
            productName: "Tomat",
            category: "vegetables",
            farmerName: "Pak Santoso",
            location: "Lembang",
            stock: 300,
            pricePerKg: 15000,
            image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 4,
            productName: "Kentang",
            category: "root-crops",
            farmerName: "Koperasi Tani Jaya",
            location: "Dieng",
            stock: 1200,
            pricePerKg: 12000,
            image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 5,
            productName: "Jagung",
            category: "grains",
            farmerName: "Pak Joko",
            location: "Grobogan",
            stock: 800,
            pricePerKg: 5000,
            image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 6,
            productName: "Beras Rojolele",
            category: "grains",
            farmerName: "Koperasi Subur Makmur",
            location: "Klaten",
            stock: 2500,
            pricePerKg: 14500,
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 7,
            productName: "Wortel",
            category: "root-crops",
            farmerName: "Bu Aminah",
            location: "Berastagi",
            stock: 450,
            pricePerKg: 8000,
            image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 8,
            productName: "Kubis",
            category: "vegetables",
            farmerName: "Pak Tono",
            location: "Wonosobo",
            stock: 600,
            pricePerKg: 4000,
            image: "https://images.unsplash.com/photo-1652860213441-6622f9fec77f?auto=format&fit=crop&w=400&q=80"
        }
    ],
    jobs: [
        {
            id: 1,
            title: "Logistics Driver",
            jobType: "logistics",
            location: "Surabaya",
            salaryRange: "Rp 3,000,000 - Rp 4,000,000",
            company: "AgriFlow Logistics",
            requiredSkills: ["Driving License", "Route Navigation", "Basic Logistics Knowledge"]
        },
        {
            id: 2,
            title: "Warehouse Staff",
            jobType: "warehouse",
            location: "Jakarta",
            salaryRange: "Rp 3,500,000 - Rp 4,500,000",
            company: "Tani Hub Center",
            requiredSkills: ["Inventory Management", "Physical Stamina", "Data Entry"]
        },
        {
            id: 3,
            title: "Food Distribution Coordinator",
            jobType: "distribution",
            location: "Bandung",
            salaryRange: "Rp 5,000,000 - Rp 7,000,000",
            company: "Fresh Delivery ID",
            requiredSkills: ["Supply Chain", "Communication", "Problem Solving", "Team Leadership"]
        },
        {
            id: 4,
            title: "Agriculture Field Assistant",
            jobType: "field",
            location: "Malang",
            salaryRange: "Rp 3,200,000 - Rp 4,200,000",
            company: "Bumi Agro Makmur",
            requiredSkills: ["Agriculture Knowledge", "Field Machinery", "Soil Sampling"]
        },
        {
            id: 5,
            title: "Supply Chain Administrator",
            jobType: "admin",
            location: "Jakarta",
            salaryRange: "Rp 4,500,000 - Rp 6,000,000",
            company: "Agro Network Nusantara",
            requiredSkills: ["Excel", "Order Processing", "Analysis"]
        },
        {
            id: 6,
            title: "Harvest Quality Control",
            jobType: "field",
            location: "Brebes",
            salaryRange: "Rp 4,000,000 - Rp 5,500,000",
            company: "Bawang Hebat Group",
            requiredSkills: ["Quality Standards", "Inspection", "Reporting"]
        },
        {
            id: 7,
            title: "Cold Storage Operator",
            jobType: "warehouse",
            location: "Makassar",
            salaryRange: "Rp 3,500,000 - Rp 4,800,000",
            company: "Sulawesi Fresh Tech",
            requiredSkills: ["Equipment Operation", "Temperature Control", "Safety Protocols"]
        },
        {
            id: 8,
            title: "Packaging Staff",
            jobType: "packaging",
            location: "Surabaya",
            salaryRange: "Rp 2,800,000 - Rp 3,500,000",
            company: "Sayur Cepat",
            requiredSkills: ["Attention to Detail", "Speed and Accuracy", "Sorting"]
        }
    ],
    locations: [
        {
            city: "Malang",
            type: "supply",
            commodity: "Cabai Merah",
            status: "Surplus Production",
            lat: -7.9797,
            lng: 112.6304
        },
        {
            city: "Brebes",
            type: "supply",
            commodity: "Bawang Merah",
            status: "Surplus Production",
            lat: -6.8705,
            lng: 109.0436
        },
        {
            city: "Bandung",
            type: "supply",
            commodity: "Sayuran",
            status: "Surplus Production",
            lat: -6.9175,
            lng: 107.6191
        },
        {
            city: "Jakarta",
            type: "demand",
            commodity: "Cabai Merah",
            status: "High Market Demand",
            lat: -6.2088,
            lng: 106.8456
        },
        {
            city: "Surabaya",
            type: "demand",
            commodity: "Sayuran",
            status: "High Market Demand",
            lat: -7.2504,
            lng: 112.7688
        },
        {
            city: "Makassar",
            type: "demand",
            commodity: "Beras",
            status: "High Market Demand",
            lat: -5.1477,
            lng: 119.4327
        }
    ]
};
