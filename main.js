function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');
    const mobileMenuCta = document.querySelector('.mobile-menu-cta');
    const mobileMenuCtaButton = document.querySelector('.mobile-menu-cta a');
    const mobileMenuLogo = document.querySelector('.mobile-menu-logo');

    if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
        return;
    }

    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        mobileMenuLinks.forEach((link, index) => {
            if (link) {
                link.style.animation = 'none'; 
                void link.offsetWidth; 
                link.style.animation = `slideInLeft 0.4s ease-out forwards ${index * 0.1}s`;
            }
        });

        if (mobileMenuCtaButton) {
            mobileMenuCtaButton.style.animation = 'none';
            void mobileMenuCtaButton.offsetWidth;
            mobileMenuCtaButton.style.animation = `slideInUp 0.4s ease-out forwards ${mobileMenuLinks.length * 0.1 + 0.1}s`;
        }
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', openMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function generateParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    if (!particlesContainer) return;

    const numberOfParticles = 50; 
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`; 
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
    }
}

function createMatrixRain() {
    const matrixRainContainer = document.getElementById('matrixRain');
    if (!matrixRainContainer) return;

    const characters = '0123456789ABCDEF'; 
    const columnWidth = 20; 
    const numColumns = Math.floor(window.innerWidth / columnWidth);

    for (let i = 0; i < numColumns; i++) {
        const column = document.createElement('div');
        column.classList.add('matrix-column');
        column.style.left = `${i * columnWidth}px`;
        column.style.animationDuration = `${Math.random() * 5 + 5}s`; 
        column.style.animationDelay = `${Math.random() * 5}s`;

        let columnText = '';
        for (let j = 0; j < 50; j++) { 
            columnText += characters[Math.floor(Math.random() * characters.length)];
        }
        column.textContent = columnText;
        matrixRainContainer.appendChild(column);
    }
}

function createDataStreams() {
    const dataStreamsContainer = document.getElementById('dataStreams');
    if (!dataStreamsContainer) return;

    const numberOfStreams = 15;
    for (let i = 0; i < numberOfStreams; i++) {
        const stream = document.createElement('div');
        stream.classList.add('data-stream');
        stream.style.top = `${Math.random() * 100}vh`;
        stream.style.animationDelay = `${Math.random() * 5}s`;
        stream.style.animationDuration = `${Math.random() * 2 + 3}s`; 
        dataStreamsContainer.appendChild(stream);
    }
}

function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const delay = parseFloat(entry.target.dataset.delay);
                if (!isNaN(delay)) {
                    entry.target.style.transitionDelay = `${delay}s`;
                }
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

function updateNavigationAndButtons() {
    console.log("updateNavigationAndButtons called");

    if (typeof window.getLoggedInUser === 'function') { 
        const loggedInUserEmail = window.getLoggedInUser(); 
        console.log("Logged in user:", loggedInUserEmail);

        const navActionButton = document.getElementById('navActionButton'); 
        const mobileNavActionButton = document.getElementById('mobileNavActionButton'); 
        const heroIgniteBtn = document.getElementById('heroIgniteBtn'); 

        const navBottom = document.querySelector('nav .nav-bottom'); 
        const mobileMenuCta = document.querySelector('.mobile-menu-cta'); 

        if (navActionButton) {
            navActionButton.href = loggedInUserEmail ? 'ai-playground.html' : 'login.html';
        }
        if (mobileNavActionButton) {
            mobileNavActionButton.href = loggedInUserEmail ? 'ai-playground.html' : 'login.html';
        }

        if (heroIgniteBtn) {
            heroIgniteBtn.href = loggedInUserEmail ? 'ai-playground.html' : 'login.html';
        }

        let desktopAccountLink = document.getElementById('accountNavLinkDesktop');
        if (loggedInUserEmail) {
            if (!desktopAccountLink) {

                desktopAccountLink = document.createElement('a');
                desktopAccountLink.href = 'account.html';
                desktopAccountLink.id = 'accountNavLinkDesktop';
                desktopAccountLink.textContent = 'Account';
                desktopAccountLink.classList.add('btn-account-nav'); 

                if (navBottom && navActionButton) {
                    navBottom.insertBefore(desktopAccountLink, navActionButton);
                }
                console.log("Desktop Account button added.");
            }
        } else {

            if (desktopAccountLink) {
                desktopAccountLink.remove();
                console.log("Desktop Account button removed.");
            }
        }

        let mobileAccountLink = document.getElementById('accountNavLinkMobile');
        if (loggedInUserEmail) {
            if (!mobileAccountLink) {

                mobileAccountLink = document.createElement('a');
                mobileAccountLink.href = 'account.html';
                mobileAccountLink.id = 'accountNavLinkMobile';
                mobileAccountLink.textContent = 'Account';
                mobileAccountLink.classList.add('btn-account-nav'); 

                if (mobileMenuCta && mobileNavActionButton) {
                    mobileMenuCta.insertBefore(mobileAccountLink, mobileNavActionButton);
                }
                console.log("Mobile Account button added.");
            }
        } else {

            if (mobileAccountLink) {
                mobileAccountLink.remove();
                console.log("Mobile Account button removed.");
            }
        }
    } else {
        console.warn("getLoggedInUser function not found. auth-scripts.js might not be loaded or executed yet.");
    }
}

document.querySelector('.btn-submit')?.addEventListener('click', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {

        this.textContent = 'TRANSMITTING...';
        this.style.background = 'linear-gradient(135deg, var(--primary-cyan), var(--primary-pink))';

        setTimeout(() => {
            this.textContent = 'TRANSMISSION COMPLETE';
            this.style.background = 'var(--primary-cyan)';

            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';

            setTimeout(() => {
                this.textContent = 'Transmit Message';
                this.style.background = '';
            }, 3000);
        }, 2000);
    }
});

function initializeCursorGlow() {

    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '' || currentPage === 'index.html') { 

        if (window.innerWidth > 768) {
            const cursorGlow = document.createElement('div');
            cursorGlow.style.cssText = `
                position: fixed;
                width: 400px;
                height: 400px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
                pointer-events: none; 
                z-index: 9999;
                transform: translate(-50%, -50%); 
                transition: opacity 0.3s ease;
                opacity: 0; 
                filter: blur(10px); 
            `;
            document.body.appendChild(cursorGlow);

            document.addEventListener('mousemove', (e) => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
                cursorGlow.style.opacity = '1';
            });

            document.addEventListener('mouseleave', () => {
                cursorGlow.style.opacity = '0';
            });
        }
    }
}

const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {

        const originalText = stat.textContent;

        const target = parseInt(originalText.replace(/[^\d]/g, ''));

        const suffix = originalText.replace(/[\d]/g, '');

        let count = 0;
        const duration = 1500; 
        const steps = 100; 
        const increment = target / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            count = Math.min(target, Math.floor(increment * currentStep)); 

            stat.textContent = count + suffix;

            if (currentStep >= steps) {
                clearInterval(timer);
                stat.textContent = originalText; 
            }
        }, duration / steps);
    });
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target); 
        }
    });
}, { threshold: 0.5 }); 

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    generateParticles();
    createMatrixRain();
    createDataStreams();
    setupScrollAnimations();

    setTimeout(updateNavigationAndButtons, 100); 
    initializeCursorGlow(); 
});

window.addEventListener('focus', updateNavigationAndButtons);

const style = document.createElement('style');
style.textContent = `
    @keyframes matrixFall {
        0% { transform: translateY(0); }
        100% { transform: translateY(100vh); } 
    }
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {

    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '' || currentPage === 'index.html') {
        const heroSection = document.querySelector('.hero');

        const backgroundElements = document.querySelectorAll('.cyber-bg, .matrix-rain, .particles, .orb, .grid-overlay, .scanlines, .noise-overlay, .cyber-gradient');

        const initialBlurValues = new Map();
        backgroundElements.forEach(element => {
            const computedStyle = getComputedStyle(element);
            const filter = computedStyle.filter;
            const match = filter.match(/blur\((\d+(\.\d+)?)(px)?\)/);
            initialBlurValues.set(element, match ? parseFloat(match[1]) : 0);
        });

        if (!heroSection || backgroundElements.length === 0) {
            return; 
        }

        const heroHeight = heroSection.offsetHeight; 

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            const blurStart = heroHeight * 0.2;
            const blurEnd = heroHeight * 0.8;

            let scrollBlurAmount = 0;

            if (scrollY > blurStart) {

                const scrollProgress = Math.min(1, (scrollY - blurStart) / (blurEnd - blurStart));
                scrollBlurAmount = scrollProgress * 5; 
            }

            backgroundElements.forEach(element => {
                const initialBlur = initialBlurValues.get(element) || 0;
                element.style.filter = `blur(${initialBlur + scrollBlurAmount}px)`;
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const solutionsPageSection = document.querySelector('.solutions-page-section');
    if (!solutionsPageSection) {
        return; 
    }

    const tabButtons = document.querySelectorAll('.solution-tab-button');
    const solutionItems = document.querySelectorAll('.solution-item');

    let threeScene, threeCamera, threeRenderer, threeCube;
    let frameIdDataAnalytics = null;
    let frameIdImmersiveWorkspace = null;
    let workflowAnimationInterval = null;

    function resizeCanvas(canvas) {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
    }

    function initDataAnalytics() {
        const canvas = document.getElementById('dataAnalyticsCanvas');
        if (!canvas) return;

        resizeCanvas(canvas); 
        const ctx = canvas.getContext('2d');

        const dataPoints = [
            { value: 20, color: 'rgba(0, 255, 255, 0.8)' }, 
            { value: 40, color: 'rgba(255, 0, 255, 0.8)' }, 
            { value: 60, color: 'rgba(124, 58, 237, 0.8)' }, 
            { value: 30, color: 'rgba(249, 115, 22, 0.8)' }, 
            { value: 70, color: 'rgba(0, 255, 255, 0.8)' }  
        ];
        const maxVal = 100;
        let animationProgress = 0; 

        function drawDataAnalytics() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / dataPoints.length) * 0.6;
            const gap = (canvas.width / dataPoints.length) * 0.4 / (dataPoints.length - 1);
            const startX = (canvas.width - (barWidth * dataPoints.length + gap * (dataPoints.length - 1))) / 2;

            dataPoints.forEach((point, index) => {
                const barHeight = (point.value / maxVal) * canvas.height * animationProgress;
                const x = startX + (barWidth + gap) * index;
                const y = canvas.height - barHeight;

                ctx.fillStyle = point.color;
                ctx.fillRect(x, y, barWidth, barHeight);

                ctx.shadowBlur = 15;
                ctx.shadowColor = point.color;
                ctx.fillStyle = point.color; 
                ctx.fillRect(x, y, barWidth, barHeight);
                ctx.shadowBlur = 0; 
            });

            animationProgress += 0.01; 
            if (animationProgress > 1) {
                animationProgress = 1; 
            }
            if (animationProgress < 1) {
                frameIdDataAnalytics = requestAnimationFrame(drawDataAnalytics);
            }
        }

        animationProgress = 0; 
        if (frameIdDataAnalytics) cancelAnimationFrame(frameIdDataAnalytics); 
        drawDataAnalytics();

        window.addEventListener('resize', () => resizeCanvas(canvas));
    }

    function stopDataAnalytics() {
        if (frameIdDataAnalytics) {
            cancelAnimationFrame(frameIdDataAnalytics);
            frameIdDataAnalytics = null;
        }
    }

    function initImmersiveWorkspace() {
        const canvas = document.getElementById('immersiveWorkspaceCanvas');
        if (!canvas) return;

        threeScene = new THREE.Scene();
        threeCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        threeRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        threeRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        threeRenderer.setClearColor(0x000000, 0); 

        const onResize = () => {
            threeCamera.aspect = canvas.clientWidth / canvas.clientHeight;
            threeCamera.updateProjectionMatrix();
            threeRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        };
        window.addEventListener('resize', onResize);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true }); 
        threeCube = new THREE.Mesh(geometry, material);
        threeScene.add(threeCube);

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 2 }); 
        const points = [];
        points.push(new THREE.Vector3(-2, 0, 0));
        points.push(new THREE.Vector3(0, 2, 0));
        points.push(new THREE.Vector3(2, 0, 0));
        points.push(new THREE.Vector3(0, -2, 0));
        points.push(new THREE.Vector3(-2, 0, 0));
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        threeScene.add(line);

        threeCamera.position.z = 5;

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            threeCube.rotation.y += deltaX * 0.01;
            threeCube.rotation.x += deltaY * 0.01;

            line.rotation.y += deltaX * 0.01;
            line.rotation.x += deltaY * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        function animateImmersiveWorkspace() {
            frameIdImmersiveWorkspace = requestAnimationFrame(animateImmersiveWorkspace);

            if (!isDragging) {
                threeCube.rotation.x += 0.005;
                threeCube.rotation.y += 0.005;
                line.rotation.x += 0.005;
                line.rotation.y += 0.005;
            }

            threeRenderer.render(threeScene, threeCamera);
        }

        animateImmersiveWorkspace(); 
    }

    function stopImmersiveWorkspace() {
        if (frameIdImmersiveWorkspace) {
            cancelAnimationFrame(frameIdImmersiveWorkspace);
            frameIdImmersiveWorkspace = null;
        }
        if (threeRenderer) {
            threeRenderer.dispose();
            threeRenderer = null;
            threeScene = null;
            threeCamera = null;
            threeCube = null;
        }
        window.removeEventListener('resize', () => {  });
    }

    function initWorkflowOrchestration() {
        const svg = document.getElementById('workflowSvg');
        if (!svg) return;

        svg.innerHTML = '';

        const nodes = [
            { id: 'start', x: 100, y: 200, label: 'Data Ingest' },
            { id: 'process1', x: 300, y: 100, label: 'Data Cleanse' },
            { id: 'process2', x: 300, y: 300, label: 'Feature Eng.' },
            { id: 'ai', x: 500, y: 200, label: 'AI Model' },
            { id: 'end', x: 700, y: 200, label: 'Output' }
        ];

        const paths = [
            { from: 'start', to: 'process1' },
            { from: 'start', to: 'process2' },
            { from: 'process1', to: 'ai' },
            { from: 'process2', to: 'ai' },
            { from: 'ai', to: 'end' }
        ];

        const nodeMap = new Map();

        nodes.forEach(nodeData => {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', nodeData.x - 75);
            rect.setAttribute('y', nodeData.y - 25);
            rect.setAttribute('width', 150);
            rect.setAttribute('height', 50);
            rect.setAttribute('rx', 10); 
            rect.setAttribute('ry', 10);
            rect.classList.add('node-rect');
            rect.id = `node-${nodeData.id}`;
            svg.appendChild(rect);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', nodeData.x);
            text.setAttribute('y', nodeData.y);
            text.textContent = nodeData.label;
            text.classList.add('node-text');
            svg.appendChild(text);

            nodeMap.set(nodeData.id, { rect: rect, text: text, x: nodeData.x, y: nodeData.y });
        });

        paths.forEach((pathData, index) => {
            const fromNode = nodeMap.get(pathData.from);
            const toNode = nodeMap.get(pathData.to);

            if (fromNode && toNode) {

                let startX = fromNode.x;
                let startY = fromNode.y;
                let endX = toNode.x;
                let endY = toNode.y;

                if (startX < endX) startX += 75; 
                if (startX > endX) startX -= 75; 
                if (startY < endY) startY += 25; 
                if (startY > endY) startY -= 25; 

                if (endX < startX) endX += 75; 
                if (endX > startX) endX -= 75; 
                if (endY < startY) endY += 25; 
                if (endY > startY) endY -= 25; 

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', fromNode.x);
                line.setAttribute('y1', fromNode.y);
                line.setAttribute('x2', toNode.x);
                line.setAttribute('y2', toNode.y);
                line.classList.add('path-line');
                line.id = `path-${pathData.from}-${pathData.to}`;
                svg.appendChild(line);

                const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
                const arrowSize = 10;
                const arrowPoints = [
                    `${toNode.x - arrowSize * Math.cos(angle - Math.PI / 6)},${toNode.y - arrowSize * Math.sin(angle - Math.PI / 6)}`,
                    `${toNode.x},${toNode.y}`,
                    `${toNode.x - arrowSize * Math.cos(angle + Math.PI / 6)},${toNode.y - arrowSize * Math.sin(angle + Math.PI / 6)}`
                ].join(' ');
                arrow.setAttribute('points', arrowPoints);
                arrow.classList.add('path-arrow');
                svg.appendChild(arrow);
            }
        });

        let currentPathIndex = 0;
        const allPaths = document.querySelectorAll('#workflowSvg .path-line');
        const allArrows = document.querySelectorAll('#workflowSvg .path-arrow');

        function animateWorkflow() {

            if (currentPathIndex > 0) {
                allPaths[currentPathIndex - 1].style.stroke = 'rgba(255, 0, 255, 0.3)';
                allArrows[currentPathIndex - 1].style.fill = 'rgba(255, 0, 255, 0.3)';

                const prevPathFromNodeId = paths[currentPathIndex - 1].from;
                const prevNodeRect = nodeMap.get(prevPathFromNodeId)?.rect;
                if (prevNodeRect) {
                    prevNodeRect.style.animation = 'none';
                    prevNodeRect.style.filter = ''; 
                }
            }

            if (currentPathIndex < allPaths.length) {
                const currentPath = allPaths[currentPathIndex];
                const currentArrow = allArrows[currentPathIndex];
                currentPath.style.stroke = 'var(--primary-cyan)';
                currentArrow.style.fill = 'var(--primary-cyan)';
                currentPath.style.filter = 'drop-shadow(0 0 10px var(--primary-cyan))';
                currentArrow.style.filter = 'drop-shadow(0 0 10px var(--primary-cyan))';

                const currentPathFromNodeId = paths[currentPathIndex].from;
                const currentNodeRect = nodeMap.get(currentPathFromNodeId)?.rect;
                if (currentNodeRect) {
                    currentNodeRect.style.animation = 'nodePulse 1s ease-in-out infinite alternate';
                }

                currentPathIndex++;
            } else {

                currentPathIndex = 0;

                const lastNodeId = paths[paths.length - 1].to; 
                const lastNodeRect = nodeMap.get(lastNodeId)?.rect;
                if (lastNodeRect) {
                    lastNodeRect.style.animation = 'none';
                    lastNodeRect.style.filter = '';
                }
            }
        }

        workflowAnimationInterval = setInterval(animateWorkflow, 1500); 
        animateWorkflow(); 
    }

    function stopWorkflowOrchestration() {
        if (workflowAnimationInterval) {
            clearInterval(workflowAnimationInterval);
            workflowAnimationInterval = null;
        }

        document.querySelectorAll('#workflowSvg .node-rect').forEach(el => {
            el.style.animation = 'none';
            el.style.filter = '';
        });
        document.querySelectorAll('#workflowSvg .path-line').forEach(el => {
            el.style.stroke = 'rgba(255, 0, 255, 0.3)';
            el.style.filter = '';
        });
        document.querySelectorAll('#workflowSvg .path-arrow').forEach(el => {
            el.style.fill = 'rgba(255, 0, 255, 0.3)';
            el.style.filter = '';
        });
    }

    function switchSolution(solutionId) {

        solutionItems.forEach(item => item.classList.remove('active'));
        tabButtons.forEach(button => button.classList.remove('active'));

        stopDataAnalytics();
        stopImmersiveWorkspace();
        stopWorkflowOrchestration();

        document.getElementById(solutionId).classList.add('active');
        document.querySelector(`.solution-tab-button[data-solution="${solutionId}"]`).classList.add('active');

        if (solutionId === 'data-analytics') {
            initDataAnalytics();
        } else if (solutionId === 'immersive-workspace') {
            initImmersiveWorkspace();
        } else if (solutionId === 'workflow-orchestration') {
            initWorkflowOrchestration();
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const solutionId = button.dataset.solution;
            switchSolution(solutionId);
        });
    });

    switchSolution('data-analytics');
});