svg4everybody();

/* Меню мобильной и планшетной версии */
var pageHeader = document.querySelector('.page-header');
var menu = document.querySelector('.nav');
var menuList = document.querySelector('.nav__list');
var menuBtn = document.querySelector('.nav__switch');

pageHeader.classList.add('page-header--off');
menu.classList.add('nav--off');
menuList.classList.add('nav__list--off');
menuBtn.classList.remove('nav__switch--no-js');
menuBtn.classList.add('nav__switch--off');

menuBtn.addEventListener('click', function (evt) {
  evt.preventDefault();
  pageHeader.classList.toggle('page-header--off');
  menu.classList.toggle('nav--off');
  menuList.classList.toggle('nav__list--off');
  this.classList.toggle('nav__switch--off');
});


/* Переключение отзывов */
var reviews = document.querySelectorAll('.reviews__item');
if (reviews.length) {
  var reviewControls = document.querySelectorAll('.reviews__btn');
  var slidesShow = document.querySelectorAll('.slides__no-js');
  var currentSlide = 0;
  for (var i = 0; i < slidesShow.length; i++) {
    slidesShow[i].classList.remove('slides__no-js');
  }

  var reviewToggle = function (reviewId) {
    for (var i = 0; i < reviews.length; i++) {
      if (!reviews[i].classList.contains('slides__no-js')) {
        reviews[i].classList.add('slides__no-js');
      }
      if (reviewControls[i].classList.contains('slides__btn--active')) {
        reviewControls[i].classList.remove('slides__btn--active');
      }
    }
    reviews[reviewId].classList.remove('slides__no-js');
    reviewControls[reviewId].classList.add('slides__btn--active');
    currentSlide = reviewId;
  };
  reviewToggle(currentSlide);

  reviewControls[0].addEventListener('click', function() {
    reviewToggle(0);
  });
  reviewControls[1].addEventListener('click', function() {
    reviewToggle(1);
  });
  reviewControls[2].addEventListener('click', function() {
    reviewToggle(2);
  });

  var reviewPrev = document.querySelector('.reviews__nav--prev');
  var reviewNext = document.querySelector('.reviews__nav--next');
  reviewPrev.addEventListener('click', function() {
    var prevSlide = currentSlide - 1;
    if (prevSlide < 0) {
      prevSlide = reviews.length - 1;
    }
    reviewToggle(prevSlide);
  });
  reviewNext.addEventListener('click', function() {
    var nextSlide = currentSlide + 1;
    if (nextSlide == reviews.length) {
      nextSlide = 0;
    }
    reviewToggle(nextSlide);
  });
}


/** Интерактивная карта */
if (document.getElementById('map')) {
  ymaps.ready(init);
  function init() {
    var myMap = new ymaps.Map('map', {
      center: [59.93662, 30.3211],
      zoom: 16,
      controls: []
    });
    myMap.geoObjects.add(new ymaps.Placemark([59.93662, 30.3211], {
      hintContent: 'ул. Б. Конюшенная, д. 19/8'
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'img/icon-map-marker.svg',
      iconShadow: false,
      iconImageSize: [36, 36],
      iconImageOffset: [-18, 12]
    }));
    myMap.behaviors.disable('scrollZoom');
  }
}

/* Обработка форм */
var post = document.querySelector('.post');
if (post) {

  var modalSuccess = document.querySelector('.modal--success');
  var modalError = document.querySelector('.modal--error');
  var valFlag = false;

  modalSuccess.classList.add('modal--js');
  modalError.classList.add('modal--js');

  /* Прогрессивное улучшение формы (глючит в MS Edge и MSIE) */
  if (!document.documentMode && !/Edge/.test(navigator.userAgent)) {
    var postLastName = document.getElementById('last-name');
    var postFirstName = document.getElementById('first-name');
    var postMiddleName = document.getElementById('middle-name');
    var postMail = document.getElementById('email');

    postLastName.value = localStorage.getItem('last-name');
    postFirstName.value = localStorage.getItem('first-name');
    postMiddleName.value = localStorage.getItem('middle-name');
    if (!postLastName.value) {
      postLastName.focus();
    }
    else if (!postFirstName.value) {
      postFirstName.focus();
    }
    else {
      postMiddleName.focus();
    }

    var fielder = function(obj) {
      if (obj.classList.contains('post__field--invalid')) {
        obj.classList.remove('post__field--invalid');
      }
      valFlag = true;
      obj.value = obj.value.trim();
      if (obj.getAttribute.type == 'email') {
        if (!/.+@.+\..+/i.test(postMail.value)) {
          postMail.value = '';
        }
      }
      if (!obj.value) {
        obj.classList.add('post__field--invalid');
        valFlag = false;
      }
      else {
        localStorage.setItem(obj.getAttribute('id'), obj.value);
      }
    }

    postFirstName.addEventListener('blur', function(evt) {
      fielder(this);
    });
    postLastName.addEventListener('blur', function(evt) {
      fielder(this);
    });
    postMail.addEventListener('blur', function(evt) {
      fielder(this);
    });

    var postSubmit = document.querySelector('.post__btn');
    postSubmit.addEventListener('click', function(evt) {
      evt.preventDefault();
      if (valFlag) {
        modalSuccess.classList.add('modal--opened');
      }
      else {
        modalError.classList.add('modal--opened');
      }
    });


    var modalClose = function(obj) {
      if (obj.classList.contains('modal--opened')) {
        obj.classList.remove('modal--opened');
      }
    };

    var modalBtnSuccess = document.querySelector('.modal__btn--success');
    modalBtnSuccess.addEventListener('click', function(evt) {
      modalClose(modalSuccess);
    });
    modalBtnSuccess.addEventListener('keydown', function(evt) {
      if (evt.keyCode === 27) {
        modalClose(modalSuccess);
      }
    });

    var modalBtnError = document.querySelector('.modal__btn--error');
    modalBtnError.addEventListener('click', function(evt) {
      modalClose(modalError);
    });
    modalBtnError.addEventListener('keydown', function(evt) {
      if (evt.keyCode === 27) {
        modalClose(modalError);
      }
    });
  }
}
