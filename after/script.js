// Configurações principais
const configuracoes = {
    velocidadeDigitacao: 100,
    offsetScroll: 80,
    duracaoAnimacao: 300
};

// Elementos principais do DOM
const elementos = {
    menuPrincipal: document.querySelector('.menu-principal'),
    linksMenu: document.querySelectorAll('.link-menu'),
    botaoMobile: document.querySelector('.botao-mobile'),
    listaNavegacao: document.querySelector('.lista-navegacao'),
    botaoChamada: document.querySelector('.botao-chamada'),
    textoDinamico: document.querySelector('.texto-dinamico'),
    botoesFiltro: document.querySelectorAll('.botao-filtro'),
    cartoesProj: document.querySelectorAll('.cartao-projeto'),
    formularioContato: document.querySelector('.formulario-contato'),
    notificacao: document.querySelector('.notificacao')
};

// Textos para efeito de digitação
const textosDigitacao = [
    'Desenvolvedor Web | Designer | Criador',
    'Especialista em React | Node.js | Python',
    'Apaixonado por UI/UX | Mobile | Backend',
    'Transformando ideias em realidade digital'
];

let indiceTextoAtual = 0;
let indiceCaractereAtual = 0;
let estaApagando = false;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
    configurarEventListeners();
    iniciarAnimacaoDigitacao();
    criarParticulas();
    configurarAnimacoesScroll();
});

// Função principal de inicialização
function inicializarApp() {
    document.body.classList.add('loaded');
    atualizarLinkAtivo();
    configurarAnimacoesFadeIn();
}

// Configurar todos os event listeners
function configurarEventListeners() {
    configurarNavegacao();
    
    if (elementos.botaoChamada) {
        elementos.botaoChamada.addEventListener('click', rolarParaSecao);
    }
    
    configurarFiltrosProjetos();
    configurarFormularioContato();
    configurarNotificacao();
    
    window.addEventListener('scroll', manipularScroll);
    window.addEventListener('resize', manipularRedimensionamento);
}

// Configurar sistema de navegação
function configurarNavegacao() {
    elementos.linksMenu.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const idDestino = this.getAttribute('href').substring(1);
            rolarParaSecao(idDestino);
            fecharMenuMobile();
        });
    });
    
    if (elementos.botaoMobile) {
        elementos.botaoMobile.addEventListener('click', alternarMenuMobile);
    }
    
    document.addEventListener('click', function(e) {
        if (!elementos.listaNavegacao.contains(e.target) && !elementos.botaoMobile.contains(e.target)) {
            fecharMenuMobile();
        }
    });
}

