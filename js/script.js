/**
 * Script.js — логика отображения портфолио
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== ТЁМНАЯ ТЕМА =====
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Восстановление сохранённой темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ===== СКРОЛЛ-ПРОГРЕСС-БАР =====
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    });

    function renderData() {
        const d = siteData;

        if (d.personal.photo) {
            const frame = document.getElementById('photoFrame');
            if (frame) {
                const img = document.createElement('img');
                img.src = d.personal.photo;
                img.alt = d.personal.name;
                frame.innerHTML = '';
                frame.appendChild(img);
            }
        }

        const timelineEl = document.getElementById('timeline');
        if (timelineEl && d.timeline) {
            timelineEl.innerHTML = '';
            d.timeline.forEach(function(item) {
                const div = document.createElement('div');
                div.className = 'timeline-item';
                div.innerHTML = `
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">${item.date}</div>
                    <div class="timeline-title">${item.title}</div>
                    <div class="timeline-company">${item.company}</div>
                    <div class="timeline-desc">${item.description}</div>
                `;
                timelineEl.appendChild(div);
            });
        }

        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid && d.projects) {
            projectsGrid.innerHTML = '';
            d.projects.forEach(function(project) {
                let resultsHtml = '';
                project.results.forEach(function(r) {
                    if (r.value && r.label) {
                        resultsHtml += `
                            <div class="project-result-item">
                                <span class="project-result-value">${r.value}</span>
                                <span class="project-result-label">${r.label}</span>
                            </div>
                        `;
                    }
                });

                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <div class="project-header">
                        <span class="project-company">${project.company}</span>
                        <div class="project-icon"><i class="fas ${project.icon}"></i></div>
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    <div class="project-results">${resultsHtml}</div>
                `;
                projectsGrid.appendChild(card);
            });
        }

        function renderSkills(containerId, skillsArray) {
            const container = document.getElementById(containerId);
            if (!container || !skillsArray) return;
            container.innerHTML = '';
            skillsArray.forEach(function(skill) {
                const span = document.createElement('span');
                span.className = 'skill-tag';
                span.textContent = skill;
                container.appendChild(span);
            });
        }

        if (d.skills) {
            renderSkills('skillsLean', d.skills.lean);
            renderSkills('skillsSoftware', d.skills.software);
            renderSkills('skillsPersonal', d.skills.personal);
        }

        const c = d.contact;
        const emailEl = document.getElementById('contactEmail');
        const phoneEl = document.getElementById('contactPhone');
        const telegramEl = document.getElementById('contactTelegram');

        if (emailEl) {
            emailEl.textContent = c.email;
            emailEl.href = 'mailto:' + c.email;
        }
        if (phoneEl) {
            phoneEl.textContent = c.phone;
            phoneEl.href = 'tel:' + c.phone.replace(/[^0-9+]/g, '');
        }
        if (telegramEl) {
            const tgUsername = c.telegram.startsWith('@') ? c.telegram.slice(1) : c.telegram;
            telegramEl.textContent = '@' + tgUsername;
            telegramEl.href = 'https://t.me/' + tgUsername;
        }

        const yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    const burger = document.getElementById('burger');
    const navList = document.getElementById('navList');
    if (burger && navList) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('active');
            navList.classList.toggle('open');
        });
        navList.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                burger.classList.remove('active');
                navList.classList.remove('open');
            });
        });
    }

    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (!header) return;
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const animateElements = document.querySelectorAll(
        '.about-card, .project-card, .timeline-item, .skill-tag, .contact-item'
    );
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    animateElements.forEach(function(el) {
        observer.observe(el);
    });

    // ===== СОХРАНЕНИЕ В PDF =====
    function generatePDF() {
        var pdfBtn = document.getElementById('downloadPdfBtn');
        // Используем window.print() — браузер сам откроет диалог «Сохранить как PDF»
        window.print();
        if (pdfBtn) { pdfBtn.textContent = 'Скачать портфолио (PDF)'; pdfBtn.style.opacity = '1'; pdfBtn.style.pointerEvents = 'auto'; }
    }

    var pdfBtn = document.getElementById('downloadPdfBtn');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function(e) {
            e.preventDefault();
            pdfBtn.textContent = 'Генерация...';
            pdfBtn.style.opacity = '0.6';
            pdfBtn.style.pointerEvents = 'none';
            generatePDF();
        });
    }

    renderData();
});