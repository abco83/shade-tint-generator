'use strict';

//declarations
const buttons = document.querySelectorAll('.sample');
const hexElBut = document.getElementById('hexsubmit');
const rgbElBut = document.getElementById('rgbsubmit');
const colorpElBut = document.getElementById('colorpicker');
const hexEl = document.getElementById('hex');
const collerPEl = document.getElementById('color-picker-input');
const rgbEl = document.querySelectorAll('.rgb-input');
const colorUpdaterEl = document.querySelector('.colorupdater');
const randomEl = document.querySelector('.random');
const kleurTypeEl = document.forms['radio'].elements['kleur'];
const voorbeeldigEl = document.querySelector('.voorbeelig');
const clickTroughEl = document.querySelector('.click-trough');
const negatievenEl = document.querySelector('.show-boxes');
const exsample = document.querySelectorAll('.exsample');
const toggleTxetEl = document.querySelector('.toggle-text');
const borderEl = document.forms['radio-border'].elements['kleur-border'];
const beeldEl = document.getElementById('beeld');
const gotitEl = document.querySelectorAll('.got-it');

// declarations variables
let outOfRange, activeColors, colortrue, brighertrue;
let textColor = 'optie1';
let borderColor = 'optie2';
let negtiveHex = false;
let everyClick = false;
let clicked = -1;

// make a random color
function rand() {
  let randhex = Math.floor(Math.random() * 16777215).toString(16);
  while (randhex.length < 6) {
    randhex = '0' + randhex;
  }
  return randhex;
}

/////////////////////////////////////////
// Handle the different type of colors //
/////////////////////////////////////////

// go from 3 digit hex to 6 digit hex
function dubbleUp(hex) {
  let color = '#';
  for (let i = 0; i < hex.length; i++) {
    if (hex[i] !== '#') {
      color += hex[i] + hex[i];
    }
  }
  return color;
}

// convert to Red Green Blue (rgb values)

function rgbify(color) {
  if (color.length < 6) {
    color = dubbleUp(color);
  }
  const [red, green, blue] = [
    parseInt(color.slice(-6, -4), 16),
    parseInt(color.slice(-4, -2), 16),
    parseInt(color.slice(-2), 16),
  ];
  return [red, green, blue];
}

// convert a array of rgb single values to hex in to a new array
function hexify(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push(Math.round(arr[i]).toString(16));
    //add a 0 before numbers newArr didgets
    if (newArr[i].length === 1) newArr[i] = '0' + newArr[i];
  }
  return newArr;
}
// template litaral for hexifying a rgb
function hexifyOne(rgb) {
  return `#${hexify([rgb[0]])[0]}${hexify([rgb[1]])[0]}${hexify([rgb[2]])[0]}`;
}
// negative value for single rgb value
function negatify(color) {
  return 255 - color;
}

// negative value for rgb value in with templete sting return
function negitifyTriple(color) {
  return `rgb(${negatify([color[0]])},${negatify([color[1]])},${negatify([
    color[2],
  ])})`;
}
// negative vaule for rgb value  in array
function negitifyTripleTwo(color) {
  return [negatify([color[0]]), negatify([color[1]]), negatify([color[2]])];
}

// merge the rgb values with decimals
function merge(arr, value) {
  return [arr[value], arr[value + 22], arr[value + 44]];
}

