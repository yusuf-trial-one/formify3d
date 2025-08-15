// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Preselect category from query string on contact page
const params = new URLSearchParams(location.search);
const cat = params.get('category');
const select = document.getElementById('category');
if (cat && select) {
  const label = {
    fidgets: 'Fidgets',
    household: 'Household Accessories',
    custom: 'Custom Designs',
    protein: 'Protein Structures'
  }[cat];
  if (label) select.value = label;
}
