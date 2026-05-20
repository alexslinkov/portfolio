/**
 * Projects.js — логика отображения проектов (табы, карусель, карточки)
 */

(function() {
    'use strict';

    // ===== ПЕРЕМЕННЫЕ ДЛЯ ПРОЕКТОВ =====
    var currentTab = 'lean';
    var carouselIndex = 0;
    var carouselTrack = null;
    var carouselViewport = null;

    // ===== ИНИЦИАЛИЗАЦИЯ ПРОЕКТОВ =====
    function initProjects() {
        carouselTrack = document.getElementById('projectsTrack');
        carouselViewport = document.querySelector('.projects-carousel-viewport');

        if (!carouselTrack || !siteData.projects) return;

        renderProjects(currentTab);
        initTabs();
        initCarousel();
    }

    // ===== РЕНДЕРИНГ ПРОЕКТОВ ПО КАТЕГОРИЯМ =====
    function renderProjects(category) {
        if (!carouselTrack || !siteData.projects[category]) return;

        var projects = siteData.projects[category];
        carouselTrack.innerHTML = '';
        carouselIndex = 0;

        projects.forEach(function(project) {
            var card = createProjectCard(project);
            carouselTrack.appendChild(card);
        });

        updateCarousel();
    }

    // ===== СОЗДАНИЕ КАРТОЧКИ ПРОЕКТА =====
    function createProjectCard(project) {
        // Результаты
        var resultsHtml = '';
        if (project.results) {
            project.results.forEach(function(r) {
                if (r.value && r.label) {
                    resultsHtml +=
                        '<div class="project-result-item">' +
                            '<span class="project-result-value">' + r.value + '</span>' +
                            '<span class="project-result-label">' + r.label + '</span>' +
                        '</div>';
                }
            });
        }

        // Кнопка кейса
        var caseBtn = '';
        if (project.caseFile) {
            caseBtn = '<a href="' + project.caseFile + '" class="project-case-btn project-case-btn--file" title="Открыть описание проекта">' +
                '<i class="fas fa-file-alt"></i> Описание проекта' +
            '</a>';
        }

        // Изображения проекта
        var imagesHtml = '';
        if (project.caseImages && project.caseImages.length > 0) {
            imagesHtml = '<div class="project-images">';
            project.caseImages.forEach(function(img) {
                imagesHtml += '<div class="project-image">' +
                    '<img src="' + img.src + '" alt="' + img.alt + '" loading="lazy">' +
                '</div>';
            });
            imagesHtml += '</div>';
        }

        // Ссылки (GitHub, Demo)
        var linksHtml = '';
        if (project.githubUrl || project.demoUrl) {
            linksHtml = '<div class="project-links">';
            if (project.githubUrl) {
                linksHtml += '<a href="' + project.githubUrl + '" target="_blank" rel="noopener" class="project-link project-link--github">' +
                    '<i class="fab fa-github"></i> GitHub' +
                '</a>';
            }
            if (project.demoUrl) {
                linksHtml += '<a href="' + project.demoUrl + '" target="_blank" rel="noopener" class="project-link project-link--demo">' +
                    '<i class="fas fa-external-link-alt"></i> Демо' +
                '</a>';
            }
            linksHtml += '</div>';
        }

        // Собираем карточку
        var card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML =
            '<div class="project-header">' +
                '<span class="project-company">' + project.company + '</span>' +
                '<div class="project-icon"><i class="fas ' + project.icon + '"></i></div>' +
            '</div>' +
            '<h3 class="project-title">' + project.title + '</h3>' +
            '<p class="project-desc">' + project.description + '</p>' +
            imagesHtml +
            '<div class="project-results">' + resultsHtml + '</div>' +
            '<div class="project-actions">' +
                caseBtn +
                linksHtml +
            '</div>';

        return card;
    }

    // ===== ЛОГИКА ТАБОВ =====
    function initTabs() {
        var tabs = document.querySelectorAll('.projects-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var newTab = this.getAttribute('data-tab');
                if (newTab === currentTab) return;

                // Обновляем активный таб
                tabs.forEach(function(t) {
                    t.classList.remove('active');
                });
                this.classList.add('active');

                // Переключаем категорию
                currentTab = newTab;
                renderProjects(currentTab);
            });
        });
    }

    // ===== ЛОГИКА КАРУСЕЛИ =====
    function getVisibleCount() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function updateCarousel() {
        if (!carouselTrack || !carouselTrack.children.length) return;

        var totalCards = carouselTrack.children.length;
        var visibleCount = getVisibleCount();
        var gap = 28;

        var viewportWidth = carouselViewport ? carouselViewport.clientWidth : 0;
        var totalGap = gap * (visibleCount - 1);
        var cardWidth = (viewportWidth - totalGap) / visibleCount;

        // Устанавливаем ширину всем карточкам
        Array.from(carouselTrack.children).forEach(function(card) {
            card.style.flex = '0 0 ' + cardWidth + 'px';
            card.style.minWidth = cardWidth + 'px';
        });

        var maxIndex = Math.max(0, totalCards - visibleCount);
        if (carouselIndex > maxIndex) carouselIndex = maxIndex;

        var offset = -carouselIndex * (cardWidth + gap);
        carouselTrack.style.transform = 'translateX(' + offset + 'px)';

        var prevBtn = document.getElementById('carouselPrev');
        var nextBtn = document.getElementById('carouselNext');

        if (prevBtn) prevBtn.disabled = carouselIndex === 0;
        if (nextBtn) nextBtn.disabled = carouselIndex >= maxIndex;
    }

    function initCarousel() {
        var prevBtn = document.getElementById('carouselPrev');
        var nextBtn = document.getElementById('carouselNext');

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (carouselIndex > 0) {
                    carouselIndex--;
                    updateCarousel();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (!carouselTrack) return;
                var totalCards = carouselTrack.children.length;
                var visibleCount = getVisibleCount();
                var maxIndex = Math.max(0, totalCards - visibleCount);
                if (carouselIndex < maxIndex) {
                    carouselIndex++;
                    updateCarousel();
                }
            });
        }

        window.addEventListener('resize', function() {
            updateCarousel();
        });
    }

    // ===== ЗАПУСК =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjects);
    } else {
        initProjects();
    }
})();