const hamburger = document.querySelector('.navigation__hamburger');
const list = document.querySelector('.navigation__list');

hamburger.classList.remove('navigation__hamburger--no-js');
list.classList.remove('navigation--no-js');

hamburger.addEventListener('click', function (e) {
  hamburger.classList.toggle('navigation__hamburger--close');
  list.classList.toggle('navigation__list--shown');
});