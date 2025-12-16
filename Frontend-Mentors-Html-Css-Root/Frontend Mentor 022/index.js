const testimonials = document.querySelectorAll('.testimonial');
let current = 0;

document.getElementById('next').addEventListener('click', () => {
  testimonials[current].classList.remove('active');
  current = (current + 1) % testimonials.length;
  testimonials[current].classList.add('active');
});

document.getElementById('prev').addEventListener('click', () => {
  testimonials[current].classList.remove('active');
  current = (current - 1 + testimonials.length) % testimonials.length;
  testimonials[current].classList.add('active');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    document.getElementById('next').click();
  } else if (e.key === 'ArrowLeft') {
    document.getElementById('prev').click();
  }
});