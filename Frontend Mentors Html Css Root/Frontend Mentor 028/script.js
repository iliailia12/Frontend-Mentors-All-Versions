const pricingData = [
  { pageviews: '10K', price: 8 },
  { pageviews: '50K', price: 12 },
  { pageviews: '100K', price: 16 },
  { pageviews: '500K', price: 24 },
  { pageviews: '1M', price: 36 }
];



const slider = document.getElementById('priceSlider');
const pageviewsElement = document.querySelector('.pageviews');
const priceElement = document.querySelector('.price');
const billingToggle = document.getElementById('billingToggle');



function init() {
  updatePricing();
  updateSliderBackground();

  
  slider.addEventListener('input', handleSliderChange);
  billingToggle.addEventListener('change', handleBillingToggle);
}



function handleSliderChange() {
  updatePricing();
  updateSliderBackground();
}



function handleBillingToggle() {
  updatePricing();
}


function updatePricing() {
  const sliderValue = parseInt(slider.value);
  const currentData = pricingData[sliderValue];
  const isYearly = billingToggle.checked;

  
  pageviewsElement.textContent = `${currentData.pageviews} pageviews`;

  
  let price = currentData.price;
  if (isYearly) {
    price = price * 0.75; 
  }

  
  priceElement.textContent = `$${price.toFixed(2)}`;
}


function updateSliderBackground() {
  const sliderValue = parseInt(slider.value);
  const percentage = (sliderValue / (slider.max - slider.min)) * 100;
  
  slider.style.background = `linear-gradient(to right, 
    hsl(174, 77%, 80%) 0%, 
    hsl(174, 77%, 80%) ${percentage}%, 
    hsl(224, 65%, 95%) ${percentage}%, 
    hsl(224, 65%, 95%) 100%)`;
}



document.addEventListener('DOMContentLoaded', init);