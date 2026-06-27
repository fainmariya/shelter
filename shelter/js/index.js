const body = document.body;
const html = document.documentElement;
const burger = document.querySelector('.burger');
const nav = document.querySelector('.navigation');
const overlay = document.querySelector('.menu-overlay');
const navLinks = document.querySelectorAll('.navigation__link');

const carouselTrack = document.querySelector('.pets__cards');
const prevButton = document.querySelector('.slider-btn--prev');
const nextButton = document.querySelector('.slider-btn--next');

const paginationFirstButton = document.querySelector('.pagination__btn--first');
const paginationPrevButton = document.querySelector('.pagination__btn--prev');
const paginationCurrentButton = document.querySelector('.pagination__btn--current');
const paginationNextButton = document.querySelector('.pagination__btn--next');
const paginationLastButton = document.querySelector('.pagination__btn--last');
const petsPageCards = document.querySelector('.pets__cards--page');

async function loadPets() {
  const response = await fetch('./pets.json');
  const pets = await response.json();
  return pets;
}

function shuffleArray(petsData) {
  const shuffledPetsData = [...petsData];

  for (let i = shuffledPetsData.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffledPetsData[i], shuffledPetsData[randomIndex]] = [
      shuffledPetsData[randomIndex],
      shuffledPetsData[i],
    ];
  }

  return shuffledPetsData;
}

if (carouselTrack && nextButton && prevButton) {
  
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


  nextButton.addEventListener('click',function(){
    switchCarousel('next');
  })
  prevButton.addEventListener('click',function(){
    switchCarousel('prev');
  })
  
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


function switchCarousel(direction) {
  if (isAnimating) {
    return;
  }

  isAnimating = true;

  const newGroup = getNextGroup(currentGroup, petsData);

  const moveClass =
    direction === 'next'
      ? 'pets__cards--move-left'
      : 'pets__cards--move-right';

  const fromClass =
    direction === 'next'
      ? 'pets__cards--from-right'
      : 'pets__cards--from-left';

  carouselTrack.classList.add(moveClass);

  setTimeout(function () {
    currentGroup = newGroup;
    renderGroup(currentGroup);

    carouselTrack.classList.remove(moveClass);
    carouselTrack.classList.add(fromClass);

    carouselTrack.offsetWidth;

    carouselTrack.classList.remove(fromClass);

    setTimeout(function () {
      isAnimating = false;
    }, 500);
  }, 500);
}
function handleResize() {
  const newGroupSize = getGroupSize();

  if (newGroupSize === groupSize) {
    return;
  }


  groupSize = newGroupSize;

  currentGroup = getNextGroup(currentGroup, petsData);

  renderGroup(currentGroup);
}

window.addEventListener('resize', handleResize);
}
let paginationPets = [];
let currentPage = 1;
let petsPerPage = getPetsPerPage();
let totalPages = 1;
let isPaginationAnimating = false;

if (petsPageCards) {
  
  initPagination();
  window.addEventListener('resize', handlePaginationResize);
  paginationNextButton.addEventListener('click', function () {
    goToPage(currentPage + 1);
  });

  paginationLastButton.addEventListener('click', function () {
    goToPage(totalPages);
  });

  paginationPrevButton.addEventListener('click', function () {
    goToPage(currentPage - 1);
  });

  paginationFirstButton.addEventListener('click', function () {
    goToPage(1);
  });
}


async function initPagination() {
  const petsData = await loadPets();
  
  paginationPets = createPaginationPets(petsData);
  petsPerPage = getPetsPerPage();
  totalPages = Math.ceil(paginationPets.length / petsPerPage);
 
  renderPaginationPage();
  const petsCount = countPetsByName(paginationPets);
  const hasDuplicates = hasAdjacentDuplicates(paginationPets);

  console.log('paginationPets length:', paginationPets.length);
  console.log('petsCount:', petsCount);
  console.log('has adjacent duplicates:', hasDuplicates);
  console.log('petsPerPage:', petsPerPage);
  console.log('totalPages:', totalPages);
  }
  function handlePaginationResize() {
    const newPetsPerPage = getPetsPerPage();
  
    if (newPetsPerPage === petsPerPage) {
      return;
    }
  
    petsPerPage = newPetsPerPage;
    totalPages = Math.ceil(paginationPets.length / petsPerPage);
  
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    renderPaginationPage();
    
  }