// Alternar menu mobile
function alternarMenuMobile() {
    elementos.botaoMobile.classList.toggle('active');
    elementos.listaNavegacao.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

// Fechar menu mobile
function fecharMenuMobile() {
    elementos.botaoMobile.classList.remove('active');
    elementos.listaNavegacao.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Rolar suavemente para seção
function rolarParaSecao(idDestino) {
    const elementoDestino = document.getElementById(idDestino);
    if (elementoDestino) {
        const posicaoTopo = elementoDestino.offsetTop - configuracoes.offsetScroll;
        window.scrollTo({
            top: posicaoTopo,
            behavior: 'smooth'
        });
    }
}

// Atualizar link ativo na navegação
function atualizarLinkAtivo() {
    const secoes = document.querySelectorAll('section[id]');
    const posicaoScroll = window.scrollY + configuracoes.offsetScroll;
    
    secoes.forEach(secao => {
        const topoSecao = secao.offsetTop;
        const alturaSecao = secao.offsetHeight;
        const idSecao = secao.getAttribute('id');
        const linkNav = document.querySelector(`.link-menu[href="#${idSecao}"]`);
        
        if (posicaoScroll >= topoSecao && posicaoScroll < topoSecao + alturaSecao) {
            elementos.linksMenu.forEach(link => link.classList.remove('ativo'));
            if (linkNav) {
                linkNav.classList.add('ativo');
            }
        }
    });
}

// Configurar filtros de projetos
function configurarFiltrosProjetos() {
    elementos.botoesFiltro.forEach(botao => {
        botao.addEventListener('click', function() {
            const filtro = this.getAttribute('data-filter');
            
            elementos.botoesFiltro.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');
            
            filtrarProjetos(filtro);
        });
    });
}

// Filtrar projetos por categoria
function filtrarProjetos(filtro) {
    elementos.cartoesProj.forEach(cartao => {
        const categoria = cartao.getAttribute('data-category');
        
        if (filtro === 'all' || categoria === filtro) {
            cartao.style.display = 'block';
            cartao.style.animation = 'aparecerSuave 0.5s ease forwards';
        } else {
            cartao.style.display = 'none';
        }
    });
}

// Configurar formulário de contato
function configurarFormularioContato() {
    if (elementos.formularioContato) {
        elementos.formularioContato.addEventListener('submit', function(e) {
            e.preventDefault();
            processarEnvioFormulario(this);
        });
    }
}

// Processar envio do formulário
function processarEnvioFormulario(formulario) {
    const dadosFormulario = new FormData(formulario);
    const dados = Object.fromEntries(dadosFormulario);
    
    mostrarNotificacao('Mensagem enviada com sucesso!', 'sucesso');
    formulario.reset();
}

// Configurar sistema de notificação
function configurarNotificacao() {
    if (elementos.notificacao) {
        elementos.notificacao.addEventListener('click', function() {
            mostrarNotificacao('Você tem uma nova mensagem!', 'info');
        });
    }
}

// Mostrar notificação toast
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `toast-notificacao ${tipo}`;
    notificacao.textContent = mensagem;
    
    Object.assign(notificacao.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: tipo === 'sucesso' ? '#27ae60' : tipo === 'erro' ? '#e74c3c' : '#3498db',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notificacao.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}

// Animação de digitação dinâmica
function iniciarAnimacaoDigitacao() {
    if (!elementos.textoDinamico) return;
    
    function digitarTexto() {
        const textoAtual = textosDigitacao[indiceTextoAtual];
        
        if (estaApagando) {
            elementos.textoDinamico.textContent = textoAtual.substring(0, indiceCaractereAtual - 1);
            indiceCaractereAtual--;
        } else {
            elementos.textoDinamico.textContent = textoAtual.substring(0, indiceCaractereAtual + 1);
            indiceCaractereAtual++;
        }
        
        let velocidadeDigitacao = configuracoes.velocidadeDigitacao;
        
        if (estaApagando) {
            velocidadeDigitacao /= 2;
        }
        
        if (!estaApagando && indiceCaractereAtual === textoAtual.length) {
            velocidadeDigitacao = 2000;
            estaApagando = true;
        } else if (estaApagando && indiceCaractereAtual === 0) {
            estaApagando = false;
            indiceTextoAtual = (indiceTextoAtual + 1) % textosDigitacao.length;
            velocidadeDigitacao = 500;
        }
        
        setTimeout(digitarTexto, velocidadeDigitacao);
    }
    
    digitarTexto();
}

// Configurar animações de scroll
function configurarAnimacoesScroll() {
    const opcoesObservador = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
            }
        });
    }, opcoesObservador);
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observador.observe(el);
    });
}

// Configurar animações de fade-in
function configurarAnimacoesFadeIn() {
    const elementosParaAnimar = [
        '.conteudo-apresentacao',
        '.imagem-perfil',
        '.conteudo-sobre',
        '.grade-projetos',
        '.conteudo-contato'
    ];
    
    elementosParaAnimar.forEach(seletor => {
        const elementos = document.querySelectorAll(seletor);
        elementos.forEach(el => {
            el.classList.add('fade-in');
        });
    });
}

// Criar sistema de partículas
function criarParticulas() {
    const containerParticulas = document.createElement('div');
    containerParticulas.className = 'particles';
    document.body.appendChild(containerParticulas);
    
    function criarParticula() {
        const particula = document.createElement('div');
        particula.className = 'particle';
        
        particula.style.left = Math.random() * 100 + '%';
        particula.style.width = Math.random() * 4 + 2 + 'px';
        particula.style.height = particula.style.width;
        particula.style.animationDuration = Math.random() * 10 + 5 + 's';
        
        containerParticulas.appendChild(particula);
        
        setTimeout(() => {
            if (particula.parentNode) {
                particula.parentNode.removeChild(particula);
            }
        }, 15000);
    }
    
    setInterval(criarParticula, 2000);
}

// Manipular eventos de scroll
function manipularScroll() {
    if (window.scrollY > 100) {
        elementos.menuPrincipal.classList.add('scrolled');
    } else {
        elementos.menuPrincipal.classList.remove('scrolled');
    }
    
    atualizarLinkAtivo();
    animarNoScroll();
}