//Main porgram calculate all the shades/tintes
function shades(rgb) {
  let grayColors, brighterColors;
  let singleRgb = [];
  let color = [];
  let brighter = [];
  outOfRange = [];
  let num;
  // if clicked trough get the ture values back with
  if (clicked >= 22) {
    rgb = merge(brighertrue, clicked - 22);
  } else if (clicked >= 0) {
    rgb = merge(colortrue, clicked);
  }
  clicked = -1;
  console.log(rgb);
  for (let i = 0; i < rgb.length; i++) {
    negtiveHex ? (num = negatify(rgb[i])) : (num = rgb[i]); //negative numbers or normal numbers
    singleRgb.push(num, num - 255); // store the postive and negive value of rgb
  } // create the (lighter / darker)
  for (let i = 0; i < singleRgb.length; i++) {
    for (let j = 0; j < 11; j++) {
      let num = singleRgb[i] * (10 - j) * 0.1; //start with 100% of base (numofBase)
      if (i % 2 === 1) {
        num += 255;
      } // add 255 to the num for the ones it was subtracted from before
      color.push(num); //create brigher colors (numOfBase - num + numOfBase)
      num = color[i * 11] * 2 - num; //adds the diffence form the color with base back to the base color
      if (num < 0) {
        num = 0;
        if (!outOfRange.includes((i * 11 + j) % 22)) {
          outOfRange.push((i * 11 + j) % 22);
        } // check it it's a true color or updated, this determins the boxes with a border
      } else if (num > 255) {
        num = 255;
        if (!outOfRange.includes((i * 11 + j) % 22)) {
          outOfRange.push((i * 11 + j) % 22);
        }
      }
      brighter.push(num); // add the new values to the array
    }
  }
  colortrue = [...color];
  brighertrue = [...brighter];
  color = hexify(color);
  brighter = hexify(brighter);
  // combine the single hex digits
  grayColors = [];
  brighterColors = [];
  for (let i = 0; i < color.length / 3; i++) {
    grayColors.push(`#${color[i]}${color[i + 22]}${color[i + 44]}`);
    brighterColors.push(
      `#${brighter[i]}${brighter[i + 22]}${brighter[i + 44]}`
    );
  }
  return [...grayColors, ...brighterColors];
}

/////////////////////////////////////////
///////// other colors handling /////////
/////////////////////////////////////////

//text color for black or white,text or bordor
function blackOrWhite(color) {
  const rgb = rgbify(color);
  return rgb[0] + rgb[1] + rgb[2] < 383 ? true : false; //255*3/2 (+0.5)
}
// make the text color
const ColorSet = function (color, types, list) {
  if (types === 'optie1') {
    // black or white
    return blackOrWhite(color) ? '#efefef' : '#101010';
  } else if (types == 'optie2') {
    // negative coloring
    for (let i = 0; i < list.length; i++) {
      let rgb = rgbify(color);
      return negitifyTriple(rgb);
    } // background color
  } else if (types === 'optie3') {
    return color;
  }
};

// only change text color
function updateTextColor() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.color = ColorSet(activeColors[i], textColor, activeColors);
  }
  for (let i = 0; i < exsample.length; i++) {
    exsample[i].style.color = ColorSet(newColors[i], textColor, newColors);
  }
}

// only change border color
function updateBorderColor() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.borderColor = ColorSet(
      activeColors[i],
      borderColor,
      activeColors
    );
  }
}
/////////////////////////////////////////
///////////////  Set-up  ////////////////
/////////////////////////////////////////

// border the out of range colors, this are the brighter who had 0< or >255
function outOfRangeBorder() {
  for (let i = 22; i < buttons.length; i++) {
    buttons[i].classList.remove('tempert');
    if (outOfRange.includes(i - 22)) {
      buttons[i].classList.add('tempert');
      buttons[i].style.borderColor = ColorSet(
        activeColors[i],
        borderColor,
        activeColors
      );
    }
  }
}

// prevention for wrong inputs from hex box
function fixHex(hex) {
  if (hex.length > 32) {
    hex = hex.slice(-32);
  }
  let k = hex.split(/\W/g);
  if (k.length > 2 && typeof k === 'object') {
    let l = [];
    for (let i = 0; i < k.length; i++) {
      if (Number(k[i]) >= 0 && Number(k[i]) <= 255 && k[i] !== '') {
        l.push(Number(k[i]));
      }
    }
    if (l.length > 2) {
      return hexifyOne(l);
    }
  } // check if it's possible to make a hex form input
  let j = hex.split(/[/g-zG-Z]/).join('');
  k = j.replace(/\W/g, '');
  let l = '#';
  if (k.length < 6 && k.length >= 3) {
    return dubbleUp(k.slice(-3));
  } else if (k.length >= 6) {
    return (l += k.slice(-6));
  } else {
    return false;
  }
}

// used to update the values of the inpunt boxus form a hex code (this won't get triggerd to dubbleUp a 3 digits hex)
function hexUpdate() {
  const j = fixHex(hexEl.value);
  if (j && !j.includes(NaN)) {
    setUpColors(j);
    const rgb = rgbify(j);
    [rgbEl[0].value, rgbEl[1].value, rgbEl[2].value] = [rgb[0], rgb[1], rgb[2]];
    collerPEl.value = j;
  }
}

