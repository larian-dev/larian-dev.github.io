"use strict";

/*
 * Glaze blend volume calculator.
 *
 * Formulas mirror the original page: total corner-glaze volume equals the
 * test-tile volume times the blend dimension (triangle) or the rectangle's
 * half-perimeter (width + height), scaled by the extra-volume percentage.
 * Wet/dry weights follow from the glaze and powder densities.
 */

/* Corner colours used to tint blend tiles (RGB triplets). */
const CORNER_COLORS = {
  triangle: {
    apex: [239, 68, 68], // red
    left: [16, 185, 129], // emerald
    right: [59, 130, 246], // blue
  },
  rectangle: {
    topLeft: [239, 68, 68],
    topRight: [245, 158, 11],
    bottomLeft: [59, 130, 246],
    bottomRight: [16, 185, 129],
  },
};

const TEXT = {
  en: {
    switchTo: "ru",
    title: "Glaze blend volume calculator",
    heading: "Glaze blend volume calculator",
    triangleSize: "Triangle size:",
    rectWidth: "Rectangle width:",
    rectHeight: "Rectangle height:",
    tileVolume: "Test tile volume:",
    glazeDensity: "Glaze Specific gravity:",
    powderDensity: "Dry powder density",
    powderDensityHint: "Average dry powder density is 2.6",
    extraVolume: "Extra corner volume: ",
    results: "Results:",
    warning: "Please note that _your_ glaze may need a different amount of water",
    triangleTitle: "Triangle blend:",
    rectTitle: "Rectangle blend:",
    cornerVolume: "Corner glaze volume: ",
    waterWeight: "Water weight: ",
    powderWeight: "Powder weight: ",
    references: "References: ",
  },
  ru: {
    switchTo: "en",
    title: "Калькулятор объема для растяжек глазурей",
    heading: "Калькулятор объема для растяжек глазурей",
    triangleSize: "Размерность треугольника:",
    rectWidth: "Ширина прямоугольника:",
    rectHeight: "Высота прямоугольника:",
    tileVolume: "Объем одного пробника:",
    glazeDensity: "Плотность глазури:",
    powderDensity: "Плотность порошка:",
    powderDensityHint: "Средняя плотность сухого порошка 2.6",
    extraVolume: "Дополнительный объем по углам: ",
    results: "Результаты:",
    warning: "Учтите что _вашей_ глазури может потребоваться другое количество воды",
    triangleTitle: "Треугольник:",
    rectTitle: "Прямоугольник:",
    cornerVolume: "Объем угловой глазури: ",
    waterWeight: "Вес жидкости: ",
    powderWeight: "Вес порошка: ",
    references: "Ссылки: ",
  },
};

const $ = (id) => document.getElementById(id);

let currentLanguage = "ru";

/* ---------------- language ---------------- */

function updateLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  const dictionary = TEXT[language];
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = dictionary[element.dataset.i18n] ?? "";
  }
  // Dictionary content is authored in this file, so markup from _emphasis_ is safe.
  $("warning").innerHTML = dictionary.warning.replace(/_([^_]+)_/g, "<em>$1</em>");
}

function switchLanguage() {
  updateLanguage(currentLanguage === "ru" ? "en" : "ru");
}

/* ---------------- blend rendering ---------------- */

