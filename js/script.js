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

    // ===== PDF =====
    function generatePDF() {
        var d = siteData;
        var pdfBtn = document.getElementById('downloadPdfBtn');

        // Проверка загрузки библиотек
        if (typeof html2canvas === 'undefined') {
            alert('Библиотека html2canvas не загружена. Проверьте подключение к интернету.');
            if (pdfBtn) { pdfBtn.textContent = 'Скачать портфолио (PDF)'; pdfBtn.style.opacity = '1'; pdfBtn.style.pointerEvents = 'auto'; }
            return;
        }

        var iframe = document.createElement('iframe');
        iframe.style.cssText = 'position: fixed; top: 0; left: 0; width: 800px; height: 0; border: none; z-index: 999999; opacity: 0;';
        document.body.appendChild(iframe);

        var doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write('<!DOCTYPE html><html><head><meta charset="UTF-8">');
        doc.write('<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">');
        doc.write('<style>');
        doc.write('@page { size: A4; margin: 18mm 15mm; }');
        doc.write('* { box-sizing: border-box; }');
        doc.write('body { font-family: "Open Sans", sans-serif; color: #111827; margin: 0; padding: 0; }');
        doc.write('.header { background: #365FF0; color: #fff; padding: 14px 20px; margin: -18mm -15mm 0; width: calc(100% + 30mm); }');
        doc.write('.header h1 { font-family: "Montserrat", sans-serif; font-size: 20px; font-weight: 800; margin: 0; }');
        doc.write('.header p { font-size: 12px; margin: 4px 0 0; opacity: 0.9; }');
        doc.write('.section-title { color: #365FF0; font-family: "Montserrat", sans-serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #365FF0; padding-bottom: 3px; margin: 14px 0 6px; }');
        doc.write('.text { font-size: 10px; margin: 3px 0; color: #374151; line-height: 1.5; }');
        doc.write('.item { margin-bottom: 8px; }');
        doc.write('.date-badge { background: #365FF0; color: #fff; font-size: 8px; font-weight: 700; padding: 1px 7px; border-radius: 3px; display: inline-block; }');
        doc.write('.company { font-size: 9px; color: #4B6B9B; margin: 1px 0; }');
        doc.write('.project-block { background: #F9FAFB; border: 1px solid #e5e7eb; border-radius: 5px; padding: 10px; margin-bottom: 10px; page-break-inside: avoid; }');
        doc.write('.project-company-label { font-size: 9px; color: #365FF0; font-weight: 700; text-transform: uppercase; margin: 0 0 3px; }');
        doc.write('.result-item { display: inline-block; background: #F8FAFE; border: 1px solid #e5e7eb; border-radius: 4px; padding: 3px 7px; margin: 2px; text-align: center; vertical-align: top; }');
        doc.write('.result-value { font-weight: 700; color: #365FF0; font-size: 9px; }');
        doc.write('.result-label { font-size: 7px; color: #6b7280; }');
        doc.write('.footer { border-top: 1px solid #d1d5db; padding-top: 6px; margin-top: 12px; color: #6b7280; font-size: 8px; }');
        doc.write('@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }');
        doc.write('</style></head><body>');
        doc.write('<div class="header"><h1>' + d.personal.name + '</h1><p>' + d.personal.role + ' | Региональный центр компетенций Санкт-Петербурга</p></div>');

        doc.write('<div class="section-title">Контакты</div>');
        doc.write('<div class="text">Email: ' + d.contact.email + '</div>');
        doc.write('<div class="text">Telegram: ' + d.contact.telegram + '</div>');
        doc.write('<div class="text">Телефон: ' + d.contact.phone + '</div>');

        doc.write('<div class="section-title">Обо мне</div>');
        doc.write('<div class="text"><strong>Миссия:</strong> ' + d.about.mission + '</div>');
        doc.write('<div class="text"><strong>Образование:</strong> ' + d.about.education + '</div>');
        doc.write('<div class="text"><strong>Опыт работы:</strong> ' + d.about.experience + '</div>');
        doc.write('<div class="text"><strong>Подход:</strong> ' + d.about.approach + '</div>');

        doc.write('<div class="section-title">Опыт работы</div>');
        d.timeline.forEach(function(item) {
            doc.write('<div class="item"><span class="date-badge">' + item.date + '</span><div style="font-weight: 700; font-size: 11px; margin: 1px 0;">' + item.title + '</div><div class="company">' + item.company + '</div><div class="text">' + item.description + '</div></div>');
        });

        doc.write('<div class="section-title">Проекты</div>');
        d.projects.forEach(function(project) {
            var rh = '';
            project.results.forEach(function(r) {
                if (r.value && r.label) {
                    rh += '<span class="result-item"><div class="result-value">' + r.value + '</div><div class="result-label">' + r.label + '</div></span>';
                }
            });
            doc.write('<div class="project-block"><div class="project-company-label">' + project.company + '</div><div style="font-weight: 700; font-size: 11px; margin: 0 0 3px;">' + project.title + '</div><div class="text" style="margin: 0 0 5px;">' + project.description + '</div><div>' + rh + '</div></div>');
        });

        doc.write('<div class="section-title">Навыки</div>');
        doc.write('<div class="text"><strong>Инструменты Lean:</strong> ' + d.skills.lean.join(', ') + '</div>');
        doc.write('<div class="text" style="margin-top: 5px;"><strong>Программное обеспечение:</strong> ' + d.skills.software.join(', ') + '</div>');
        doc.write('<div class="text" style="margin-top: 5px;"><strong>Личные качества:</strong> ' + d.skills.personal.join(', ') + '</div>');
        doc.write('<div class="footer">Национальный проект «Производительность труда» — РЦК Санкт-Петербурга<br>Дата: ' + new Date().toLocaleDateString('ru-RU') + '</div>');
        doc.write('</body></html>');
        doc.close();

        // Ждём полной загрузки контента в iframe
        iframe.onload = function() {
            setTimeout(function() {
                try {
                    html2canvas(iframe.contentDocument.body, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff'
                    }).then(function(canvas) {
                        document.body.removeChild(iframe);

                        var JsPDF = window.jspdf.jsPDF;
                        var pdf = new JsPDF('p', 'mm', 'a4');
                        var pw = pdf.internal.pageSize.getWidth();
                        var ph = pdf.internal.pageSize.getHeight();

                        var imgData = canvas.toDataURL('image/jpeg', 0.95);
                        var imgW = pw;
                        var imgH = (canvas.height / canvas.width) * pw;
                        var pagesNeeded = Math.ceil(imgH / ph);

                        for (var i = 0; i < pagesNeeded; i++) {
                            if (i > 0) pdf.addPage();
                            var offsetY = -i * ph;
                            pdf.addImage(imgData, 'JPEG', 0, offsetY, imgW, imgH);
                        }

                        pdf.save('Portfolio_Slinkov_Aleksandr.pdf');
                        if (pdfBtn) { pdfBtn.textContent = 'Скачать портфолио (PDF)'; pdfBtn.style.opacity = '1'; pdfBtn.style.pointerEvents = 'auto'; }
                    }).catch(function(err) {
                        document.body.removeChild(iframe);
                        if (pdfBtn) { pdfBtn.textContent = 'Скачать портфолио (PDF)'; pdfBtn.style.opacity = '1'; pdfBtn.style.pointerEvents = 'auto'; }
                        alert('Ошибка генерации PDF: ' + err.message);
                        console.error(err);
                    });
                } catch (e) {
                    document.body.removeChild(iframe);
                    if (pdfBtn) { pdfBtn.textContent = 'Скачать портфолио (PDF)'; pdfBtn.style.opacity = '1'; pdfBtn.style.pointerEvents = 'auto'; }
                    alert('Ошибка генерации PDF: ' + e.message);
                    console.error(e);
                }
            }, 1500);
        };
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