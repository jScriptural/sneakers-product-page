"use strict";
//global variables;

let currentSlideIndex = 0;
const menuToggler = document.getElementById("togglerIcon");
const menuCloseIcon = document.getElementById("closeIcon");
const menu = document.querySelector(".navbar .collapse");
const carouselContainer = document.querySelector(".carousel-container");
const carousel = document.querySelector(".carousel");
const controls = document.querySelector(".controls");
const slides = document.querySelector(".slides");
const slideCollection = slides.children;
const thumbnails = document.querySelector(".thumbnails");
const nails = thumbnails.querySelectorAll(".thumbnail");
const quantityEvaluator = document.querySelector(".quantity");
const plusIcon = quantityEvaluator.querySelector(".plus");
const minusIcon = quantityEvaluator.querySelector(".minus");
const quantityDisplay = quantityEvaluator.querySelector(".item-count");
const navLinks = document.querySelectorAll(`a[class*="nav-link"]`);
const cartContainer = document.querySelector(".cart-container");
const notification = document.querySelector(".notification");
const itemsContainer = cartContainer.querySelector(".items-container");
const cartIcon = document.querySelector(".cart-icon");
const addToCart = document.querySelector(".add-to-cart");
const emptyCartMsg = cartContainer.querySelector(".empty-cart-msg");
const checkout = cartContainer.querySelector(".checkout");

//functionalities

cartIcon.addEventListener("click", event => {
	const hasItems = itemsContainer.children.length > 0;
	if (cartContainer.hidden) {
		cartContainer.hidden = false;
		cartContainer.classList.add("animation-grow");
	} else {
		cartContainer.classList.add("animation-shrink");
	}
	cartContainer.addEventListener("animationend", handleAnimationend);
	emptyCartMsg.hidden = hasItems;
	checkout.hidden = !hasItems;
});


menuToggler.addEventListener("click", function (event) {
	menu.style.display = "block";
	menu.classList.add("animation-slide-in-right");
});

menuCloseIcon.addEventListener("click", function (event) {
	menu.classList.add("animation-slide-out-left");
	menu.addEventListener("animationend", menuClose);
});


navLinks.forEach(link => {
	link.addEventListener("click", function (event) {
		const currentActiveLink = document.querySelector(".active");
		currentActiveLink.classList.remove("active");
		event.target.classList.add("active");
	});
});


controls.addEventListener("click", function (event) {
	const targetClassList = event.target.classList;
	if (targetClassList.contains("control-next")) {
		showNextSlide();
	} else if (targetClassList.contains("control-prev")) {
		showPreviousSlide();
	}
});


nails.forEach(nail => {
	nail.addEventListener("click", function (event) {
		thumbnails.querySelector(".active-thumbnail").classList.remove("active-thumbnail");
		this.classList.add("active-thumbnail");
		let src = this.dataset.src;
		let imgArr = Array.from(slideCollection);
		currentSlideIndex = imgArr.findIndex(item => new URL(item.firstElementChild.src).pathname === src);
		showSlide(currentSlideIndex);
	});
});


plusIcon.addEventListener("click", function (event) {
	quantityDisplay.textContent = parseInt(quantityDisplay.textContent) + 1;
});
minusIcon.addEventListener("click", function (event) {
	const currentQuantity = parseInt(quantityDisplay.textContent);
	if (currentQuantity > 0) {
		quantityDisplay.textContent =`${(currentQuantity - 1)}`;
	}
});


addToCart.addEventListener("click", function (event) {
	const productid = this.dataset.productid;
	let textContent = quantityDisplay.textContent;
	let quantity = parseInt(textContent);
	if (!(isFinite(textContent) && Number.isInteger(quantity) && quantity > 0)) {
		quantity = 0;
		quantityDisplay.textContent = "0";
	}
	const price = parseFloat(this.dataset.price);
	const cost = (price * quantity).toFixed(2);
	if (quantity > 0) {
		const itemToUpdate = Array.from(itemsContainer.children).find(item =>
			item.dataset.id === productid);
		if (itemToUpdate) itemToUpdate.remove();
		itemsContainer.insertAdjacentHTML("beforeend", `<div
	 	 data-quantity="${quantity}"  data-id="${productid}"  class="mb-2 row
	 	 align-center
	 	 justify-between">
	 	 <div class="col-xs-1" style="width:35px;"><img class="rounded-1"
	 	 src="${this.dataset.productimg}"></div>
	 	 <div class="row col-xs-9 justify-between align-center"><span class="col-xs-12
	 	 text-grayish-blue">${this.dataset.product}</span><span
	 	 class="text-grayish-blue">${"$" + price.toFixed(2)} x
	 	 ${quantity}  <i class="fw-700 text-black cost-price">${"$" + cost}</i></span></div>
	 	 <div  class="delete removeItem col-xs-1"><img class="w-50" src="./images/icon-delete.svg"></div>
	 	 </div>`);
		document.querySelectorAll(".removeItem").forEach(elem => {
			elem.addEventListener("click", removeItem);
		});
		updateNotification();
	}
	const hasItems = itemsContainer.children.length > 0;
	emptyCartMsg.hidden = hasItems;
	checkout.hidden = !hasItems;
});





//function declarations

function handleAnimationend(event) {
	if (cartContainer.classList.contains("animation-grow")) {
		cartContainer.classList.remove("animation-grow");
	} else if (cartContainer.classList.contains("animation-shrink")) {
		cartContainer.classList.remove("animation-shrink");
		cartContainer.hidden = true;
	}
	cartContainer.removeEventListener("animationend", handleAnimationend);
}

function menuClose(event) {
	menu.classList.remove("animation-slide-out-left", "animation-slide-in-right");
	menu.removeEventListener("animationend", menuClose);
	menu.style.display = "none";
}

function showSlide(index) {
	const slideWidth = slideCollection[currentSlideIndex].clientWidth;
	slides.style.transform = `translateX(-${slideWidth * index}px)`;
}
function showNextSlide() {
	currentSlideIndex = (currentSlideIndex + 1) % slideCollection.length;
	showSlide(currentSlideIndex);
}
function showPreviousSlide() {
	currentSlideIndex = ((currentSlideIndex - 1) % slideCollection.length);
	if (currentSlideIndex < 0) currentSlideIndex = 0;
	showSlide(currentSlideIndex);
}

function autoSlide() {
	setInterval(() => {
		currentSlideIndex = (currentSlideIndex + 1) % slideCollection.length;
		thumbnails.children[currentSlideIndex].dispatchEvent(new Event("click"));
	}, 10000);
}
autoSlide();

function removeItem(event) {
	let item = event.currentTarget.parentElement;
	item.remove();
	const hasItems = itemsContainer.children.length > 0;
	checkout.hidden = !hasItems;
	emptyCartMsg.hidden = hasItems;
	updateNotification();
}

function updateNotification() {
	let numOfItems = 0;
	//const len = itemsContainer.children.length;
	for (let child of itemsContainer.children) {
		const quantity = parseInt(child.dataset.quantity, 10);
		numOfItems += quantity;
	}
	notification.textContent = `${numOfItems}`;
	notification.hidden = !numOfItems;
}


