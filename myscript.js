document.addEventListener("DOMContentLoaded", function() {
  calculate();
});
function calculate() {
            const dryRo = parseFloat(document.getElementById('dryRo').value);
            const triangleDimension = parseInt(document.getElementById('triangleDimension').value);
            const rectangleDimensionW = parseInt(document.getElementById('rectangleDimensionW').value);
            const rectangleDimensionH = parseInt(document.getElementById('rectangleDimensionH').value);
            const extraVolume = (100+parseInt(document.getElementById('extraVolume').value))/100;
            const ro = parseFloat(document.getElementById('ro').value);
            const volume = parseInt(document.getElementById('volume').value);
            const td = document.createElement('td');
            // Расчет для треугольника
            const tcont = document.getElementById('tcont');
            tcont.innerHTML = '';
            const triangleTable = document.createElement('div');
            triangleTable.id = 'triangleTable';
            tcont.appendChild(triangleTable);
            triangleTable.innerHTML = '';
            for (let i = 0; i < triangleDimension; i++) {
                const row = document.createElement('div');
                row.className = 'trrow';
                for (let j = 0; j <= i; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'trcell';
                    const c1 = (triangleDimension - i - 1) / (triangleDimension - 1);
                    const c3 = j / (triangleDimension - 1);
                    const c2 = 1 - c3 - c1;
                    const r1 = document.createElement('span');
                    const r2 = document.createElement('span');
                    const r3 = document.createElement('span');
                    r1.innerHTML = `${(c1 * volume).toFixed(1)}`;
                    r1.style.display = 'table';
                    r1.style.margin = '0 auto';
                    r2.innerHTML = `${(c2 * volume).toFixed(1)}`;
                    r3.innerHTML = `${(c3 * volume).toFixed(1)}`;
                    cell.appendChild(r1);
                    cell.appendChild(td);
                    cell.appendChild(r2);
                    cell.appendChild(document.createTextNode('\u00A0\u00A0'));
                    cell.appendChild(r3);
                    row.appendChild(cell);
                }
                triangleTable.appendChild(row);
            }
            const baseTrVolume = document.getElementById('baseTrVolume');
            const baseTrDry = document.getElementById('baseTrDry');
            const baseTrWet = document.getElementById('baseTrWet');
            const trVolume = (volume * (triangleDimension) * extraVolume).toFixed(2);
            baseTrVolume.innerText = trVolume;
            const trWet = trVolume * ((ro - dryRo) / (1 - dryRo));
            const trDry = trVolume * ((ro - 1) / (dryRo - 1)) * dryRo;

            baseTrDry.innerText = trDry.toFixed(2);
            baseTrWet.innerText = trWet.toFixed(2);
            // Расчет для прямоугольника
            const rectangleTable = document.getElementById('rectangleTable');
            rectangleTable.innerHTML = '';
            rectangleTable.setAttribute("border", "2");
            for (let i = 0; i < rectangleDimensionH; i++) {
                const row = document.createElement('tr');
                const lp = i / (rectangleDimensionH - 1);
                for (let j = 0; j < rectangleDimensionW; j++) {
                    const tp = j / (rectangleDimensionW - 1);
                    const cell = document.createElement('td');
                    cell.className = 'tcell';
                    const c1 = lp * tp;
                    const c2 = (1 - lp) * tp
                    const c3 = lp * (1 - tp);
                    const c4 = (1 - tp) * (1 - lp);
                    const r1 = document.createElement('span');
                    const r2 = document.createElement('span');
                    const r3 = document.createElement('span');
                    const r4 = document.createElement('span');
                    r4.innerHTML = `${(c1 * volume).toFixed(1)}`;
                    r2.innerHTML = `${(c2 * volume).toFixed(1)}`;
                    r3.innerHTML = `${(c3 * volume).toFixed(1)}`;
                    r1.innerHTML = `${(c4 * volume).toFixed(1)}`;
                    cell.appendChild(r1);
                    cell.appendChild(document.createTextNode('\u00A0\u00A0'));
                    cell.appendChild(r2);
                    cell.appendChild(document.createElement('br'));
                    cell.appendChild(r3);
                    cell.appendChild(document.createTextNode('\u00A0\u00A0'));
                    cell.appendChild(r4);
                    row.appendChild(cell);
                }
                rectangleTable.appendChild(row);
            }
            const baseRecVolume = document.getElementById('baseRecVolume');
            const baseRcDry = document.getElementById('baseRcDry');
            const baseRcWet = document.getElementById('baseRcWet');
            const rcVolume = (volume * (rectangleDimensionW + rectangleDimensionH) * extraVolume).toFixed(2);
            baseRecVolume.innerText = rcVolume;
            const rcWet = rcVolume * ((ro - dryRo) / (1 - dryRo));
            const rcDry = rcVolume * ((ro - 1) / (dryRo - 1)) * dryRo;
            baseRcDry.innerText = rcDry.toFixed(2);
            baseRcWet.innerText = rcWet.toFixed(2);
        }

        function switchLanguage() {
            if (document.getElementById('languageButtonLabel').innerHTML === "En") {
                document.getElementById('languageButtonLabel').innerHTML = "Ru";
                document.getElementById('h1localizedStr').innerHTML = "Glaze blend volume calculator";
                document.getElementById('titleNameLocalized').innerHTML = "Glaze blend volume calculator";
                document.getElementById('labelTrDimLocalized').innerHTML = "Triangle size:";
                document.getElementById('labelRecWLocalized').innerHTML = "Rectangle width:";
                document.getElementById('labelRecHLocalized').innerHTML = "Rectangle height:";
                document.getElementById('labelSingleVolLocalized').innerHTML = "Test tile volume:";
                document.getElementById('labelRoGlazeLocalized').innerHTML = "Glaze Specific gravity:";
                document.getElementById('labelRoDry2Localized').innerHTML = "Average dry powder density is 2.6";
                document.getElementById('labelRoDryLocalized').innerHTML = "Dry powder density";

                document.getElementById('h2Localized').innerHTML = "Results:";
                document.getElementById('h3trLocalized').innerHTML = "Triangle blend:";
                document.getElementById('h3recLocalized').innerHTML = "Rectangle blend:";

                document.getElementById('glazeVolumeLocalized').innerHTML = "Corner glaze volume: ";
                document.getElementById('waterLocalized').innerHTML = "Water weight: ";
                document.getElementById('dryWLocalized').innerHTML = "Powder weight: ";

                document.getElementById('glazeVolumeLocalized2').innerHTML = "Corner glaze volume: ";
                document.getElementById('waterLocalized2').innerHTML = "Water weight: ";
                document.getElementById('dryWLocalized2').innerHTML = "Powder weight: ";
                document.getElementById('extraVolumeLocalized').innerHTML = "Extra corner volume: ";
                document.getElementById('warningLocalized').innerHTML = "Please note that _your_ glaze may need a different amount of water";
                document.getElementById('refLocalized').innerHTML = "References: ";
            } else if (document.getElementById('languageButtonLabel').innerHTML === "Ru") {
                document.getElementById('languageButtonLabel').innerHTML = "En";
                document.getElementById('h1localizedStr').innerHTML = "Калькулятор объема для растяжек глазурей";
                document.getElementById('titleNameLocalized').innerHTML = "Калькулятор объема для растяжек глазурей";
                document.getElementById('labelTrDimLocalized').innerHTML = "Размерность треугольника:";
                document.getElementById('labelRecWLocalized').innerHTML = "Ширина прямоугольника:";
                document.getElementById('labelRecHLocalized').innerHTML = "Высота прямоугольника:";
                document.getElementById('labelSingleVolLocalized').innerHTML = "Объем одного пробника:";
                document.getElementById('labelRoGlazeLocalized').innerHTML = "Плотность глазури:";
                document.getElementById('labelRoDry2Localized').innerHTML = "Средняя плотность сухого порошка 2.6";
                document.getElementById('labelRoDryLocalized').innerHTML = "Плотность порошка:";

                document.getElementById('h2Localized').innerHTML = "Результаты:";
                document.getElementById('h3trLocalized').innerHTML = "Треугольник:";
                document.getElementById('h3recLocalized').innerHTML = "Прямоугольник:";

                document.getElementById('glazeVolumeLocalized').innerHTML = "Объем угловой глазури: ";
                document.getElementById('waterLocalized').innerHTML = "Вес жидкости: ";
                document.getElementById('dryWLocalized').innerHTML = "Вес порошка: ";

                document.getElementById('glazeVolumeLocalized2').innerHTML = "Объем угловой глазури: ";
                document.getElementById('waterLocalized2').innerHTML = "Вес жидкости: ";
                document.getElementById('dryWLocalized2').innerHTML = "Вес порошка: ";
                document.getElementById('extraVolumeLocalized').innerHTML = "Дополнительный объем по углам: ";
                document.getElementById('warningLocalized').innerHTML = "Учтите что _вашей_ глазури может потребоваться другое количество воды";
                document.getElementById('refLocalized').innerHTML = "Ссылки: ";
            }
        }
