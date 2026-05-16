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

        var iframe = document.createElement('iframe');
        iframe.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 999999;';
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
        doc.write('<div class="header"><h1>' + d.personal.name + '</h1><p>' + d.personal.role + ' | Reg. centr kompetencij Sankt-Peterburga</p></div>');
        doc.write('<div class="section-title">Kontakty</div>');
        doc.write('<div class="text">Email: ' + d.contact.email + '</div>');
        doc.write('<div class="text">Telegram: ' + d.contact.telegram + '</div>');
        doc.write('<div class="text">Telefon: ' + d.contact.phone + '</div>');
        doc.write('<div class="section-title">Obo mne</div>');
        doc.write('<div class="text"><strong>Missija:</strong> ' + d.about.mission + '</div>');
        doc.write('<div class="text"><strong>Obrazovanie:</strong> ' + d.about.education + '</div>');
        doc.write('<div class="text"><strong>Opyt raboty:</strong> ' + d.about.experience + '</div>');
        doc.write('<div class="text"><strong>Podhod:</strong> ' + d.about.approach + '</div>');
        doc.write('<div class="section-title">Opyt raboty</div>');
        d.timeline.forEach(function(item) {
            doc.write('<div class="item"><span class="date-badge">' + item.date + '</span><div style="font-weight: 700; font-size: 11px; margin: 1px 0;">' + item.title + '</div><div class="company">' + item.company + '</div><div class="text">' + item.description + '</div></div>');
        });
        doc.write('<div class="section-title">Proekty</div>');
        d.projects.forEach(function(project) {
            var rh = '';
            project.results.forEach(function(r) {
                if (r.value && r.label) {
                    rh += '<span class="result-item"><div class="result-value">' + r.value + '</div><div class="result-label">' + r.label + '</div></span>';
                }
            });
            doc.write('<div class="project-block"><div class="project-company-label">' + project.company + '</div><div style="font-weight: 700; font-size: 11px; margin: 0 0 3px;">' + project.title + '</div><div class="text" style="margin: 0 0 5px;">' + project.description + '</div><div>' + rh + '</div></div>');
        });
        doc.write('<div class="section-title">Navyki</div>');
        doc.write('<div class="text"><strong>Instrumenty Lean:</strong> ' + d.skills.lean.join(', ') + '</div>');
        doc.write('<div class="text" style="margin-top: 5px;"><strong>Programmnoe obespechenie:</strong> ' + d.skills.software.join(', ') + '</div>');
        doc.write('<div class="text" style="margin-top: 5px;"><strong>Lichnye kachestva:</strong> ' + d.skills.personal.join(', ') + '</div>');
        doc.write('<div class="footer">Nacionalnyj proekt "Proizvoditelnost truda" - RCK Sankt-Peterburga<br>Data: ' + new Date().toLocaleDateString('ru-RU') + '</div>');
        doc.write('</body></html>');
        doc.close();

        setTimeout(function() {
            // Рендерим iframe через html2canvas
            html2canvas(iframe.contentDocument.body, {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: iframe.contentDocument.body.scrollWidth,
                height: iframe.contentDocument.body.scrollHeight
            }).then(function(canvas) {
                document.body.removeChild(iframe);

                var { jsPDF } = window.jspdf;
                var pdf = new jsPDF('p', 'mm', 'a4');
                var pw = pdf.internal.pageSize.getWidth(); // 210
                var ph = pdf.internal.pageSize.getHeight(); // 297

                var imgData = canvas.toDataURL('image/jpeg', 0.95);
                var imgW = pw; // масштабируем canvas под ширину PDF
                var imgH = (canvas.height / canvas.width) * pw;
                var pagesNeeded = Math.ceil(imgH / ph);

                for (var i = 0; i < pagesNeeded; i++) {
                    if (i > 0) pdf.addPage();
                    var offsetY = -i * ph; // смещение вверх на высоту страницы
                    pdf.addImage(imgData, 'JPEG', 0, offsetY, imgW, imgH);
                }

                pdf.save('Portfolio_Slinkov_Aleksandr.pdf');
                if (pdfBtn) { pdfBtn.textContent = 'Скачать портфолио (PDF)'; pdfBtn.style.opacity = '1'; pdfBtn.style.pointerEvents = 'auto'; }
            }).catch(function(err) {
                document.body.removeChild(iframe);
                if (pdfBtn) { pdfBtn.textContent = 'Скачать портфолио (PDF)'; pdfBtn.style.opacity = '1'; pdfBtn.style.pointerEvents = 'auto'; }
                alert('Ошибка генерации PDF.');
                console.error(err);
            });
        }, 2000);
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