function createPaginationPets(petsData) {
  const paginationPets = [];

  for (let i = 0; i < 6; i++) {
    let shuffledPets = shuffleArray(petsData);

    while (
      paginationPets.length > 0 &&
      paginationPets[paginationPets.length - 1].name === shuffledPets[0].name
    ) {
      shuffledPets = shuffleArray(petsData);
    }

    paginationPets.push(...shuffledPets);
  }

  return paginationPets;
  }
  function getCurrentPagePets() {
    const startIndex = (currentPage - 1) * petsPerPage;
    const endIndex = startIndex + petsPerPage;
  
    return paginationPets.slice(startIndex, endIndex);
  }
  function countPetsByName(pets) {
    const count = {};
  
    pets.forEach(function (pet) {
      if (count[pet.name]) {
        count[pet.name] = count[pet.name] + 1;
      } else {
        count[pet.name] = 1;
      }
    });
  
    return count;
  }
  function renderPaginationPage() {
    const currentPets = getCurrentPagePets();
  
    petsPageCards.replaceChildren();
  
    currentPets.forEach(function (pet) {
      const card = document.createElement('div');
  
      card.classList.add('pets__card');
      card.setAttribute('data-pet-name', pet.name);
  
      card.innerHTML = `
        <img src="${pet.img}" alt="${pet.name}" class="slider-card-img">
        <span>${pet.name}</span>
        <button class="slider__btn" type="button">Learn more</button>
      `;
  
      petsPageCards.append(card);
      
    });
    updatePaginationControls();
  }
  function hasAdjacentDuplicates(pets) {
    for (let i = 0; i < pets.length - 1; i++) {
      if (pets[i].name === pets[i + 1].name) {
        return true;
      }
    }
  
    return false;
  }
  function getPetsPerPage() {
    const width = window.innerWidth;
    if (width >= 1280){
      return  8
  }  else if (width >= 768){
      return 6
  } 
      return  3
  
}
function updatePaginationControls() {
  paginationCurrentButton.textContent = currentPage;

  if (currentPage === 1) {
    paginationFirstButton.disabled = true;
    paginationPrevButton.disabled = true;

    paginationFirstButton.classList.add('pagination__btn--disabled');
    paginationPrevButton.classList.add('pagination__btn--disabled');
  } else {
    paginationFirstButton.disabled = false;
    paginationPrevButton.disabled = false;

    paginationFirstButton.classList.remove('pagination__btn--disabled');
    paginationPrevButton.classList.remove('pagination__btn--disabled');
  }

  if (currentPage === totalPages) {
    paginationNextButton.disabled = true;
    paginationLastButton.disabled = true;

    paginationNextButton.classList.add('pagination__btn--disabled');
    paginationLastButton.classList.add('pagination__btn--disabled');
  } else {
    paginationNextButton.disabled = false;
    paginationLastButton.disabled = false;

    paginationNextButton.classList.remove('pagination__btn--disabled');
    paginationLastButton.classList.remove('pagination__btn--disabled');
  }
}
function goToPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages) {
    return;
  }

  if (pageNumber === currentPage) {
    return;
  }

  if (isPaginationAnimating) {
    return;
  }

  isPaginationAnimating = true;

  petsPageCards.classList.add('pets__cards--page-fade');

  setTimeout(function () {
    currentPage = pageNumber;

    renderPaginationPage();

    petsPageCards.classList.remove('pets__cards--page-fade');

    setTimeout(function () {
      isPaginationAnimating = false;
    }, 300);
  }, 300);
}
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