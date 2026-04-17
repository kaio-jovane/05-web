/* ============================================================
   ECOVIDA — JAVASCRIPT
   Funcionalidades:
   1. Header com blur ao rolar
   2. Menu responsivo (hamburguer)
   3. Scroll reveal (IntersectionObserver)
   4. Botão voltar ao topo
   5. Link ativo na navegação
   6. Validação de formulário com feedback visual
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ======================
     1. HEADER SCROLL
     ====================== */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;

    /* Header: adiciona blur e fundo ao rolar */
    if (y > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    /* Botão voltar ao topo */
    if (backToTop) {
      if (y > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ======================
     2. MENU RESPONSIVO
     ====================== */
  const toggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navList.classList.toggle('open');
    });

    /* Fecha o menu ao clicar em um link */
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navList.classList.remove('open');
      });
    });

    /* Fecha o menu ao clicar fora */
    document.addEventListener('click', (e) => {
      if (!navList.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        navList.classList.remove('open');
      }
    });
  }


  /* ======================
     3. SCROLL REVEAL
     ====================== */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .stagger-children'
  );

  if (revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => observer.observe(el));
  }


  /* ======================
     4. VOLTAR AO TOPO
     ====================== */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ======================
     5. LINK ATIVO NA NAV
     ====================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });


  /* ======================
     6. VALIDAÇÃO DE FORMULÁRIO
     ====================== */
  const form = document.getElementById('contactForm');

  if (form) {
    /* Máscara de telefone */
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 6) {
          v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
        } else if (v.length > 2) {
          v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
        } else if (v.length > 0) {
          v = '(' + v;
        }
        e.target.value = v;
      });
    }

    /* Submit */
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const feedback = document.getElementById('formFeedback');
      const fields = {
        name: form.querySelector('#name'),
        email: form.querySelector('#email'),
        phone: form.querySelector('#phone'),
        subject: form.querySelector('#subject'),
        message: form.querySelector('#message')
      };

      /* Limpa estados de erro */
      Object.values(fields).forEach(f => {
        if (f) f.style.borderColor = '';
      });

      let errors = [];

      /* Validação: Nome (mínimo 2 caracteres) */
      if (!fields.name.value.trim() || fields.name.value.trim().length < 2) {
        errors.push('Nome é obrigatório (mínimo 2 caracteres).');
        fields.name.style.borderColor = '#DC3545';
      }

      /* Validação: Email */
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!fields.email.value.trim() || !emailRegex.test(fields.email.value)) {
        errors.push('Informe um e-mail válido.');
        fields.email.style.borderColor = '#DC3545';
      }

      /* Validação: Assunto */
      if (!fields.subject.value) {
        errors.push('Selecione um assunto.');
        fields.subject.style.borderColor = '#DC3545';
      }

      /* Validação: Mensagem (mínimo 10 caracteres) */
      if (!fields.message.value.trim() || fields.message.value.trim().length < 10) {
        errors.push('Mensagem deve ter ao menos 10 caracteres.');
        fields.message.style.borderColor = '#DC3545';
      }

      if (errors.length > 0) {
        if (feedback) {
          feedback.textContent = errors[0];
          feedback.className = 'form-feedback error';
        }
        return;
      }

      /* Sucesso */
      if (feedback) {
        feedback.textContent = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
        feedback.className = 'form-feedback success';
      }

      form.reset();

      /* Remove feedback após 5 segundos */
      setTimeout(() => {
        if (feedback) {
          feedback.textContent = '';
          feedback.className = '';
        }
      }, 5000);
    });
  }

});
