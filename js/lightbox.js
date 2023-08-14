//Global variables
let currentSlideIndex = 0;
const primaryCarousel = document.getElementById("primaryCarousel");
const lightbox = document.getElementById("lightbox");
const closeIcon = lightbox.querySelector(".close-icon");
const controls = lightbox.querySelector(".controls");
const slides = lightbox.querySelector(".slides");
const slideCollection = slides.children;
const thumbnails = lightbox.querySelector(".thumbnails");
const nails = thumbnails.querySelectorAll(".thumbnail");

primaryCarousel.addEventListener("click", function (event) {
	lightbox.style.display = "flex";
});

closeIcon.addEventListener("click", function (event) {
	lightbox.style.display = "none";
});


controls.addEventListener("click", function (event) {
	const targetClassList = event.target.classList;
	if (targetClassList.contains("control-next")) {
		showNextSlide();
		thumbnails.children[currentSlideIndex].dispatchEvent(new Event("click"));
	} else if (targetClassList.contains("control-prev")) {
		showPreviousSlide();
		thumbnails.children[currentSlideIndex].dispatchEvent(new Event("click"));
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





//functions declarations

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
//uncomment below to enable auto slide
//autoSlide();