// update the hex value box (this will trigger a 3 digits hex to dubbleUp)
function hexUp(hex) {
  hex = fixHex(hex);
  hexEl.value = hex;
  hexUpdate();
}

// main functions it set up the color visualisation
// set up from hex-code
function setUpColors(color) {
  const rgb = rgbify(color);
  setUpColorsFromRGB(rgb);
}
// set up from RGB
function setUpColorsFromRGB(rgb) {
  if (!rgb.includes(NaN)) {
    activeColors = shades(rgb);
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.backgroundColor = activeColors[i];
      buttons[i].innerHTML = activeColors[i];
      buttons[i].style.color = ColorSet(
        activeColors[i],
        textColor,
        activeColors
      );
    }
    outOfRangeBorder();
  }
}

/////////////////////////////////////////
///////////     inputs   ////////////////
/////////////////////////////////////////

// used for update from rgb input boxes
function rgbUpdate() {
  const rgbColor = [
    Number(rgbEl[0].value),
    Number(rgbEl[1].value),
    Number(rgbEl[2].value),
  ];
  for (let i = 0; i < rgbColor.length; i++) {
    rgbColor[i] < 0 ? (rgbColor[i] *= -1) : rgbColor[i];
    rgbColor[i] > 255 ? (rgbColor[i] = rgbColor[i] % 255) : rgbColor[i];
  }
  setUpColorsFromRGB(rgbColor);
  hexEl.value = hexifyOne(rgbColor);
  collerPEl.value = hexifyOne(rgbColor);
  return rgbColor;
}
// used for update from ColorPicker
function colorPickerUpdate() {
  const rgb = rgbify(collerPEl.value);
  [rgbEl[0].value, rgbEl[1].value, rgbEl[2].value] = [rgb[0], rgb[1], rgb[2]];
  hexEl.value = collerPEl.value;
  setUpColors(collerPEl.value);
}

/////////////////////////////////////////
////////////// Exsamples  ///////////////
/////////////////////////////////////////

// color themes

// colors from https://flatuicolors.com/palette/nl
const nlColorTheme = [
  '#FFC312', //sunflower
  '#C4E538', //energos
  '#12CBC4', //blue martina
  '#FDA7DF', //lavender rose
  '#ED4C67', //bara red
  '#F79F1F', //radiant yellow
  '#A3CB38', //android green
  '#1289A7', //mediterranean sea
  '#D980FA', //lavender tea
  '#B53471', //very berry
  '#EE5A24', //puffins bill
  '#009432', //pixelated grass
  '#0652DD', //merchant marine blue
  '#9980FA', //forgotten purple
  '#833471', //hollyhock
  '#EA2027', //red pigment
  '#006266', //turkish aqua
  '#1B1464', //20000 leagues under the sea
  '#5758BB', //circumorsital ring
  '#6F1E51', //magenta purple
];

// #6 from https://yeun.github.io/open-color/ , brown and true pastels

const openColors = [
  '#fa5252',
  '#fd7e14',
  '#fab005',
  '#40c057',
  '#228be6',
  '#862e9c',
  '#e64980',
  '#864d53',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#15aabf',
  '#20c997',
  '#94d82d',
  '#cad7e7',
  '#cae7d7',
  '#d7cae7',
  '#d7e7ca',
  '#e7cad7',
  '#e7d7ca',
];

let newColors = openColors;

// pre button setup
function exsampleColors(schema) {
  for (let i = 0; i < schema.length; i++) {
    exsample[i].style.backgroundColor = schema[i];
    exsample[i].innerHTML = schema[i];
    exsample[i].style.color = ColorSet(schema[i], textColor, schema);
    exsample[i].addEventListener('click', () => {
      navigator.clipboard.writeText(schema[i]);
      hexUp(schema[i]);
    });
  }
}

/////////////////////////////////////////
///////////  eventlistners //////////////
/////////////////////////////////////////
// for all the boxes

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    navigator.clipboard.writeText(activeColors[i]);
    if (everyClick) {
      clicked = i;
      hexUp(activeColors[i]);
    }
  });
}

// eventListners color picker
function noLooping() {
  colorPickerUpdate();
  collerPEl.removeEventListener('change', noLooping);
}
collerPEl.addEventListener('click', () => {
  collerPEl.addEventListener('change', noLooping);
});
collerPEl.addEventListener('mouseout', colorPickerUpdate);

//eventlisteners hex box