function mixColor(parts) {
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [fraction, [cr, cg, cb]] of parts) {
    r += fraction * cr;
    g += fraction * cg;
    b += fraction * cb;
  }
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.28)`;
}

function createTile(rows, background) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.style.background = background;
  for (const values of rows) {
    const row = document.createElement("div");
    row.className = values.length === 1 ? "row center" : "row";
    for (const value of values) {
      const span = document.createElement("span");
      span.textContent = value;
      row.append(span);
    }
    tile.append(row);
  }
  return tile;
}

const measuringContext = document.createElement("canvas").getContext("2d");

function fitTiles(grid, labels) {
  // Tiles grow past their base size when corner values would not fit side by side.
  const style = getComputedStyle(grid);
  measuringContext.font = `${style.fontSize} ${style.fontFamily}`;
  let widest = 0;
  for (const label of labels) {
    widest = Math.max(widest, measuringContext.measureText(label).width);
  }
  const needed = Math.ceil(2 * widest + 2 + 12); // two values + row gap + tile padding and border
  grid.style.setProperty("--tile", `max(var(--tile-base), ${needed}px)`);
}

function focusScroller(grid) {
  // Centre overflowing blends so the triangle apex / rectangle middle stays in view.
  const scroller = grid.parentElement;
  // Print sheets are far narrower than desktop cards; scale big grids down to fit.
  grid.style.setProperty("--print-zoom", String(Math.min(1, 660 / scroller.scrollWidth)));
  const key = `${scroller.scrollWidth}:${scroller.clientWidth}`;
  if (scroller.dataset.key === key) return;
  scroller.dataset.key = key;
  const overflow = scroller.scrollWidth - scroller.clientWidth;
  scroller.scrollLeft = overflow > 0 ? overflow / 2 : 0;
}

function renderTriangle(dimension, volume) {
  const colors = CORNER_COLORS.triangle;
  const rows = document.createDocumentFragment();
  const labels = [];
  for (let i = 0; i < dimension; i++) {
    const row = document.createElement("div");
    row.className = "trow";
    for (let j = 0; j <= i; j++) {
      const apexFraction = (dimension - i - 1) / (dimension - 1);
      const rightFraction = j / (dimension - 1);
      const leftFraction = 1 - rightFraction - apexFraction;
      const apex = (apexFraction * volume).toFixed(1);
      const left = (leftFraction * volume).toFixed(1);
      const right = (rightFraction * volume).toFixed(1);
      labels.push(apex, left, right);
      row.append(
        createTile(
          [[apex], [left, right]],
          mixColor([
            [apexFraction, colors.apex],
            [leftFraction, colors.left],
            [rightFraction, colors.right],
          ]),
        ),
      );
    }
    rows.append(row);
  }
  $("triangleBlend").replaceChildren(rows);
  return labels;
}

function renderRectangle(width, height, volume) {
  const colors = CORNER_COLORS.rectangle;
  const rows = document.createDocumentFragment();
  const labels = [];
  for (let rowIndex = 0; rowIndex < height; rowIndex++) {
    const vertical = rowIndex / (height - 1);
    const row = document.createElement("div");
    row.className = "trow";
    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
      const horizontal = columnIndex / (width - 1);
      const topLeftFraction = (1 - horizontal) * (1 - vertical);
      const topRightFraction = horizontal * (1 - vertical);
      const bottomLeftFraction = (1 - horizontal) * vertical;
      const bottomRightFraction = horizontal * vertical;
      const topLeft = (topLeftFraction * volume).toFixed(1);
      const topRight = (topRightFraction * volume).toFixed(1);
      const bottomLeft = (bottomLeftFraction * volume).toFixed(1);
      const bottomRight = (bottomRightFraction * volume).toFixed(1);
      labels.push(topLeft, topRight, bottomLeft, bottomRight);
      row.append(
        createTile(
          [[topLeft, topRight], [bottomLeft, bottomRight]],
          mixColor([
            [topLeftFraction, colors.topLeft],
            [topRightFraction, colors.topRight],
            [bottomLeftFraction, colors.bottomLeft],
            [bottomRightFraction, colors.bottomRight],
          ]),
        ),
      );
    }
    rows.append(row);
  }
  $("rectangleBlend").replaceChildren(rows);
  return labels;
}

/* ---------------- calculation ---------------- */

function setStats(prefix, volume, glazeDensity, powderDensity) {
  $(`${prefix}Volume`).textContent = volume.toFixed(2);
  $(`${prefix}Wet`).textContent =
    (volume * (glazeDensity - powderDensity) / (1 - powderDensity)).toFixed(2);
  $(`${prefix}Dry`).textContent =
    (volume * (glazeDensity - 1) / (powderDensity - 1) * powderDensity).toFixed(2);
}

function clearResults() {
  $("triangleBlend").replaceChildren();
  $("rectangleBlend").replaceChildren();
  for (const id of [
    "baseTriangleVolume",
    "baseTriangleWet",
    "baseTriangleDry",
    "baseRectangleVolume",
    "baseRectangleWet",
    "baseRectangleDry",
  ]) {
    $(id).textContent = "";
  }
}

function calculate() {
  const triangleDimension = parseInt($("triangleDimension").value, 10);
  const rectangleWidth = parseInt($("rectangleDimensionW").value, 10);
  const rectangleHeight = parseInt($("rectangleDimensionH").value, 10);
  const tileVolume = parseInt($("volume").value, 10);
  const glazeDensity = parseFloat($("ro").value);
  const powderDensity = parseFloat($("dryRo").value);
  const extraVolume = (100 + parseInt($("extraVolume").value, 10)) / 100;

  const valid =
    [
      triangleDimension,
      rectangleWidth,
      rectangleHeight,
      tileVolume,
      glazeDensity,
      powderDensity,
      extraVolume,
    ].every(Number.isFinite) &&
    triangleDimension >= 2 &&
    rectangleWidth >= 2 &&
    rectangleHeight >= 2 &&
    powderDensity !== 1;

  if (!valid) {
    clearResults();
    return;
  }

  const triangleLabels = renderTriangle(triangleDimension, tileVolume);
  const rectangleLabels = renderRectangle(rectangleWidth, rectangleHeight, tileVolume);
  fitTiles($("triangleBlend"), triangleLabels);
  fitTiles($("rectangleBlend"), rectangleLabels);
  focusScroller($("triangleBlend"));
  focusScroller($("rectangleBlend"));

  setStats("baseTriangle", tileVolume * triangleDimension * extraVolume, glazeDensity, powderDensity);
  setStats(
    "baseRectangle",
    tileVolume * (rectangleWidth + rectangleHeight) * extraVolume,
    glazeDensity,
    powderDensity,
  );
}

/* ---------------- wiring ---------------- */

$("calculateButton").addEventListener("click", calculate);
$("languageToggle").addEventListener("click", switchLanguage);
document.addEventListener("input", calculate);

calculate();
updateLanguage(navigator.language.toLowerCase().includes("ru") ? "ru" : "en");