// Animar elementos durante o scroll
function animarNoScroll() {
    const elementos = document.querySelectorAll('.fade-in');
    const alturaJanela = window.innerHeight;
    
    elementos.forEach(elemento => {
        const topoElemento = elemento.getBoundingClientRect().top;
        const elementoVisivel = 150;
        
        if (topoElemento < alturaJanela - elementoVisivel) {
            elemento.classList.add('visible');
        }
    });
}

// Manipular redimensionamento da janela
function manipularRedimensionamento() {
    if (window.innerWidth > 768) {
        fecharMenuMobile();
    }
}

// Configurar efeitos hover para cartões de projeto
function configurarHoverCartoes() {
    elementos.cartoesProj.forEach(cartao => {
        cartao.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        cartao.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Configurar efeito parallax
function configurarParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const elementosParallax = document.querySelectorAll('.parallax');
        
        elementosParallax.forEach(elemento => {
            const velocidade = elemento.dataset.speed || 0.5;
            elemento.style.transform = `translateY(${scrolled * velocidade}px)`;
        });
    });
}

// Animar contadores de estatísticas
function animarContadores() {
    const contadores = document.querySelectorAll('.item-estatistica h3');
    
    contadores.forEach(contador => {
        const valorFinal = parseInt(contador.textContent);
        const incremento = valorFinal / 100;
        let valorAtual = 0;
        
        const atualizarContador = () => {
            if (valorAtual < valorFinal) {
                valorAtual += incremento;
                contador.textContent = Math.ceil(valorAtual);
                requestAnimationFrame(atualizarContador);
            } else {
                contador.textContent = valorFinal;
            }
        };
        
        atualizarContador();
    }
}

// Configurar observador para contadores
function configurarObservadorContadores() {
    const secaoContadores = document.querySelector('.estatisticas-sobre');
    if (!secaoContadores) return;
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                animarContadores();
                observador.unobserve(entrada.target);
            }
        });
    });
    
    observador.observe(secaoContadores);
}

// Inicializar efeitos adicionais
document.addEventListener('DOMContentLoaded', function() {
    configurarHoverCartoes();
    configurarParallax();
    configurarObservadorContadores();
});

// Utilitários auxiliares
const utilitarios = {
    debounce: function(funcao, espera) {
        let timeout;
        return function funcaoExecutada(...args) {
            const depois = () => {
                clearTimeout(timeout);
                funcao(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(depois, espera);
        };
    },
    
    throttle: function(funcao, limite) {
        let emThrottle;
        return function() {
            const args = arguments;
            const contexto = this;
            if (!emThrottle) {
                funcao.apply(contexto, args);
                emThrottle = true;
                setTimeout(() => emThrottle = false, limite);
            }
        };
    },
    
    elementoVisivel: function(elemento) {
        const rect = elemento.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    rolarSuave: function(destino, duracao = 1000) {
        const inicio = window.pageYOffset;
        const distancia = destino - inicio;
        let tempoInicio = null;
        
        function animacao(tempoAtual) {
            if (tempoInicio === null) tempoInicio = tempoAtual;
            const tempoDecorrido = tempoAtual - tempoInicio;
            const progresso = Math.min(tempoDecorrido / duracao, 1);
            
            window.scrollTo(0, inicio + distancia * easeInOutCubic(progresso));
            
            if (tempoDecorrido < duracao) {
                requestAnimationFrame(animacao);
            }
        }
        
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        
        requestAnimationFrame(animacao);
    }
};

// Configurações de performance
const performance = {
    otimizarScroll: utilitarios.throttle(manipularScroll, 16),
    otimizarResize: utilitarios.debounce(manipularRedimensionamento, 250)
};

// Substituir event listeners por versões otimizadas
window.removeEventListener('scroll', manipularScroll);
window.removeEventListener('resize', manipularRedimensionamento);
window.addEventListener('scroll', performance.otimizarScroll);
window.addEventListener('resize', performance.otimizarResize);

// Configurações de acessibilidade
function configurarAcessibilidade() {
    // Adicionar suporte a navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharMenuMobile();
        }
    });
    
    // Melhorar foco para elementos interativos
    const elementosInterativos = document.querySelectorAll('button, a, input, textarea');
    elementosInterativos.forEach(elemento => {
        elemento.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--accent-color)';
            this.style.outlineOffset = '2px';
        });
        
        elemento.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Inicializar acessibilidade
document.addEventListener('DOMContentLoaded', configurarAcessibilidade);
