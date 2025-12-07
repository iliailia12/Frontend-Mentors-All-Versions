    const tabButtons = document.querySelectorAll('.tab'); 
    const tabContents = document.querySelectorAll('.tab-content'); 
    const faqBtns = document.querySelectorAll('.faq-btn');
    const menu = document.querySelector('.menu');


    tabButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        tabContents[index].classList.add('active');
      });
    });

    faqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const answer = btn.parentElement.nextElementSibling; 
        answer.classList.toggle('active');
      });
    });

    function OpenMenu(){
      menu.style.display = "flex";
    }
    function CloseMenu(){
      menu.style.display = "none";
    }