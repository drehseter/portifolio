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
            logoUrl: "src/logo-google.webp",
            certificateLink: "https://www.coursera.org/account/accomplishments/certificate/XQAAPXNM36M4",
            description: "Este certificado abrange os pilares do suporte técnico em TI, explorando **hardware, software, redes, sistemas operacionais e segurança da informação**. Foca na resolução de problemas e atendimento ao usuário."
        },
        {
            title: "Cybersecurity Essentials",
            issuer: "FIAP",
            date: "Mar 2024 - Abr 2024",
            logoUrl: "src/logo-fiap.png",
            certificateLink: "https://on.fiap.com.br/local/nanocourses/gerar_certificado.php?chave=dd43da66b420eac1ee9596f42b5f92ba&action=view",
            description: "Curso introdutório aos **conceitos fundamentais de cibersegurança**, incluindo proteção de dados, avaliação de riscos, defesa contra ameaças cibernéticas e princípios de segurança de redes."
        },
        {
            title: "Python Essentials 1",
            issuer: "Cisco",
            date: "September 2023",
            logoUrl: "src/logo-cisco.png",
            certificateLink: "https://www.credly.com/badges/55bce22f-0316-4f71-9255-e88bc2fc7b73/linked_in_profile",
            description: "Focado no uso Básico do Python"
        },
        {
            title: "IMPLEMENTANDO BANCO DE DADOS",
            issuer: "Bradesco",
            date: "Fev 2024",
            logoUrl: "src/logo-bradesco.png",
            certificateLink: "src/Certificado_Bradesco_BC.pdf",
            description: "Este curso ensina os fundamentos da **implementação de bancos de dados**, cobrindo a estruturação, manipulação e consulta de dados, essencial para sistemas de informação."
        },
        {
            title: "MICROSOFT EXCEL 2016 - BÁSICO",
            issuer: "Bradesco",
            date: "Mar 2025",
            logoUrl: "src/logo-bradesco.png",
            certificateLink: "src/Certificado_Bradesco_Excel.pdf",
            description: "Certificado em **Microsoft Excel 2016 Básico**, cobrindo a criação e edição de planilhas, uso de fórmulas e funções básicas, formatação de dados e organização para análise."
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
        let certificateLinkHtml = '';

        if (cert.logoUrl && cert.logoUrl.trim() !== "" && !cert.logoUrl.includes("path/to/your/")) {
            logoHtml = `<img src="${cert.logoUrl}" alt="Logo ${cert.issuer}" class="certificate-logo">`;
        } else {
            logoHtml = `<div class="certificate-logo-placeholder">Logo Indisponível</div>`;
        }

        if (cert.certificateLink && cert.certificateLink.trim() !== "") {
            certificateLinkHtml = `<p><a href="${cert.certificateLink}" target="_blank" rel="noopener noreferrer" class="certificate-link">Ver Certificado Completo (PDF)</a></p>`;
        }


        certificateDisplay.innerHTML = `
            ${logoHtml}
            <h3>${cert.title}</h3>
            <p><strong>Emitido por:</strong> ${cert.issuer}</p>
            <p><strong>Data:</strong> ${cert.date}</p>
            ${cert.description ? `<p class="description">${cert.description}</p>` : ''}
            ${certificateLinkHtml}
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