// =====
// Color Switch
// =====

const rail = document.getElementById('rail');

// Change the page theme color
rail.addEventListener('click', ()=>{
    const body = document.body;

    body.classList.toggle('dark');
    body.classList.toggle('light');
    body.classList.remove('easterEgg');
});

// =====
// Track Lines
// For a better understanding of how the calculations in this sector work, there is a full explanation of them in the instruction file
// =====

function generateObject(box) {
    // Check if the box exists before creating its object
    if(box) {
        const element = box.children[0];
        const trackLine = box.children[1];

        return {
            marginTop: +getComputedStyle(element).marginTop.slice(0, -2),
            height: element.clientHeight,
            width: element.clientWidth,
            lineWidth: +getComputedStyle(trackLine).borderBottomWidth.slice(0, -2),
            position: getComputedStyle(box).alignSelf
        };
    };
};

function calculateTop(previousElement) {
    // Check if the previous element exists before calculating it
    return (previousElement ? 0 - previousElement.height / 2 : 0) + 'px';
};

function calculateLeft(element, nextElement, mainWidth) {
    let left = 'auto';
    let transform = 'none';

    // Check if the next element exists before calculating it
    if(nextElement) {
        // If the element is in the center...
        if(element.position === 'center') {

            // and the next element is not, this formula will be used, otherwise it'll be 'auto'
            left = nextElement.position !== 'center' ? `${-nextElement.width / 2 - (mainWidth - element.width) / 2 + nextElement.width - element.lineWidth / 2}px` : 'auto';
            // If the next element is at the end, the element track line must be flipped horizontally
            if(nextElement.position === 'end') {transform = 'scaleX(-1)';};
        } else {

            // If the next element is:
            switch (nextElement.position) {
                // in the same position as the element...
                case element.position:
                    
                    // and is narrower than it, this formula will be used
                    if(element.width < nextElement.width) {

                        left = `${-nextElement.width / 2 + element.width - element.lineWidth / 2}px`;
                        // if the elements are at the start, the element track line must be flipped horizontally
                        if(element.position === 'start') {transform = 'scaleX(-1)';};
                    // and is wider than it, this formula will be used
                    } else {

                        left = `${nextElement.width / 2 - element.lineWidth / 2}px`;
                        // if the elements are at the end, the element track line must be flipped horizontally
                        if(element.position === 'end') {transform = 'scaleX(-1)';};
                    };
                    break;
                // in the center, this formula will be used
                case 'center':
                    
                    left = `${-nextElement.width / 2 - (mainWidth - element.width) + nextElement.width + (mainWidth - nextElement.width) / 2 - element.lineWidth / 2}px`;
                    // if the element are at the start, its track line must be flipped horizontally
                    if(element.position === 'start') {transform = 'scaleX(-1)';};
                    break;
                // in the start or end, this formula will be used
                default:
                    
                    left = `${-nextElement.width / 2 - (mainWidth - element.width) + nextElement.width - element.lineWidth / 2}px`;
                    // if the element are at the start, its track line must be flipped horizontally
                    if(element.position === 'start') {transform = 'scaleX(-1)';};
                    break;
            };
        };
    };

    return { left, transform };
};

function generateTrackLines() {
    const mainWidth = document.querySelector('main').clientWidth;
    const boxForTrackLine = document.querySelectorAll('.boxForTrackLine');

    // Loop through all boxes to create their track lines
    boxForTrackLine.forEach(function(box, index, array) {
        // Creates objects with all the properties needed to calculate the track line
        const previousElement = generateObject(array[index - 1]);
        const element = generateObject(box);
        const nextElement = generateObject(array[index + 1]);
        
        //Calculates the track line values based on the objects
        const topValues = calculateTop(previousElement);
        const LeftValues = calculateLeft(element, nextElement, mainWidth);
        
        // Inserts the values into the track line element
        const trackLine = box.children[1];
        trackLine.style.top = topValues;
        trackLine.style.left = LeftValues.left;
        trackLine.style.transform = LeftValues.transform;
    });
};

// =====
// Execution Control
// controls execution so as not to overload the page
// =====

let timer = null;
let reloadCount = 0;

// If this function is called before the previous call is executed, the previous call will be canceled
function executionControl() {
    if (timer !== null) {
        clearTimeout(timer);
    };
    
    timer = setTimeout(() => {
        generateTrackLines();

        taskID = null;
        // Reload the page after five or more executions of this function so that the page does not overload
        reloadCount >= 5 ? location.reload() : reloadCount++;
    }, 200);
};

// =====
// Track Line Calls
// =====

window.addEventListener('resize', ()=>{executionControl()});
window.addEventListener('load', ()=>{executionControl()});
