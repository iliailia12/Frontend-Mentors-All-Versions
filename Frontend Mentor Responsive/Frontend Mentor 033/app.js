const labels = document.querySelectorAll('label')
const ratingArray = Array.from(labels)

function userValue(event) {
  ratingArray.forEach(label => {
    label.querySelector('span').classList.remove('ratingActive');
  });

  const span = event.currentTarget.querySelector('span');
  span.classList.add('ratingActive');
  
const userRating = document.querySelector('.selectionMessage div')
userRating.textContent = event.currentTarget.querySelector('input').value
}

for (let i=0; i<5; i++) {
    ratingArray[i].addEventListener('click', userValue)
}

function submitEvent(event) {
event.preventDefault()
ratingArray.forEach(label => {
  if (label.querySelector('span').classList.contains('ratingActive')) {
    document.querySelector('.rating').classList.add('hide')
  document.querySelector('.feedback').classList.remove('hide')
  }
}) 
}

document.querySelector('button').addEventListener('click', submitEvent)