hexEl.addEventListener('keyup', hexUpdate);
hexEl.addEventListener('paste', hexUpdate);

//eventlistenrs for RGB boxes

for (let i = 0; i < rgbEl.length; i++) {
  rgbEl[i].addEventListener('mouseenter', () => {
    rgbEl[i].addEventListener('change', rgbUpdate);
  });
}
for (let i = 0; i < rgbEl.length; i++) {
  rgbEl[i].addEventListener('mouseout', () => {
    rgbEl[i].removeEventListener('change', rgbUpdate);
  });
}

for (let i = 0; i < rgbEl.length; i++) {
  rgbEl[i].addEventListener('keyup', rgbUpdate);
  rgbEl[i].addEventListener('paste', rgbUpdate);
}

///////// button clicks event listners

// get HEX button
hexElBut.addEventListener('click', e => {
  e.preventDefault();
  const j = fixHex(hexEl.value);
  if (j) {
    hexUp(j);
    navigator.clipboard.writeText(j);
  }
});
// get RGB button
rgbElBut.addEventListener('click', e => {
  e.preventDefault();
  const rgb = rgbUpdate();
  [rgbEl[0].value, rgbEl[1].value, rgbEl[2].value] = [rgb[0], rgb[1], rgb[2]];
  navigator.clipboard.writeText(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
});
// get (colorpicker)
colorpElBut.addEventListener('click', e => {
  e.preventDefault();
  colorPickerUpdate(collerPEl.value);
  navigator.clipboard.writeText(collerPEl.value);
});
// Random button
randomEl.addEventListener('click', e => {
  e.preventDefault();
  hexUp(rand());
});
// switch beteween color scema
beeldEl.addEventListener('change', () => {
  switch (beeldEl.selectedIndex) {
    case 0:
      newColors = openColors;
      break;
    case 1:
      newColors = nlColorTheme;
      break;
    default:
      newColors = openColors;
  }
  exsampleColors(newColors);
});

// text color, boxes, radio options
for (let i = 0; i < kleurTypeEl.length; i++) {
  kleurTypeEl[i].addEventListener('click', () => {
    textColor = kleurTypeEl.value;
    updateTextColor();
  });
}
//toggle voorbeeld
voorbeeldigEl.addEventListener('change', () => {
  voorbeeldigEl.checked
    ? document.body.classList.add('voorbeelden')
    : document.body.classList.remove('voorbeelden');
  exsampleColors(newColors);
});
//toggle negatief box colors
negatievenEl.addEventListener('change', () => {
  if (negatievenEl.checked) {
    negtiveHex = true;
    setUpColors(activeColors[0]);
  } else {
    setUpColors(activeColors[0]);
    negtiveHex = false;
  }
});
//toggle update form the shades/tints boxes
clickTroughEl.addEventListener('change', () => {
  clickTroughEl.checked ? (everyClick = true) : (everyClick = false);
});

// border color, not true colors ,boxes radio options
for (let i = 0; i < borderEl.length; i++) {
  borderEl[i].addEventListener('click', () => {
    borderColor = borderEl.value;
    updateBorderColor();
  });
}

//toggle the Dutch meaning
toggleTxetEl.addEventListener('change', () => {
  if (toggleTxetEl.checked) {
    document.body.classList.remove('eng', 'end');
    document.body.classList.add('nl', 'ned');
  } else {
    {
      document.body.classList.remove('nl', 'ned');
      document.body.classList.add('eng', 'end');
    }
  }
  exsampleColors(newColors);
});

// hide the about box
for (let i = 0; i < gotitEl.length; i++) {
  gotitEl[i].addEventListener('click', () => {
    document.body.classList.remove('ned', 'end');
  });
}

//cause first impressions count...
function cpInt() {
  document.body.classList.add('voorbeelden', 'eng', 'end');
  // toggleTxetEl.setAttribute('checked', false);
  voorbeeldigEl.setAttribute('checked', true);
  exsampleColors(newColors);
}
cpInt();
// refresh every 8 sec till 1 click was made
let refreshIntervalId = setInterval(() => {
  hexUp(rand());
}, 8000);

function cancelAuto() {
  document.body.removeEventListener('click', cancelAuto, true);
  clearInterval(refreshIntervalId);
}

document.body.addEventListener('click', cancelAuto, true);

//bootup;
hexUp(rand());
