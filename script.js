/**
 * ===================================================================
 * PORTFOLIO JAVASCRIPT: LUXURY PROFESSIONAL PERSONAL BRANDING
 * Vanilla JavaScript (ES6+) — Zero Bloat, 60fps Native Interactions
 * Aflah Athallah Tamam Kapukong (S1 Teknik Informatika - UPB)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------
    // 01. PREFERS-REDUCED-MOTION DETECTION
    // --------------------------------------------------
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --------------------------------------------------
    // 02. DYNAMIC YEAR
    // --------------------------------------------------
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // --------------------------------------------------
    // 03. AMBIENT GEOMETRIC CANVAS (INTERACTIVE DEPTH)
    // --------------------------------------------------
    const canvas = document.getElementById("ambient-canvas");
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext("2d");
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null, radius: 140 };

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }

        class GeometricNode {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.42;
                this.vy = (Math.random() - 0.5) * 0.42;
                this.size = Math.random() * 1.5 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Boundary reflection
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Subtle mouse repulsion
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= (dx / distance) * force * 1.8;
                        this.y -= (dy / distance) * force * 1.8;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(197, 204, 214, 0.45)";
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.floor((width * height) / 22000);
            const nodeCount = Math.min(Math.max(count, 22), 48);

            for (let i = 0; i < nodeCount; i++) {
                particles.push(new GeometricNode());
            }
        }

        function renderCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 130) {
                        const alpha = (1 - dist / 130) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(197, 204, 214, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(renderCanvas);
        }

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener("mouseout", () => {
            mouse.x = null;
            mouse.y = null;
        });

        resizeCanvas();
        requestAnimationFrame(renderCanvas);
    }

    // --------------------------------------------------
    // 04. SCROLL PROGRESS BAR & UNIFIED SCROLL CONTROLLER
    // --------------------------------------------------
    const scrollProgressBar = document.getElementById("scroll-progress-bar");
    const backToTopBtn = document.getElementById("back-to-top");
    const header = document.getElementById("header");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    function onScrollHandler() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // 1. Scroll Progress Bar
        if (scrollProgressBar) {
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
        }

        // 2. Sticky Header Scrolled State
        if (header) {
            if (scrollTop > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // 3. Floating Back to Top Button Visibility
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add("is-visible");
            } else {
                backToTopBtn.classList.remove("is-visible");
            }
        }

        // 4. Active Section Nav Link Spy
        let currentSectionId = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (currentSectionId && link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", onScrollHandler, { passive: true });
    onScrollHandler();

    // --------------------------------------------------
    // 05. BACK TO TOP BUTTON ACTION
    // --------------------------------------------------
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
            });
        });
    }

    // --------------------------------------------------
    // 06. MOBILE NAVIGATION DRAWER
    // --------------------------------------------------
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        // Close menu on link click
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Close on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navMenu.classList.contains("open")) {
                navMenu.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.focus();
            }
        });
    }

    // --------------------------------------------------
    // 07. SCROLL REVEAL (INTERSECTION OBSERVER)
    // --------------------------------------------------
    const revealItems = document.querySelectorAll(".reveal-item");

    if (prefersReducedMotion) {
        revealItems.forEach((el) => el.classList.add("is-revealed"));
    } else if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -25px 0px",
            }
        );

        revealItems.forEach((item, index) => {
            const parent = item.parentElement;
            if (
                parent &&
                (parent.classList.contains("pillars-grid") ||
                    parent.classList.contains("skills-catalog-grid") ||
                    parent.classList.contains("skills-catalog") ||
                    parent.classList.contains("prof-grid") ||
                    parent.classList.contains("projects-showcase-grid"))
            ) {
                item.style.transitionDelay = `${(index % 3) * 0.08}s`;
            }
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach((el) => el.classList.add("is-revealed"));
    }

    // --------------------------------------------------
    // 08. INTERACTIVE SKILLS EXPLORER FILTERING
    // --------------------------------------------------
    const skillFilterButtons = document.querySelectorAll(".skill-filter-btn");
    const skillCards = document.querySelectorAll(".interactive-skill-card");

    skillFilterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            skillFilterButtons.forEach((btn) => {
                btn.classList.remove("active");
                btn.setAttribute("aria-selected", "false");
            });
            this.classList.add("active");
            this.setAttribute("aria-selected", "true");

            const filterValue = this.getAttribute("data-skill-filter");

            skillCards.forEach((card) => {
                const category = card.getAttribute("data-skill-cat");
                const shouldShow = filterValue === "all" || category === filterValue;

                if (shouldShow) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 20);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(14px)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 220);
                }
            });
        });
    });

    // --------------------------------------------------
    // 09. PROJECT SHOWCASE FILTERING
    // --------------------------------------------------
    const projectFilterButtons = document.querySelectorAll(".project-filter-tabs .filter-btn");
    const projectCards = document.querySelectorAll(".project-showcase-card");

    projectFilterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            projectFilterButtons.forEach((btn) => {
                btn.classList.remove("active");
                btn.setAttribute("aria-selected", "false");
            });
            this.classList.add("active");
            this.setAttribute("aria-selected", "true");

            const filterValue = this.getAttribute("data-filter");

            projectCards.forEach((card) => {
                const category = card.getAttribute("data-category");
                const shouldShow = filterValue === "all" || category === filterValue;

                if (shouldShow) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 20);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(14px)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 220);
                }
            });
        });
    });

    // --------------------------------------------------
    // 10. PROJECT DETAIL MODAL DICTIONARY & CONTROLLER
    // --------------------------------------------------
    const projectDetailsData = {
        kalkulator: {
            category: "PROGRAMMING & CLI",
            badge: "Terverifikasi di Workspace (kalkulator.py)",
            title: "Kalkulator Interaktif Terminal Python",
            bodyHtml: `
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Latar Belakang & Tujuan Pembelajaran</h4>
                    <p>Membangun program kalkulator interaktif command line interface (CLI) dengan Python 3 untuk melatih penguasaan modularitas fungsi, alur perulangan interaktif (while loop), dan penanganan eksepsi matematis.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Arsitektur & Error Handling</h4>
                    <p>Program mengimplementasikan fungsi modular terpisah untuk operasi penjumlahan, pengurangan, perkalian, dan pembagian. Menangani secara eksplisit kesalahan input teks <code>ValueError</code> dan mencegah crash saat pembagian dengan angka nol melalui penanganan <code>ZeroDivisionError</code>.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Hasil & Verifikasi</h4>
                    <p>Telah diuji langsung melalui terminal dengan pengujian input angka valid, input karakter tidak valid, dan angka pembagi nol. Kode tersimpan aman di workspace proyek.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Teknologi & Konsep</h4>
                    <div class="modal-tech-list">
                        <span class="modal-tech-pill">Python 3</span>
                        <span class="modal-tech-pill">Exception Handling (try-except)</span>
                        <span class="modal-tech-pill">Modular Functions</span>
                        <span class="modal-tech-pill">CLI Interaction</span>
                        <span class="modal-tech-pill">Unit Debugging</span>
                    </div>
                </div>
            `,
        },
        portofolio: {
            category: "WEB DEVELOPMENT",
            badge: "Latihan Terverifikasi (website-portofolio)",
            title: "Website Portofolio Responsif & Desain Midnight Silver",
            bodyHtml: `
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Latar Belakang & Filosofi Desain</h4>
                    <p>Membangun platform personal branding modern dengan estetika Midnight Blue & Silver yang merefleksikan identitas mahasiswa Teknik Informatika Universitas Pelita Bangsa secara faktual dan profesional.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Fitur Frontend & Interaktivitas</h4>
                    <p>Mengimplementasikan navigasi sticky responsif, ambient background canvas berbasis partikel geometris, tab filter interaktif untuk kategori keterampilan dan proyek, modal dialog aksesibel, dan integrasi tautan dokumen CV & Resume dengan path relatif.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Optimasi Performa & Aksesibilitas</h4>
                    <p>Dibangun murni dengan Vanilla HTML5, CSS3, dan Vanilla ES6+ tanpa framework eksternal demi menjamin performa render tinggi, dukungan keyboard accessibility, dan kepatuhan preferensi <code>prefers-reduced-motion</code>.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Teknologi & Konsep</h4>
                    <div class="modal-tech-list">
                        <span class="modal-tech-pill">HTML5 Semantik</span>
                        <span class="modal-tech-pill">CSS3 Grid & Flexbox</span>
                        <span class="modal-tech-pill">Vanilla JavaScript (ES6+)</span>
                        <span class="modal-tech-pill">HTML5 Canvas API</span>
                        <span class="modal-tech-pill">Responsive Design</span>
                    </div>
                </div>
            `,
        },
        crud: {
            category: "WEB DEVELOPMENT",
            badge: "Latihan Pemrograman Web (Akademik)",
            title: "Aplikasi Web CRUD Berbasis PHP & MySQL",
            bodyHtml: `
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Tujuan Penugasan Akademik</h4>
                    <p>Latihan pembuatan sistem pencatatan data dinamis untuk menguasai siklus lengkap CRUD (Create, Read, Update, Delete) pada lingkungan server lokal Apache dan database MySQL.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Fitur & Validasi Data</h4>
                    <p>Pengguna dapat menginput data baru, menampilkan daftar tabel secara terstruktur, memperbarui isi kolom, dan menghapus catatan dengan dialog konfirmasi. Dilengkapi dengan validasi data masukan form untuk mencegah entri kosong.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Koneksi Database</h4>
                    <p>Menerapkan koneksi database terpusat yang aman serta pemisahan logika pemrosesan data dengan antarmuka tampilan tabel.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Teknologi & Konsep</h4>
                    <div class="modal-tech-list">
                        <span class="modal-tech-pill">PHP</span>
                        <span class="modal-tech-pill">MySQL</span>
                        <span class="modal-tech-pill">Apache Web Server</span>
                        <span class="modal-tech-pill">HTML Forms</span>
                        <span class="modal-tech-pill">CSS Styling</span>
                    </div>
                </div>
            `,
        },
        database: {
            category: "DATABASE",
            badge: "Tugas Praktikum Basis Data (Akademik)",
            title: "Desain & Query Relasional Basis Data Toko / Akademik",
            bodyHtml: `
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Perancangan Skema Data (ERD)</h4>
                    <p>Menyusun skema relasional tabel dengan mendefinisikan Primary Key, Foreign Key, serta aturan kardinalitas relasi antar entitas untuk menghindari redundansi data.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Eksekusi DDL & DML</h4>
                    <p>Mempraktikkan pembuatan skema struktur tabel menggunakan query SQL DDL (CREATE, ALTER, DROP) serta manipulasi data DML (INSERT, SELECT, UPDATE, DELETE).</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Optimasi Query & Agregasi</h4>
                    <p>Menggunakan operasi relasional kompleks seperti <code>INNER JOIN</code>, <code>LEFT JOIN</code>, pengelompokan <code>GROUP BY</code>, penyaringan <code>HAVING</code>, dan fungsi kalkulasi agregat (<code>SUM</code>, <code>COUNT</code>, <code>AVG</code>).</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Teknologi & Konsep</h4>
                    <div class="modal-tech-list">
                        <span class="modal-tech-pill">Structured Query Language (SQL)</span>
                        <span class="modal-tech-pill">MySQL DBMS</span>
                        <span class="modal-tech-pill">Relational Schema</span>
                        <span class="modal-tech-pill">phpMyAdmin</span>
                    </div>
                </div>
            `,
        },
        excel: {
            category: "DATA & OFFICE",
            badge: "Latihan Pengolahan Data & Formula",
            title: "Automasi Lembar Kerja & Pengolahan Data Excel",
            bodyHtml: `
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Tujuan & Penerapan Administrasi</h4>
                    <p>Membangun format lembar kerja komprehensif untuk pengolahan data inventaris, pencatatan transaksi, dan rekapitulasi data akademik dengan akurasi tinggi.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Formula & Logika Komputasi</h4>
                    <p>Mengintegrasikan formula logika <code>IF</code> bertingkat, pencarian data antar tabel dengan <code>VLOOKUP</code> / <code>HLOOKUP</code>, perhitungan bersyarat (<code>SUMIF</code>, <code>COUNTIF</code>), serta manipulasi teks dan format tanggal.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Visualisasi & Ringkasan Laporan</h4>
                    <p>Membuat ringkasan dinamis menggunakan Pivot Table dan grafik visual untuk mempermudah pemahaman data dan mendukung proses pengambilan keputusan.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Teknologi & Konsep</h4>
                    <div class="modal-tech-list">
                        <span class="modal-tech-pill">Microsoft Excel</span>
                        <span class="modal-tech-pill">Formula IF & VLOOKUP</span>
                        <span class="modal-tech-pill">Pivot Tables</span>
                        <span class="modal-tech-pill">Data Formatting</span>
                        <span class="modal-tech-pill">Spreadsheet Automation</span>
                    </div>
                </div>
            `,
        },
        kolaborasi: {
            category: "DATA & DOKUMENTASI",
            badge: "Pengalaman Kolaborasi Akademik UPB",
            title: "Dokumentasi Proyek, Laporan Akademik & Presentasi Tim",
            bodyHtml: `
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Latar Belakang Kegiatan</h4>
                    <p>Kolaborasi dalam tim tugas perkuliahan Program Studi Teknik Informatika Universitas Pelita Bangsa untuk menyusun laporan akademik teknis dan menyajikan materi di hadapan audiens.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Standarisasi Format Dokumen</h4>
                    <p>Mengatur tata letak dokumen Word standar formal meliputi penomoran halaman dinamis, daftar isi otomatis, konsistensi gaya heading, format tabel rapi, dan bibliografi rujukan.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Penyusunan Materi Presentasi & Komunikasi</h4>
                    <p>Merancang slide presentasi PowerPoint dengan visual ringkas yang komunikatif serta berpartisipasi aktif dalam sesi tanya-jawab tim saat presentasi akademik.</p>
                </div>
                <div class="modal-section-block">
                    <h4 class="modal-section-heading">Teknologi & Soft Skills</h4>
                    <div class="modal-tech-list">
                        <span class="modal-tech-pill">Microsoft Word</span>
                        <span class="modal-tech-pill">Microsoft PowerPoint</span>
                        <span class="modal-tech-pill">Dokumentasi Teknis</span>
                        <span class="modal-tech-pill">Kerja Sama Tim</span>
                        <span class="modal-tech-pill">Public Speaking</span>
                    </div>
                </div>
            `,
        },
    };

    const projectModal = document.getElementById("project-modal");
    const modalBackdrop = document.getElementById("modal-backdrop");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalActionBtn = document.getElementById("modal-action-btn");
    const modalCategoryTag = document.getElementById("modal-category-tag");
    const modalStatusBadge = document.getElementById("modal-status-badge");
    const modalProjectTitle = document.getElementById("modal-project-title");
    const modalBodyContent = document.getElementById("modal-body-content");
    const modalOpenButtons = document.querySelectorAll(".btn-open-modal");

    let lastFocusedElement = null;

    function openModal(projectId) {
        const data = projectDetailsData[projectId];
        if (!data || !projectModal) return;

        lastFocusedElement = document.activeElement;

        if (modalCategoryTag) modalCategoryTag.textContent = data.category;
        if (modalStatusBadge) modalStatusBadge.textContent = data.badge;
        if (modalProjectTitle) modalProjectTitle.textContent = data.title;
        if (modalBodyContent) modalBodyContent.innerHTML = data.bodyHtml;

        projectModal.classList.add("is-active");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        if (modalCloseBtn) {
            modalCloseBtn.focus();
        }
    }

    function closeModal() {
        if (!projectModal) return;

        projectModal.classList.remove("is-active");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    modalOpenButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-modal-target");
            openModal(targetId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalActionBtn) modalActionBtn.addEventListener("click", closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectModal && projectModal.classList.contains("is-active")) {
            closeModal();
        }
    });

    // --------------------------------------------------
    // 11. INTERACTIVE EMAIL COPY BUTTON
    // --------------------------------------------------
    const copyEmailBtn = document.getElementById("btn-copy-email");
    const copyTooltip = document.getElementById("copy-tooltip");
    const officialEmail = "aflahtamamke2@gmail.com";

    if (copyEmailBtn && copyTooltip) {
        copyEmailBtn.addEventListener("click", async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(officialEmail);
                } else {
                    // Fallback for older browsers
                    const tempInput = document.createElement("input");
                    tempInput.value = officialEmail;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand("copy");
                    document.body.removeChild(tempInput);
                }

                copyEmailBtn.classList.add("copied");
                copyTooltip.textContent = "Berhasil Disalin!";

                setTimeout(() => {
                    copyEmailBtn.classList.remove("copied");
                    copyTooltip.textContent = "Salin Email";
                }, 2500);
            } catch (err) {
                console.error("Gagal menyalin email:", err);
                copyTooltip.textContent = "Gagal menyalin";
                setTimeout(() => {
                    copyTooltip.textContent = "Salin Email";
                }, 2000);
            }
        });
    }

    // --------------------------------------------------
    // 12. CLIENT-SIDE CONTACT FORM SIMULATION
    // --------------------------------------------------
    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const formStatus = document.getElementById("form-status");

    if (contactForm && submitBtn && formStatus) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const message = document.getElementById("contact-message").value.trim();

            if (!name || !email || !message) {
                showStatus("Harap lengkapi seluruh bidang formulir sebelum mengirim.", "error");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showStatus("Silakan masukkan format alamat email yang valid (contoh: nama@email.com).", "error");
                return;
            }

            // Asynchronous validation & direct mailto bridge
            submitBtn.classList.add("loading");
            submitBtn.disabled = true;
            formStatus.className = "form-status-box";
            formStatus.textContent = "";

            setTimeout(() => {
                submitBtn.classList.remove("loading");
                submitBtn.disabled = false;

                const mailtoSubject = encodeURIComponent(`[Portofolio Mahasiswa IT] Pesan dari ${name}`);
                const mailtoBody = encodeURIComponent(
                    `Halo Aflah,\n\nNama / Instansi: ${name}\nEmail Pengirim: ${email}\n\nPesan:\n${message}\n\n---\nDikirim melalui formulir kontak website portofolio`
                );
                const mailtoUrl = `mailto:${officialEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

                // Trigger email client directly
                window.location.href = mailtoUrl;

                contactForm.reset();

                formStatus.className = "form-status-box success";
                formStatus.innerHTML = `
                    <strong>Aplikasi email dibuka!</strong> Pesan Anda telah disiapkan untuk dikirim langsung ke <code>${officialEmail}</code>.<br>
                    <span style="font-size: 0.8rem; display: block; margin-top: 6px;">
                        Jika email client tidak terbuka otomatis, silakan <a href="${mailtoUrl}" style="color: #FFFFFF; text-decoration: underline; font-weight: 600;">klik di sini untuk membuka email</a> atau gunakan tombol salin email di atas.
                    </span>
                `;

                setTimeout(() => {
                    formStatus.className = "form-status-box";
                    formStatus.innerHTML = "";
                }, 12000);
            }, 600);
        });

        function showStatus(text, type) {
            formStatus.className = `form-status-box ${type}`;
            formStatus.textContent = text;
        }
    }
});
