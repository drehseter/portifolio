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
            date: "Mar 2024", // Corrigido para 2024, assumindo que era um erro de digitação
            logoUrl: "src/logo-bradesco.png",
            certificateLink: "src/Certificado_Bradesco_Excel.pdf",
            description: "Certificado em **Microsoft Excel 2016 Básico**, cobrindo a criação e edição de planilhas, uso de fórmulas e funções básicas, formatação de dados e organização para análise."
        }
        // Adicione mais certificados aqui
    ];

    const certificateDisplay = document.getElementById('certificate-display');
    const prevButtonCert = document.getElementById('prev-certificate'); // Renomeado para evitar conflito
    const nextButtonCert = document.getElementById('next-certificate'); // Renomeado para evitar conflito
    const pageInfoCert = document.getElementById('page-info'); // Renomeado para evitar conflito
    let currentCertificateIndex = 0;

    function displayCertificate(index) {
        if (!certificateDisplay) { return; }
        if (!certificatesData || certificatesData.length === 0) {
            certificateDisplay.innerHTML = "<p>Nenhum certificado para exibir no momento.</p>";
            if (pageInfoCert) pageInfoCert.textContent = "0/0";
            if (prevButtonCert) prevButtonCert.disabled = true;
            if (nextButtonCert) nextButtonCert.disabled = true;
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
        if (pageInfoCert) pageInfoCert.textContent = `${index + 1}/${certificatesData.length}`;
        if (prevButtonCert) prevButtonCert.disabled = index === 0;
        if (nextButtonCert) nextButtonCert.disabled = index === certificatesData.length - 1;
    }

    if (certificateDisplay) {
        if (prevButtonCert && nextButtonCert) {
            prevButtonCert.addEventListener('click', () => {
                if (currentCertificateIndex > 0) {
                    currentCertificateIndex--;
                    displayCertificate(currentCertificateIndex);
                }
            });
            nextButtonCert.addEventListener('click', () => {
                if (currentCertificateIndex < certificatesData.length - 1) {
                    currentCertificateIndex++;
                    displayCertificate(currentCertificateIndex);
                }
            });
        }
        if (certificatesData.length > 0) { // Apenas exibe se houver certificados
            displayCertificate(currentCertificateIndex);
        } else { // Garante que a mensagem de "nenhum certificado" seja exibida se o array estiver vazio
             displayCertificate(0); // Chamada para executar a lógica de array vazio
        }
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
            const buttonCooldownTime = 3000;
            const messageClearDelay = 5000;
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
    const nav = document.querySelector('.main-navigation .nav-links');

    if (hamburgerButton && nav) {
        hamburgerButton.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            hamburgerButton.classList.toggle('active');
            const isExpanded = nav.classList.contains('nav-active');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    hamburgerButton.classList.remove('active');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ==========================================================================
    // LÓGICA DE FILTRAGEM E PAGINAÇÃO DA GALERIA DE PROJETOS
    // ==========================================================================
    const projectFilterButtons = document.querySelectorAll('.project-filters .filter-btn');
    const allProjectItemsOriginal = Array.from(document.querySelectorAll('.project-gallery .project-item'));
    const projectGallery = document.querySelector('.project-gallery');
    const projectPaginationControlsContainer = document.querySelector('.project-pagination-controls');

    const PROJECTS_PER_PAGE = 3; // <<< Número de projetos por página
    let currentPageForProjects = 1;
    let currentlyFilteredProjects = [];

    function displayProjectsPage() {
        if (!projectGallery) return;
        // Os itens originais não devem estar na galeria principal se ela for preenchida dinamicamente.
        // A galeria será usada apenas para exibir os itens da página atual.
        // Se os itens originais estiverem escondidos em outro lugar ou se o HTML inicial da galeria for vazio,
        // esta linha de limpar pode não ser necessária ou pode ser ajustada.
        // Por ora, assumimos que ela deve ser limpa para receber os itens da página.
        projectGallery.innerHTML = '';

        const startIndex = (currentPageForProjects - 1) * PROJECTS_PER_PAGE;
        const endIndex = startIndex + PROJECTS_PER_PAGE;
        const projectsToShowOnPage = currentlyFilteredProjects.slice(startIndex, endIndex);

        if (projectsToShowOnPage.length === 0 && currentPageForProjects > 1) {
            currentPageForProjects--;
            displayProjectsPage();
            return;
        }
        
        projectsToShowOnPage.forEach(item => {
            // Importante: Clonar o nó original para evitar problemas se o mesmo item for
            // referenciado em 'allProjectItemsOriginal' e também manipulado/removido da galeria.
            projectGallery.appendChild(item.cloneNode(true));
        });

        renderProjectPaginationControls();
    }

    function renderProjectPaginationControls() {
        if (!projectPaginationControlsContainer) return;
        projectPaginationControlsContainer.innerHTML = ''; 

        const totalPages = Math.ceil(currentlyFilteredProjects.length / PROJECTS_PER_PAGE);

        if (totalPages <= 1) {
            projectPaginationControlsContainer.style.display = 'none';
            return;
        }
        projectPaginationControlsContainer.style.display = 'flex';


        const prevButtonProjects = document.createElement('button');
        prevButtonProjects.innerHTML = '&laquo; Anterior';
        prevButtonProjects.classList.add('pagination-btn'); // Reutiliza a classe dos certificados
        prevButtonProjects.disabled = currentPageForProjects === 1;
        prevButtonProjects.addEventListener('click', () => {
            if (currentPageForProjects > 1) {
                currentPageForProjects--;
                displayProjectsPage();
            }
        });
        projectPaginationControlsContainer.appendChild(prevButtonProjects);

        const pageInfoProjects = document.createElement('span');
        pageInfoProjects.classList.add('project-page-info'); // Nova classe para info de página de projetos
        pageInfoProjects.textContent = `${currentPageForProjects} / ${totalPages}`;
        projectPaginationControlsContainer.appendChild(pageInfoProjects);

        const nextButtonProjects = document.createElement('button');
        nextButtonProjects.innerHTML = 'Próximo &raquo;';
        nextButtonProjects.classList.add('pagination-btn'); // Reutiliza a classe dos certificados
        nextButtonProjects.disabled = currentPageForProjects === totalPages;
        nextButtonProjects.addEventListener('click', () => {
            if (currentPageForProjects < totalPages) {
                currentPageForProjects++;
                displayProjectsPage();
            }
        });
        projectPaginationControlsContainer.appendChild(nextButtonProjects);
    }

    if (projectFilterButtons.length > 0 && projectGallery) { // Verifica se projectGallery existe
        // Esconder os itens originais da galeria se eles estiverem lá inicialmente
        // e a galeria for usada apenas para exibir os itens paginados.
        // Se allProjectItemsOriginal são os únicos no DOM e não há outros, esta linha pode ser removida.
        // A melhor abordagem é ter os itens originais fora da 'project-gallery' visível,
        // ou a 'project-gallery' vazia no HTML e preenchê-la.
        // Se os itens estão no HTML dentro de .project-gallery para serem lidos, eles serão limpos por .innerHTML = ''
        // na função displayProjectsPage.

        projectFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                projectFilterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');
                currentPageForProjects = 1; 

                if (filterValue === 'all') {
                    currentlyFilteredProjects = allProjectItemsOriginal;
                } else {
                    currentlyFilteredProjects = allProjectItemsOriginal.filter(item => {
                        return item.getAttribute('data-category') === filterValue;
                    });
                }
                displayProjectsPage();
            });
        });

        const initialActiveFilter = document.querySelector('.project-filters .filter-btn.active');
        if (initialActiveFilter) {
            initialActiveFilter.click();
        } else if (projectFilterButtons.length > 0) {
            projectFilterButtons[0].click();
        } else if (allProjectItemsOriginal.length > 0) {
            // Se não há filtros, mas há projetos, exibe todos paginados
            currentlyFilteredProjects = allProjectItemsOriginal;
            displayProjectsPage();
        }


    } else {
        if (projectPaginationControlsContainer) projectPaginationControlsContainer.style.display = 'none';
        if (projectFilterButtons.length === 0 && document.getElementById('projects')) {
            console.warn("Nenhum botão de filtro (.filter-btn) encontrado dentro de .project-filters.");
        }
        // Não há necessidade de aviso se allProjectItemsOriginal for 0, pois pode ser que não haja projetos
    }
});