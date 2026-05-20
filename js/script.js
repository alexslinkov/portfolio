/**
 * Script.js — основная логика портфолио
 * Логика проектов вынесена в js/projects.js
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== ТЁМНАЯ ТЕМА =====
    var themeToggle = document.getElementById('themeToggle');
    var html = document.documentElement;

    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var currentTheme = html.getAttribute('data-theme');
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
    var progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    });

    // ===== РЕНДЕРИНГ ДАННЫХ =====
    function renderData() {
        var d = siteData;

        // Фото профиля
        if (d.personal.photo) {
            var frame = document.getElementById('photoFrame');
            if (frame) {
                var img = document.createElement('img');
                img.src = d.personal.photo;
                img.alt = d.personal.name;
                frame.innerHTML = '';
                frame.appendChild(img);
            }
        }

        // Таймлайн
        var timelineEl = document.getElementById('timeline');
        if (timelineEl && d.timeline) {
            timelineEl.innerHTML = '';
            d.timeline.forEach(function(item) {
                var div = document.createElement('div');
                div.className = 'timeline-item';
                div.innerHTML =
                    '<div class="timeline-dot"></div>' +
                    '<div class="timeline-date">' + item.date + '</div>' +
                    '<div class="timeline-title">' + item.title + '</div>' +
                    '<div class="timeline-company">' + item.company + '</div>' +
                    '<div class="timeline-desc">' + item.description + '</div>';
                timelineEl.appendChild(div);
            });
        }

        // Навыки
        function renderSkills(containerId, skillsArray) {
            var container = document.getElementById(containerId);
            if (!container || !skillsArray) return;
            container.innerHTML = '';
            skillsArray.forEach(function(skill) {
                var span = document.createElement('span');
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

        // Контакты
        var c = d.contact;
        var emailEl = document.getElementById('contactEmail');
        var phoneEl = document.getElementById('contactPhone');
        var telegramEl = document.getElementById('contactTelegram');

        if (emailEl) {
            emailEl.textContent = c.email;
            emailEl.href = 'mailto:' + c.email;
        }
        if (phoneEl) {
            phoneEl.textContent = c.phone;
            phoneEl.href = 'tel:' + c.phone.replace(/[^0-9+]/g, '');
        }
        if (telegramEl) {
            var tgUsername = c.telegram.startsWith('@') ? c.telegram.slice(1) : c.telegram;
            telegramEl.textContent = '@' + tgUsername;
            telegramEl.href = 'https://t.me/' + tgUsername;
        }

        // Год в футере
        var yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    // ===== БУРГЕР-МЕНЮ =====
    var burger = document.getElementById('burger');
    var navList = document.getElementById('navList');
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

    // ===== СКРОЛЛ ДЛЯ ХЕДЕРА =====
    var header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (!header) return;
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ===== АНИМАЦИЯ ПРИ СКРОЛЛЕ =====
    var animateElements = document.querySelectorAll(
        '.about-card, .project-card, .timeline-item, .skill-tag, .contact-item'
    );
    var observer = new IntersectionObserver(function(entries) {
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
        window.print();
        if (pdfBtn) {
            pdfBtn.textContent = 'Скачать портфолио (PDF)';
            pdfBtn.style.opacity = '1';
            pdfBtn.style.pointerEvents = 'auto';
        }
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

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    renderData();
});