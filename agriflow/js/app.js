document.addEventListener('DOMContentLoaded', () => {
    console.log('AgriFlow app initialized.');

    // ───────────────────────────────────────────────
    // MOBILE NAV TOGGLE
    // ───────────────────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');
    if (navToggle && navLinksEl) {
        navToggle.addEventListener('click', () => {
            navLinksEl.classList.toggle('open');
        });
    }

    // ───────────────────────────────────────────────
    // SMOOTH PAGE-ENTER FADE
    // ───────────────────────────────────────────────
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.35s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // ───────────────────────────────────────────────
    // SCROLL REVEAL (for .reveal elements)
    // ───────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Chart colour palette to match design system
    const CHART_GREEN  = '#2d6a4f';
    const CHART_TEAL   = '#52b788';
    const CHART_BLUE   = '#2563eb';
    const CHART_ORANGE = '#e07a28';
    const CHART_PURPLE = '#7c3aed';
    const CHART_GRID   = 'rgba(0,0,0,0.06)';

    // ───────────────────────────────────────────────
    // UTILITY: Simulated async loading delay
    // ───────────────────────────────────────────────
    function simulateLoad(ms = 700) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ───────────────────────────────────────────────
    // UTILITY: Animate cards in with stagger
    // ───────────────────────────────────────────────
    function animateCards(grid) {
        const cards = grid.querySelectorAll('.card');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 60);
        });
    }

    // ───────────────────────────────────────────────
    // MARKETPLACE
    // ───────────────────────────────────────────────
    const productGrid    = document.getElementById('product-grid');
    const productSkeleton = document.getElementById('product-skeleton');
    const searchInput    = document.getElementById('search-input');
    const categoryFilters = document.getElementById('category-filters');

    const statFarmers  = document.getElementById('stat-farmers');
    const statProducts = document.getElementById('stat-products');
    const statStock    = document.getElementById('stat-stock');

    if (productGrid && searchInput) {
        initMarketplace();
    }

    async function initMarketplace() {
        const products = dummyData.products;
        updateStatistics(products);

        // Show skeleton, then render
        await simulateLoad(700);
        productSkeleton.style.display = 'none';
        productGrid.style.display = 'grid';
        renderProducts(products);
        animateCards(productGrid);

        // State for combined search + category filter
        let currentSearch   = '';
        let currentCategory = 'all';

        function applyFilters() {
            const filtered = products.filter(p => {
                const matchSearch   = p.productName.toLowerCase().includes(currentSearch);
                const matchCategory = currentCategory === 'all' || p.category === currentCategory;
                return matchSearch && matchCategory;
            });
            renderProducts(filtered);
            animateCards(productGrid);
        }

        // Live search
        searchInput.addEventListener('input', e => {
            currentSearch = e.target.value.toLowerCase().trim();
            applyFilters();
        });

        // Category pill filters
        if (categoryFilters) {
            categoryFilters.addEventListener('click', e => {
                const btn = e.target.closest('.filter-btn');
                if (!btn) return;

                // Toggle active class
                categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category;
                applyFilters();
            });
        }
    }

    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';

        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p class="empty-state">Produk tidak ditemukan. Coba kata kunci atau kategori lain.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card product-card';
            card.style.padding = '0';
            card.style.overflow = 'hidden';

            const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(product.pricePerKg);

            card.innerHTML = `
                <div class="product-img-wrap">
                    <img src="${product.image}" alt="${product.productName}" class="product-img">
                </div>
                <div style="padding: 1.25rem 1.5rem 1.5rem; display: flex; flex-direction: column; flex-grow: 1;">
                    <h3 class="card-title">${product.productName}</h3>
                    <p class="card-text" style="margin-bottom: 0.25rem;"><strong>Petani:</strong> ${product.farmerName}</p>
                    <p class="card-text" style="margin-bottom: 0.25rem;">📍 ${product.location}</p>
                    <p class="card-text" style="margin-bottom: 0;">Stok: ${product.stock} kg</p>
                    <p class="price-tag">${formattedPrice}<span class="price-unit"> / kg</span></p>
                    <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Lihat Detail</button>
                </div>
            `;

            productGrid.appendChild(card);
        });
    }

    function updateStatistics(allProducts) {
        const uniqueFarmers = new Set(allProducts.map(p => p.farmerName)).size;
        const totalProducts = allProducts.length;
        const totalStock    = allProducts.reduce((sum, p) => sum + p.stock, 0);

        if (statFarmers)  statFarmers.textContent  = uniqueFarmers;
        if (statProducts) statProducts.textContent = totalProducts;
        if (statStock)    statStock.textContent     = totalStock.toLocaleString('id-ID');
    }

    // ───────────────────────────────────────────────
    // MAP (Leaflet)
    // ───────────────────────────────────────────────
    const mapElement = document.getElementById('map');
    if (mapElement) {
        initMap();
    }

    function initMap() {
        const map = L.map('map').setView([-2.5, 118], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const markers = dummyData.locations;

        const supplyIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });

        const demandIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });

        const nodeCoordinates = {};

        markers.forEach(loc => {
            const isSupply = loc.type === 'supply';
            nodeCoordinates[loc.city.toLowerCase()] = [loc.lat, loc.lng];

            const popupContent = `
                <div style="font-family:'Inter',sans-serif; min-width:160px;">
                    <strong style="font-size:1.05rem;">${loc.city}</strong><br>
                    <span>Komoditas: ${loc.commodity}</span><br>
                    <span style="color:${isSupply ? '#2d6a4f' : '#c53030'}; font-weight:600;">
                        Status: ${loc.status}
                    </span>
                </div>`;

            L.marker([loc.lat, loc.lng], { icon: isSupply ? supplyIcon : demandIcon })
             .bindPopup(popupContent)
             .addTo(map);
        });

        [['malang', 'surabaya'], ['brebes', 'jakarta']].forEach(([a, b]) => {
            const start = nodeCoordinates[a];
            const end   = nodeCoordinates[b];
            if (start && end) {
                L.polyline([start, end], { color: '#64748b', weight: 2, dashArray: '5,10', opacity: 0.7 }).addTo(map);
            }
        });
    }

    // ───────────────────────────────────────────────
    // JOBS
    // ───────────────────────────────────────────────
    const jobGrid      = document.getElementById('job-grid');
    const jobSkeleton  = document.getElementById('job-skeleton');
    const locationFilter = document.getElementById('location-filter');
    const sectorFilter   = document.getElementById('sector-filter');

    const statJobs      = document.getElementById('stat-jobs');
    const statCompanies = document.getElementById('stat-companies');
    const statLocations = document.getElementById('stat-locations');

    if (jobGrid && locationFilter) {
        initJobs();
    }

    async function initJobs() {
        const jobsData = dummyData.jobs;
        updateJobStats(jobsData);

        await simulateLoad(700);
        jobSkeleton.style.display = 'none';
        jobGrid.style.display = 'grid';
        renderJobs(jobsData);
        animateCards(jobGrid);

        let currentLocation = 'all';
        let currentSector   = 'all';

        function applyJobFilters() {
            const filtered = jobsData.filter(job => {
                const matchLoc    = currentLocation === 'all' || job.location === currentLocation;
                const matchSector = currentSector   === 'all' || job.jobType   === currentSector;
                return matchLoc && matchSector;
            });
            renderJobs(filtered);
            animateCards(jobGrid);
        }

        locationFilter.addEventListener('change', e => {
            currentLocation = e.target.value;
            applyJobFilters();
        });

        if (sectorFilter) {
            sectorFilter.addEventListener('change', e => {
                currentSector = e.target.value;
                applyJobFilters();
            });
        }
    }

    function renderJobs(jobsToRender) {
        jobGrid.innerHTML = '';

        if (jobsToRender.length === 0) {
            jobGrid.innerHTML = '<p class="empty-state">Lowongan tidak ditemukan untuk filter yang dipilih.</p>';
            return;
        }

        jobsToRender.forEach(job => {
            const card = document.createElement('div');
            card.className = 'card';

            const skillsHtml = job.requiredSkills.map(s => `<span class="badge">${s}</span>`).join('');

            card.innerHTML = `
                <h3 class="card-title" style="margin-bottom: 0.3rem;">${job.title}</h3>
                <p style="color: var(--primary); font-weight: 600; margin-bottom: 1rem; font-size: 0.9rem;">${job.company}</p>
                <div style="margin-bottom: 1rem;">
                    <p class="card-text" style="margin-bottom: 0.3rem;">📍 ${job.location}</p>
                    <p class="card-text">💰 ${job.salaryRange}</p>
                </div>
                <div style="flex-grow: 1; margin-bottom: 1.25rem;">
                    <strong style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--text-heading);">Skill yang Dibutuhkan:</strong>
                    <div style="display:flex; flex-wrap:wrap; gap: 0.4rem;">${skillsHtml}</div>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: auto;">Lamar Sekarang</button>
            `;

            jobGrid.appendChild(card);
        });
    }

    function updateJobStats(jobsData) {
        const totalJobs       = jobsData.length;
        const uniqueCompanies = new Set(jobsData.map(j => j.company)).size;
        const uniqueLocations = new Set(jobsData.map(j => j.location)).size;

        if (statJobs)      statJobs.textContent      = totalJobs;
        if (statCompanies) statCompanies.textContent = uniqueCompanies;
        if (statLocations) statLocations.textContent = uniqueLocations;
    }

    // ───────────────────────────────────────────────
    // SKILL ADVISOR
    // ───────────────────────────────────────────────
    const targetJobSelect        = document.getElementById('target-job');
    const checkSkillsBtn         = document.getElementById('check-skills-btn');
    const skillResultsContainer  = document.getElementById('skill-results');

    if (targetJobSelect && checkSkillsBtn && skillResultsContainer) {
        initSkillAdvisor();
    }

    function initSkillAdvisor() {
        const jobsData = dummyData.jobs;

        jobsData.forEach(job => {
            const option = document.createElement('option');
            option.value = job.id;
            option.textContent = `${job.title} — ${job.company}`;
            targetJobSelect.appendChild(option);
        });

        checkSkillsBtn.addEventListener('click', () => {
            const selectedJobId = parseInt(targetJobSelect.value, 10);
            if (isNaN(selectedJobId)) {
                skillResultsContainer.style.display = 'none';
                return;
            }
            const selectedJob = jobsData.find(job => job.id === selectedJobId);
            if (selectedJob) renderSkillResults(selectedJob);
        });
    }

    function renderSkillResults(job) {
        skillResultsContainer.style.display = 'flex';
        skillResultsContainer.innerHTML = '';

        // Required Skills card
        const skillsCard = document.createElement('div');
        skillsCard.className = 'card';
        const skillsHtml = job.requiredSkills.map(s =>
            `<span class="badge" style="font-size:0.95rem; padding:0.45rem 1rem;">${s}</span>`
        ).join('');
        skillsCard.innerHTML = `
            <h3 style="color:var(--primary-dark); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                🎯 Skill yang Diperlukan
            </h3>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">${skillsHtml}</div>`;

        // Kartu Rekomendasi Pelatihan
        const trainingCard = document.createElement('div');
        trainingCard.className = 'card';
        const trainingsHtml = job.requiredSkills.map(s => `
            <div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 1rem;">
                <div style="font-weight:600; color:var(--text-heading); margin-bottom:0.2rem;">${s}</div>
                <div style="color:var(--text-muted); font-size:0.9rem;">
                    💡 <span style="font-weight:500; color:var(--primary-dark);">Pelatihan Dasar: ${s}</span>
                </div>
            </div>`).join('');
        trainingCard.innerHTML = `
            <h3 style="color:var(--secondary); margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
                📚 Rekomendasi Pelatihan
            </h3>
            ${trainingsHtml}`;

        skillResultsContainer.appendChild(skillsCard);
        skillResultsContainer.appendChild(trainingCard);

        // Animate in
        [skillsCard, trainingCard].forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 100);
        });
    }

    // ───────────────────────────────────────────────
    // DASHBOARD
    // ───────────────────────────────────────────────
    const dashFarmers  = document.getElementById('dash-farmers');
    const dashProducts = document.getElementById('dash-products');
    const dashJobs     = document.getElementById('dash-jobs');
    const dashCities   = document.getElementById('dash-cities');

    if (dashFarmers) {
        initDashboard();
    }

    // Animated count-up helper
    function countUp(el, target, duration = 900) {
        const start     = 0;
        const startTime = performance.now();
        function tick(now) {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(start + (target - start) * eased);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function initDashboard() {
        const products  = dummyData.products;
        const jobs      = dummyData.jobs;
        const locations = dummyData.locations;

        const uniqueFarmers = new Set(products.map(p => p.farmerName)).size;
        const cities = new Set([
            ...locations.map(l => l.city),
            ...products.map(p => p.location),
            ...jobs.map(j => j.location)
        ]);

        // Animated KPI counters
        if (dashFarmers)  countUp(dashFarmers,  uniqueFarmers);
        if (dashProducts) countUp(dashProducts, products.length);
        if (dashJobs)     countUp(dashJobs,     jobs.length);
        if (dashCities)   countUp(dashCities,   cities.size);

        // ── CHART 1: Production by Commodity (multi-colour bars) ──
        const prodLabels = ['Cabai Merah', 'Bawang Merah', 'Tomat', 'Kentang', 'Jagung', 'Beras'];
        const prodData   = [520, 430, 310, 870, 640, 1240];
        const prodColors = [CHART_ORANGE, CHART_PURPLE, CHART_TEAL, CHART_BLUE, CHART_GREEN, '#0891b2'];

        const ctxProd = document.getElementById('productionChart');
        if (ctxProd) {
            new Chart(ctxProd, {
                type: 'bar',
                data: {
                    labels: prodLabels,
                    datasets: [{
                        label: 'Ton',
                        data: prodData,
                        backgroundColor: prodColors,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 900, easing: 'easeOutQuart' },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: CHART_GRID },
                            ticks: {
                                callback: v => v + ' ton',
                                font: { size: 11 }
                            }
                        },
                        x: { grid: { display: false }, ticks: { font: { size: 11 } } }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => ` ${ctx.parsed.y} ton`
                            }
                        }
                    }
                }
            });
        }

        // ── CHART 2: Job Distribution Donut ──
        const ctxJobs = document.getElementById('jobsChart');
        if (ctxJobs) {
            new Chart(ctxJobs, {
                type: 'doughnut',
                data: {
                    labels: ['Logistik', 'Gudang', 'Distribusi', 'Lapangan', 'Pengemasan', 'Administrasi'],
                    datasets: [{
                        data: [28, 20, 15, 18, 10, 9],
                        backgroundColor: [CHART_GREEN, CHART_ORANGE, CHART_BLUE, CHART_TEAL, CHART_PURPLE, '#0891b2'],
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 900, easing: 'easeOutQuart' },
                    cutout: '62%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { padding: 14, font: { size: 11 }, usePointStyle: true, pointStyleWidth: 8 }
                        },
                        tooltip: {
                            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` }
                        }
                    }
                }
            });
        }

        // ── CHART 3: Regional Supply Index (horizontal bar) ──
        const regionLabels = ['Malang', 'Brebes', 'Bandung', 'Surabaya', 'Makassar', 'Grobogan', 'Klaten'];
        const regionData   = [88, 76, 92, 48, 63, 71, 80];
        const regionColors = regionData.map(v =>
            v >= 80 ? CHART_GREEN : v >= 60 ? CHART_TEAL : CHART_ORANGE
        );

        const ctxRegion = document.getElementById('regionChart');
        if (ctxRegion) {
            new Chart(ctxRegion, {
                type: 'bar',
                data: {
                    labels: regionLabels,
                    datasets: [{
                        label: 'Indeks Pasokan',
                        data: regionData,
                        backgroundColor: regionColors,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 1000, easing: 'easeOutQuart' },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: CHART_GRID },
                            ticks: {
                                callback: v => v + '%',
                                font: { size: 11 }
                            }
                        },
                        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: { label: ctx => ` Skor: ${ctx.parsed.x} / 100` }
                        }
                    }
                }
            });
        }

        // ── INSIGHTS ──
        const insightList = document.getElementById('insight-list');
        if (insightList) {
            const maxProdIdx  = prodData.indexOf(Math.max(...prodData));
            const maxRegionIdx = regionData.indexOf(Math.max(...regionData));
            const insights = [
                `🌶️ <strong>${prodLabels[maxProdIdx]}</strong> adalah komoditas dengan produksi tertinggi musim ini sebesar <strong>${prodData[maxProdIdx]} ton</strong>.`,
                `📍 <strong>${regionLabels[maxRegionIdx]}</strong> memiliki indeks pasokan regional tertinggi sebesar <strong>${regionData[maxRegionIdx]}/100</strong>, menunjukkan kinerja pertanian yang kuat.`,
                `💼 Sektor <strong>Logistik</strong> merupakan sektor kerja terbesar dalam rantai pasokan pangan dengan <strong>28%</strong> dari total lowongan.`,
                `🔴 <strong>Surabaya</strong> mencatat skor indeks pasokan di bawah rata-rata, mengindikasikan potensi hambatan distribusi yang dapat diatasi oleh AgriFlow.`,
                `📈 Data lowongan menunjukkan <strong>${jobs.length} lowongan aktif</strong> di <strong>${new Set(jobs.map(j => j.location)).size} kota</strong>, terkonsentrasi di Jawa dan Sulawesi.`
            ];
            insightList.innerHTML = insights.map(text =>
                `<li class="insight-item">${text}</li>`
            ).join('');
        }
    }
});

