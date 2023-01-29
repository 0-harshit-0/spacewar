const colorPalette = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)", "rgb(0, 255, 255)", "rgb(255, 0, 255)"];

const playerCanvas = document.querySelector("#players");
const playerCtx = playerCanvas.getContext("2d");
const playerShape = new Shapes({canvas: playerCanvas, context: playerCtx});

const bulletCanvas = document.querySelector("#bullets");
const bulletCtx = bulletCanvas.getContext("2d");
const bulletShape = new Shapes({canvas: bulletCanvas, context: bulletCtx});
const bulletsStore = new Array();
const particleArray = new Array();

const invaderCanvas = document.querySelector('#invaders');
const invaderCtx = invaderCanvas.getContext('2d');
const invaderShape = new Shapes({canvas: invaderCanvas, context: invaderCtx});
const invaderStore = new Array();

const scoreCanvas = document.querySelector("#scores");
const scoreCtx = scoreCanvas.getContext("2d");
const scoreShape = new Shapes({canvas: scoreCanvas, context: scoreCtx});

const pausedTemplate = document.querySelector("#paused-template");
