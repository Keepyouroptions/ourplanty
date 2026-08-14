// Footer year
var yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Mobile nav toggle
var toggle = document.querySelector('.nav-toggle');
var menu = document.getElementById('mobile-menu');

if (toggle && menu) {
  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when a link is tapped
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Highlight active nav link on scroll
var sections = document.querySelectorAll('main .section, .hero');
var navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(function (section) {
    if (section.id) observer.observe(section);
  });
}

// Copy email address to clipboard (Contact page)
var copyBtn = document.getElementById('copy-email-btn');
var emailDisplay = document.getElementById('email-display');
var copyFeedback = document.getElementById('copy-feedback');

if (copyBtn && emailDisplay) {
  copyBtn.addEventListener('click', function () {
    var email = emailDisplay.textContent.trim();

    function showCopied() {
      copyBtn.classList.add('copied');
      var label = copyBtn.querySelector('.copy-btn-label');
      if (label) label.textContent = 'Copied!';
      if (copyFeedback) copyFeedback.textContent = 'Email address copied to clipboard.';
      setTimeout(function () {
        copyBtn.classList.remove('copied');
        if (label) label.textContent = 'Copy';
        if (copyFeedback) copyFeedback.textContent = '';
      }, 2500);
    }

    function fallbackCopy() {
      // Fallback for browsers without Clipboard API (e.g. older Safari, non-HTTPS)
      var range = document.createRange();
      range.selectNodeContents(emailDisplay);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        document.execCommand('copy');
        showCopied();
      } catch (err) {
        if (copyFeedback) copyFeedback.textContent = 'Could not copy automatically — please select and copy the address above.';
      }
      selection.removeAllRanges();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showCopied, fallbackCopy);
    } else {
      fallbackCopy();
    }
  });
}

// Contact form: build a mailto link from the filled-in fields (static site, no backend)
var contactForm = document.getElementById('contact-form');
var formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('cf-name').value.trim();
    var email = document.getElementById('cf-email').value.trim();
    var membershipField = document.getElementById('cf-membership');
    var membership = membershipField ? membershipField.value : '';
    var subjectField = document.getElementById('cf-subject').value.trim();
    var message = document.getElementById('cf-message').value.trim();

    var subject = subjectField || (membership ? membership + ' membership inquiry' : ('Message from ' + (name || 'the Our Planty site')));
    var bodyLines = [];
    if (name) bodyLines.push('Name: ' + name);
    if (email) bodyLines.push('Email: ' + email);
    if (membership) bodyLines.push('Membership interest: ' + membership);
    bodyLines.push('');
    bodyLines.push(message);

    var mailtoUrl = 'mailto:hello@ourplanty.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(bodyLines.join('\n'));

    window.location.href = mailtoUrl;

    // JS has no way to detect whether an email app actually opened, so we
    // proactively surface the copy-email fallback right when Send is clicked
    // rather than assuming the visitor already read the note above.
    if (formStatus) {
      formStatus.innerHTML = 'If your email app didn\'t open, no problem — <a href="#email-info">copy hello@ourplanty.com</a> and send it from your webmail instead.';
    }
  });
}

// Briefly highlight the email card when a "copy the address" link jumps to it
// (event delegation, since one such link is inserted dynamically after form submit)
var emailInfoCard = document.getElementById('email-info');

if (emailInfoCard) {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href="#email-info"]');
    if (!link) return;
    emailInfoCard.classList.remove('highlight');
    // restart the animation even if it's already playing
    void emailInfoCard.offsetWidth;
    emailInfoCard.classList.add('highlight');
  });
}
