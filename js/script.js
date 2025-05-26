document.addEventListener('DOMContentLoaded', function() {
    // ==========================================================================
    // ATUALIZA O ANO NO RODAPÉ
    // ==========================================================================
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // LÓGICA DOS CERTIFICADOS
    // ==========================================================================
    const certificatesData = [
        {
            title: "Fundamentos de Suporte Técnico",
            issuer: "Google",
            date: "Jan 2024 - Fev 2024",
            logoUrl: "", // Ex: "images/google-logo.png" ou deixe vazio para placeholder
            description: "Certificado cobrindo os fundamentos essenciais do suporte técnico em TI, incluindo hardware, software, redes e segurança."
        },
        {
            title: "Cybersecurity Essentials",
            issuer: "FIAP",
            date: "Mar 2024 - Abr 2024",
            logoUrl: "", // Ex: "images/fiap-logo.png"
            description: "Curso introdutório aos conceitos e práticas de cibersegurança, protegendo sistemas e dados."
        },
        {
            title: "Python para Análise de Dados",
            issuer: "Data Masters Academy",
            date: "Mai 2024 - Jun 2024",
            logoUrl: "", // Ex: "images/dma-logo.png"
            description: "Foco em bibliotecas como Pandas, NumPy e Matplotlib para manipulação e visualização de dados."
        }
        // Adicione mais certificados aqui
    ];

    const certificateDisplay = document.getElementById('certificate-display');
    const prevButton = document.getElementById('prev-certificate');
    const nextButton = document.getElementById('next-certificate');
    const pageInfo = document.getElementById('page-info');
    let currentCertificateIndex = 0;

    function displayCertificate(index) {
        if (!certificateDisplay) { return; }
        if (!certificatesData || certificatesData.length === 0) {
            certificateDisplay.innerHTML = "<p>Nenhum certificado para exibir no momento.</p>";
            if (pageInfo) pageInfo.textContent = "0/0";
            if (prevButton) prevButton.disabled = true;
            if (nextButton) nextButton.disabled = true;
            return;
        }
        const cert = certificatesData[index];
        let logoHtml = '';
        if (cert.logoUrl && cert.logoUrl.trim() !== "" && !cert.logoUrl.includes("path/to/your/")) {
            logoHtml = `<img src="${cert.logoUrl}" alt="Logo ${cert.issuer}" class="certificate-logo">`;
        } else {
            logoHtml = `<div class="certificate-logo-placeholder">Logo Indisponível</div>`;
        }
        certificateDisplay.innerHTML = `
            ${logoHtml}
            <h3>${cert.title}</h3>
            <p><strong>Emitido por:</strong> ${cert.issuer}</p>
            <p><strong>Data:</strong> ${cert.date}</p>
            ${cert.description ? `<p class="description">${cert.description}</p>` : ''}
        `;
        if (pageInfo) pageInfo.textContent = `${index + 1}/${certificatesData.length}`;
        if (prevButton) prevButton.disabled = index === 0;
        if (nextButton) nextButton.disabled = index === certificatesData.length - 1;
    }

    if (certificateDisplay) {
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                if (currentCertificateIndex > 0) {
                    currentCertificateIndex--;
                    displayCertificate(currentCertificateIndex);
                }
            });
            nextButton.addEventListener('click', () => {
                if (currentCertificateIndex < certificatesData.length - 1) {
                    currentCertificateIndex++;
                    displayCertificate(currentCertificateIndex);
                }
            });
        }
        displayCertificate(currentCertificateIndex);
    }

    // ====================================================================================
    // LÓGICA DO FORMULÁRIO DE CONTATO COM COOLDOWN NO BOTÃO E NA MENSAGEM DE STATUS
    // ====================================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const statusMessage = document.getElementById('contact-form-status');
        if (submitButton && statusMessage) {
            const originalButtonText = submitButton.textContent;
            const buttonCooldownTime = 3000; // Cooldown de 3 segundos para o BOTÃO
            const messageClearDelay = 5000;   // Mensagem some após 5 segundos
            let messageClearTimeoutId = null;

            contactForm.addEventListener('submit', function (event) {
                event.preventDefault();
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
                if (messageClearTimeoutId) { clearTimeout(messageClearTimeoutId); }
                statusMessage.textContent = '';
                statusMessage.className = '';
                statusMessage.style.display = 'none';
                const formData = new FormData(contactForm);
                fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                })
                .then(response => {
                    if (response.ok) {
                        statusMessage.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
                        statusMessage.className = 'success';
                        contactForm.reset();
                    } else {
                        response.json().then(data => {
                            if (data.errors && data.errors.length > 0) {
                                statusMessage.textContent = data.errors.map(error => error.message).join(', ');
                            } else {
                                statusMessage.textContent = 'Oops! Houve um problema ao enviar sua mensagem. Tente novamente.';
                            }
                            statusMessage.className = 'error';
                        }).catch(() => {
                            statusMessage.textContent = 'Oops! Houve um problema ao enviar sua mensagem (erro ao processar resposta).';
                            statusMessage.className = 'error';
                        });
                    }
                })
                .catch(error => {
                    console.error('Erro no envio do formulário (fetch):', error);
                    statusMessage.textContent = "Erro de rede ou ao tentar enviar. Verifique sua conexão e tente novamente.";
                    statusMessage.className = 'error';
                })
                .finally(() => {
                    statusMessage.style.display = 'block';
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }, buttonCooldownTime);
                    messageClearTimeoutId = setTimeout(() => {
                        statusMessage.textContent = '';
                        statusMessage.className = '';
                        statusMessage.style.display = 'none';
                    }, messageClearDelay);
                });
            });
        }
    }

    // ==========================================================================
    // MENU HAMBÚRGUER RESPONSIVO
    // ==========================================================================
    const hamburgerButton = document.querySelector('.hamburger-button');
    const navLinks = document.querySelector('.main-navigation .nav-links');

    if (hamburgerButton && navLinks) {
        hamburgerButton.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburgerButton.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('nav-active');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    hamburgerButton.classList.remove('active');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
});