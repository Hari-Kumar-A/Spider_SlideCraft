let grid = document.getElementById('grid');
let fileInput = document.getElementById('file-input');
let randomizeButton = document.getElementById('start');
let checkButton = document.getElementById('check');
let reference  = document.getElementById('reference-image');
let imageParts = [];
let turns=0;
let turnd=document.getElementById('turns');
let originalImage = null;
let referenceImage=null;

createGrid();

fileInput.addEventListener('change', handleFileSelect, false);
randomizeButton.addEventListener('click', randomizeGrid);
checkButton.addEventListener('click', checkSolution);

function createGrid() {
    for (let i = 0; i < 9; i++) {
        let gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.draggable = true;
        gridItem.addEventListener('dragstart', handleDragStart, false);
        gridItem.addEventListener('dragover', handleDragOver, false);
        gridItem.addEventListener('drop', handleDrop, false);
        grid.appendChild(gridItem);
    }
}

function handleFileSelect(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        originalImage = new Image();
        originalImage.src = e.target.result;
        originalImage.onload = function () {
            imageParts = splitImage(originalImage);
            randomizeButton.disabled = false;
            displayGrid();
        };
        referenceImage = new Image();
        referenceImage.src = e.target.result;
        referenceImage.style.height = '300px';
        referenceImage.style.width = '300px';

        // Remove old reference image
        while (reference.firstChild) {
            reference.firstChild.remove();
        }

        reference.appendChild(referenceImage);
    };
    reader.readAsDataURL(file);
}


function splitImage(image) {
    let containerSize = getComputedStyle(grid);
    let containerWidth = parseInt(containerSize.width);
    let containerHeight = parseInt(containerSize.height);
    let partWidth = containerWidth / 3;
    let partHeight = containerHeight / 3;

    let parts = [];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let part = document.createElement('div');
            part.style.width = partWidth + 'px';
            part.style.height = partHeight + 'px';
            part.style.backgroundImage = `url(${image.src})`;
            part.style.backgroundPosition = `${-col * partWidth}px ${-row * partHeight}px`;
            parts.push(part);
        }
    }

    return parts;
}

function randomizeGrid() {
    let shuffledParts = [...imageParts].sort(() => Math.random() - 0.5);
    let gridItems = document.getElementsByClassName('grid-item');

    for (let i = 0; i < gridItems.length; i++) {
        gridItems[i].style.backgroundImage = shuffledParts[i].style.backgroundImage;
        gridItems[i].style.backgroundPosition = shuffledParts[i].style.backgroundPosition;
    }
    randomizeButton.disabled = false;
    randomizeButton.innerHTML=`ReStart`;
    turns=0;
    turnd.innerHTML=`Turns:${turns}`;
    checkButton.disabled = false;
}
function displayGrid() {
 
    let gridItems = document.getElementsByClassName('grid-item');

    for (let i = 0; i < gridItems.length; i++) {
        gridItems[i].style.backgroundImage = imageParts[i].style.backgroundImage;
        gridItems[i].style.backgroundPosition = imageParts[i].style.backgroundPosition;
    }

    checkButton.disabled = false;
}

let draggedItem = null;

function handleDragStart(event) {
    draggedItem = this;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event) {
    event.preventDefault();
    if (draggedItem !== this) {
        turns++;
        turnd.innerHTML=`Turns :${turns}`
        console.log(turns);
        let tempBg = this.style.backgroundImage;
        let tempPos = this.style.backgroundPosition;
        this.style.backgroundImage = draggedItem.style.backgroundImage;
        this.style.backgroundPosition = draggedItem.style.backgroundPosition;
        draggedItem.style.backgroundImage = tempBg;
        draggedItem.style.backgroundPosition = tempPos;
    }
}

function checkSolution() {
    let gridItems = document.getElementsByClassName('grid-item');
    let solvedParts = [...gridItems];

    for (let i = 0; i < solvedParts.length; i++) {
        if (!compareBackgrounds(solvedParts[i], imageParts[i])) {
            alert('Wrong Match! Try again');
            return;
        }
    }
    alert(`Hurray! Correct Match! You did in ${turns} moves` );
    location.reload();
}

function compareBackgrounds(elem1, elem2) {
    return (
        elem1.style.backgroundImage === elem2.style.backgroundImage &&
        elem1.style.backgroundPosition === elem2.style.backgroundPosition
    );
}