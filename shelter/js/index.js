const body = document.body;
const html = document.documentElement;
const burger = document.querySelector('.burger');
const nav = document.querySelector('.navigation');
const overlay = document.querySelector('.menu-overlay');
const navLinks = document.querySelectorAll('.navigation__link');

const carouselTrack = document.querySelector('.pets__cards');
const prevButton = document.querySelector('.slider-btn--prev');
const nextButton = document.querySelector('.slider-btn--next');



function openMenu() {
  burger.classList.add('burger--open');
  nav.classList.add('navigation--open');
  overlay.classList.add('menu-overlay--open');
  body.classList.add('no-scroll');
  html.classList.add('no-scroll');
}

function closeMenu() {
  burger.classList.remove('burger--open');
  nav.classList.remove('navigation--open');
  overlay.classList.remove('menu-overlay--open');
  body.classList.remove('no-scroll');
  html.classList.remove('no-scroll');
}

function toggleMenu() {
  const isMenuOpen = nav.classList.contains('navigation--open');

  if (isMenuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

burger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);

navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

async function loadPets() {
    const responce = await fetch('./pets.json');
    const pets = await responce.json();
    
    console.log('Pets from json:',pets)
    return pets;
}
let petsData = [];
let currentGroup = [];
let groupSize = 3;
let isAnimating = false;

function getGroupSize(){
    const width = window.innerWidth;
    
    if (width >= 1280){
        return  3
    }  else if (width >= 768){
        return 2
    } 
        return  1
    
}
async function initCarousel() {
    petsData = await loadPets();
    groupSize = getGroupSize();
    
   

    const shuffledPets = shuffleArray(petsData);
    currentGroup = shuffledPets.slice(0,groupSize);

    renderGroup(currentGroup);
  }

initCarousel()

function createPetCard(pet) {
    let imagePet = pet.img;
    let namePet = pet.name;
    return `
    <div class="pets__card" data-pet-name="${namePet}">
      <img src="${imagePet}" alt="${namePet}" class="slider-card-img">
      <span>${namePet}</span>
      <button class="slider__btn" type="button">Learn more</button>
    </div>
    `;
  }
  function renderGroup(pets) {
    const slider = document.querySelector('.pets__cards');
    slider.replaceChildren();
    
    pets.forEach(pet => {
      const card = document.createElement('div');
      card.classList.add('pets__card');
      card.setAttribute('data-pet-name', pet.name)

      card.innerHTML = `
        <img src="${pet.img}" alt="${pet.name}" class="slider-card-img">
        <span>${pet.name}</span>
        <button class="slider__btn" type="button">Learn more</button>
      `;

    slider.append(card);
  });
  }
  function shuffleArray(petsData){
    const shuffledPetsData = [...petsData]
    for (let i = shuffledPetsData.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
  
      [shuffledPetsData[i], shuffledPetsData[randomIndex]] = [shuffledPetsData[randomIndex], shuffledPetsData[i]];
    }
  
    return shuffledPetsData;
  }


  
  function createPetModal(pet){
    return `
    <div class="pet__container">
      <img src="${pet.img}" alt="${pet.name}" class="about__img">
      <h2>${pet.name}</h2>
      <h4>${pet.type}${pet.breed}</h2>
      <span>${pet.discription}</span>
      <ul>
        <li>Age:${pet.age}</li>
        <li>Inoculations: ${pet.inoculations}</li>
        <li>Diseases:${pet.diseases}</li>
        <li>Parasites:${pet.parasites}</li>
      </ul>
      <button class="slider__btn" type="button">Learn more</button>
    </div>
    `;
  
  }
  nextButton.addEventListener('click',function(){
    handleNextClick()
  })
  prevButton.addEventListener('click',function(){
    handlePrevClick()
  })
  
  function handlePrevClick() {
    console.log('prev')
  }

  function getNextGroup(currentGroup, petsData) {
    let currentPetsNames = currentGroup.map((pet) => pet.name);

    let newPetsData = petsData.filter(function(pet){
      if (currentPetsNames.includes(pet.name)){
        return false
        } else {
          return true
        } 
    })
    let newShufflePetsData = shuffleArray(newPetsData)
    let newNextPets = newShufflePetsData.slice(0,groupSize)
    return newNextPets;
  
  }
function handleNextClick() {
  
  const nextGroup = getNextGroup(currentGroup, petsData);
  currentGroup = nextGroup;
  renderGroup(currentGroup);
}
