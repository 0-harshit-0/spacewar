const colorPalette = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)", "rgb(0, 255, 255)", "rgb(255, 0, 255)"];

const playerCanvas = document.querySelector("#players");
const playerCtx = playerCanvas.getContext("2d");
const playerShape = new Shapes(playerCtx);

const bulletCanvas = document.querySelector("#bullets");
const bulletCtx = bulletCanvas.getContext("2d");
const bulletShape = new Shapes(bulletCtx);
const bulletsStore = new Array();
const particleArray = new Array();

let invaderCanvas = document.querySelector('#invaders');
let invaderCtx = invaderCanvas.getContext('2d');
let invaderShape = new Shapes(invaderCtx);
const invaderStore = new Array();


const scoreCanvas = document.querySelector("#scores");
const scoreCtx = scoreCanvas.getContext("2d");
const scoreShape = new Shapes(scoreCtx);

