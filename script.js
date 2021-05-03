// script.js
const img = new Image(); // used to load image from <input> and draw to canvas

const clr = document.querySelector('[type="reset"]');
const sub = document.querySelector('[type="submit"]');
const read = document.querySelector('[type="button"]');

const ttop = document.getElementById("text-top");
const tbot = document.getElementById("text-bottom");

const upl = document.getElementById("image-input");

var c = document.getElementById("user-image");

const ctx = c.getContext('2d');

ctx.font = "50px Arial";

const drop = document.getElementById("voice-selection");

drop.disabled = false;
drop.innerHTML = "";

var vcs = speechSynthesis.getVoices();
vcs.sort();

function startup() {
  

  var vcs = speechSynthesis.getVoices();

  for(let i = 0; i < vcs.length; i++) {
    
    var option = document.createElement('option');
    option.textContent = vcs[i].name + ' (' + vcs[i].lang + ')';

    if(vcs[i].default) {
      
      option.textContent += ' - default';
    }

    option.setAttribute('data-lang', vcs[i].lang);
    
    option.setAttribute('data-name', vcs[i].name);

    drop.appendChild(option);
  }

}

startup();

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', function() {

  ctx.clearRect(0, 0, c.width, c.height); 

  ctx.fillStyle = "#000000"; 
  ctx.fillRect(0, 0, c.width, c.height); 

  clr.disabled = true; 
  read.disabled = true; 
  sub.disabled = false; 

  ttop.value = ""; 
  tbot.value = ""; 

  let dims = getDimensions(c.width, c.height, img.width, img.height);
  
  ctx.scale(dims['width'] / img.width, dims['height'] / img.height);

  ctx.drawImage(img, dims["startX"], dims["startY"] * img.height / dims['height'])
  
  ctx.scale(img.width / dims['width'], img.height / dims['height']);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

upl.addEventListener('change', function() {

  let str = upl.value;

  str = str.substr(str.lastIndexOf("\\") + 1);

  img.alt = str;

  img.src = URL.createObjectURL(upl.files[0]);

});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
 function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

clr.addEventListener("click", function() {
  sub.disabled = false;

  ctx.clearRect(0, 0, c.width, c.height);

});

sub.addEventListener("click", function() {

  event.preventDefault();

  let textTop = ttop.value;
  let textBottom = tbot.value;

  ctx.textBaseline = 'middle';
  ctx.textAlign = "center";

  ctx.fillText(textTop, c.width * 0.5, 30);
  ctx.fillText(textBottom, c.width * 0.5, 370);
  

  clr.disabled = false;
  read.disabled = false;
  sub.disabled = true;
});

const slider = document.querySelector('[type="range"]');

read.addEventListener("click", function() {

  let voice = vcs[drop.selectedIndex];

  let utrT = new SpeechSynthesisUtterance(ttop.value);
  utrT.voice = voice;
  utrT.volume = slider.value / 100;
  
  let utrB = new SpeechSynthesisUtterance(tbot.value);
  utrB.voice = voice;
  utrB.volume = slider.value / 100;

  console.log(slider.value / 100);

  window.speechSynthesis.speak(utrT);
  window.speechSynthesis.speak(utrB);
});

var icon = document.getElementsByTagName("img")[0];

slider.addEventListener("input", function() {

  if (slider.value >= 67) {
    icon.src = "/icons/volume-level-3.svg";
  } else if (slider.value >= 34) {
    icon.src = "/icons/volume-level-2.svg";
  } else if (slider.value >= 1) {
    icon.src = "/icons/volume-level-1.svg";
  } else {
    icon.src = "/icons/volume-level-0.svg";
  }
});