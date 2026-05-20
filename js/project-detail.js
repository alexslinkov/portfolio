/**
 * Project Detail.js — логика страницы подробного описания проекта
 */

(function() {
    'use strict';

    // ===== ПОЛУЧЕНИЕ ПАРАМЕТРОВ ИЗ URL =====
    function getQueryParams() {
        var params = {};
        var queryString = window.location.search.substring(1);
        var pairs = queryString.split('&');
        pairs.forEach(function(pair) {
            var parts = pair.split('=');
            if (parts.length === 2) {
                params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            }
        });
        return params;
    }

    // ===== ПОИСК ПРОЕКТА ПО ID =====
    function findProject(projectId) {
        if (!siteData || !siteData.projects) return null;
        
        var categories = ['lean', 'engineering', 'it'];
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            var projects = siteData.projects[category];
            if (projects) {
                for (var j = 0; j < projects.length; j++) {
                    if (projects[j].id === projectId) {
                        return {
                            project: projects[j],
                            category: category,
                            index: j
                        };
                    }
                }
            }
        }
        return null;
    }

    // ===== РЕНДЕР СТРАНИЦЫ ПРОЕКТА =====
    function renderProjectDetail(project, category, index) {
        var container = document.getElementById('projectDetail');
        if (!container) return;

        // Заголовок
        var categoryNames = {
            lean: 'Бережливое производство',
            engineering: 'Конструкторские работы',
            it: 'IT-проекты'
        };

        // Результаты
        var resultsHtml = '';
        if (project.results && project.results.length > 0) {
            resultsHtml = '<div class="project-detail-results">';
            project.results.forEach(function(r) {
                if (r.value && r.label) {
                    resultsHtml += 
                        '<div class="project-detail-result-item">' +
                            '<span class="project-detail-result-value">' + r.value + '</span>' +
                            '<span class="project-detail-result-label">' + r.label + '</span>' +
                        '</div>';
                }
            });
            resultsHtml += '</div>';
        }

        // Изображения
        var imagesHtml = '';
        if (project.caseImages && project.caseImages.length > 0) {
            imagesHtml = '<div class="project-detail-images">';
            project.caseImages.forEach(function(img) {
                imagesHtml += 
                    '<div class="project-detail-image">' +
                        '<img src="' + img.src + '" alt="' + img.alt + '" loading="lazy">' +
                        '<span class="project-detail-image-caption">' + img.alt + '</span>' +
                    '</div>';
            });
            imagesHtml += '</div>';
        }

        // Ссылки
        var linksHtml = '';
        if (project.githubUrl || project.demoUrl) {
            linksHtml = '<div class="project-detail-links">';
            if (project.githubUrl) {
                linksHtml += '<a href="' + project.githubUrl + '" target="_blank" rel="noopener" class="btn btn-outline project-detail-link">' +
                    '<i class="fab fa-github"></i> GitHub' +
                '</a>';
            }
            if (project.demoUrl) {
                linksHtml += '<a href="' + project.demoUrl + '" target="_blank" rel="noopener" class="btn btn-primary project-detail-link">' +
                    '<i class="fas fa-external-link-alt"></i> Демо' +
                '</a>';
            }
            linksHtml += '</div>';
        }

        // Кнопка скачивания кейса
        var caseBtn = '';
        if (project.caseFile) {
            caseBtn = '<a href="' + project.caseFile + '" class="btn btn-outline project-detail-case">' +
                '<i class="fas fa-file-alt"></i> Скачать описание проекта' +
            '</a>';
        }

        // Собираем контент
        container.innerHTML = 
            '<div class="project-detail-header">' +
                '<span class="project-detail-category">' + (categoryNames[category] || category) + '</span>' +
                '<h1 class="project-detail-title">' + project.title + '</h1>' +
                '<p class="project-detail-company"><i class="fas fa-building"></i> ' + project.company + '</p>' +
            '</div>' +
            
            '<div class="project-detail-body">' +
                '<div class="project-detail-description">' +
                    '<h2><i class="fas fa-info-circle"></i> Описание проекта</h2>' +
                    '<p>' + project.description + '</p>' +
                '</div>' +
                
                imagesHtml +
                
                '<div class="project-detail-results-section">' +
                    '<h2><i class="fas fa-chart-line"></i> Результаты</h2>' +
                    resultsHtml +
                '</div>' +
                
                '<div class="project-detail-actions">' +
                    caseBtn +
                    linksHtml +
                '</div>' +
            '</div>';

        // Обновляем title страницы
        document.title = project.title + ' | Портфолио';
    }

    // ===== РЕНДЕР ОШИБКИ =====
    function renderError() {
        var container = document.getElementById('projectDetail');
        if (!container) return;
        
        container.innerHTML = 
            '<div class="project-detail-error">' +
                '<i class="fas fa-exclamation-circle"></i>' +
                '<h2>Проект не найден</h2>' +
                '<p>К сожалению, запрошенный проект не найден.</p>' +
                '<a href="index.html#projects" class="btn btn-primary">' +
                    '<i class="fas fa-arrow-left"></i> Вернуться к проектам' +
                '</a>' +
            '</div>';
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    function init() {
        var params = getQueryParams();
        var projectId = params.id;

        if (!projectId) {
            renderError();
            return;
        }

        var found = findProject(projectId);
        if (!found) {
            renderError();
            return;
        }

        renderProjectDetail(found.project, found.category, found.index);

        // Год в футере
        var yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }

        // Бургер-меню
        var burger = document.getElementById('burger');
        var navList = document.getElementById('navList');
        if (burger && navList) {
            burger.addEventListener('click', function() {
                burger.classList.toggle('active');
                navList.classList.toggle('open');
            });
        }

        // Скролл для хедера
        var header = document.getElementById('header');
        window.addEventListener('scroll', function() {
            if (!header) return;
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();