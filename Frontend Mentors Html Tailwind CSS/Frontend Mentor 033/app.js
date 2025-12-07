      const labels = document.querySelectorAll('label');
      const ratingArray = Array.from(labels);

      function userValue(event) {
        ratingArray.forEach(label => {
          label.querySelector('span').classList.remove('ratingActive');
        });

        const span = event.currentTarget.querySelector('span');
        span.classList.add('ratingActive');

        const userRating = document.getElementById('selected-rating');
        userRating.textContent = event.currentTarget.querySelector('input').value;
      }

      ratingArray.forEach(label => {
        label.addEventListener('click', userValue);
      });

      function submitEvent(event) {
        event.preventDefault();
        const selected = document.querySelector('.ratingActive');
        if (selected) {
          document.querySelector('.rating').classList.add('hidden');
          document.querySelector('.feedback').classList.remove('hidden');
        }
      }

      document.querySelector('button').addEventListener('click', submitEvent);