// Scope Main Configuration State Array
let students = [];

// Tracks lookup filters string criteria
let activeFilter = "";

// Dom Node Structural References Element Map
const studentInput = document.getElementById('studentInput');
const addBtn = document.getElementById('addBtn');
const searchInput = document.getElementById('searchInput');
const rosterGrid = document.getElementById('rosterGrid');
const studentCounter = document.getElementById('studentCounter');

const spinBtn = document.getElementById('spinBtn');
const stateIdle = document.getElementById('stateIdle');
const stateSpinning = document.getElementById('stateSpinning');
const stateWinner = document.getElementById('stateWinner');
const winnerName = document.getElementById('winnerName');
const winnerInitial = document.getElementById('winnerInitial');

const historyContainer = document.getElementById('historyContainer');
const emptyHistoryText = document.getElementById('emptyHistoryText');

const winnerModal = document.getElementById('winnerModal');
const modalName = document.getElementById('modalName');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalRespinBtn = document.getElementById('modalRespinBtn');

/**
 * Builds, maps color schemes and draws active array contents into Roster UI Grid
 */
function updateRosterUI() {
    const cleanFilter = activeFilter.trim().toLowerCase();
    const recordsToDisplay = students.filter(name => name.toLowerCase().includes(cleanFilter));

    rosterGrid.innerHTML = "";

    if (recordsToDisplay.length === 0) {
        rosterGrid.innerHTML = `<p class="empty-history" style="grid-column: 1/-1">No matches matching criteria found.</p>`;
    } else {
        recordsToDisplay.forEach((name) => {
            const trueIndex = students.indexOf(name);
            
            // Format dynamic character initial representations
            const initials = name.trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase() || "?";
            
            // Assign color indexes variants dynamically (av-0 through av-3)
            const colorClass = `av-${trueIndex % 4}`;

            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <div class="student-info">
                    <div class="student-avatar ${colorClass}">${initials}</div>
                    <div class="student-name-field" 
                         contenteditable="true" 
                         data-index="${trueIndex}" 
                         spellcheck="false"
                         title="Click to edit name directly">${name}</div>
                </div>
                <button class="delete-btn" data-index="${trueIndex}" title="Delete Record">&times;</button>
            `;
            rosterGrid.appendChild(card);
        });
    }

    // Refresh display status counter values 
    studentCounter.innerText = `${students.length} Student${students.length === 1 ? '' : 's'} Loaded`;
}

/**
 * Handles validation processing inputs before appending names state arrays
 */
function handleAddStudent() {
    const inputVal = studentInput.value.trim();
    if (!inputVal) return;

    if (students.map(s => s.toLowerCase()).includes(inputVal.toLowerCase())) {
        alert("This exact student profile label already exists inside your active class roster.");
        return;
    }

    students.push(inputVal);
    studentInput.value = "";
    studentInput.focus();
    updateRosterUI();
}

/**
 * Modifies index configurations parameters immediately on contenteditable mutation actions
 */
function commitStudentEdit(element) {
    const targetedIndex = parseInt(element.getAttribute('data-index'), 10);
    const textUpdate = element.innerText.trim();

    // Check if user wiped out name string content manually
    if (!textUpdate) {
        alert("Names cannot be blank. Reverting changes back to default state.");
        element.innerText = students[targetedIndex];
        return;
    }

    // Check if edited name collides with another existing row name profile
    const nameCollision = students.some((s, idx) => idx !== targetedIndex && s.toLowerCase() === textUpdate.toLowerCase());
    if (nameCollision) {
        alert("Another record already matches that name profile. Reverting.");
        element.innerText = students[targetedIndex];
        return;
    }

    // Update real dataset and run soft re-render updates targeting avatar structures
    students[targetedIndex] = textUpdate;
    
    // Refresh avatar visuals without knocking element focus state loops offline
    const avatarNode = element.previousElementSibling;
    if (avatarNode) {
        avatarNode.innerText = textUpdate.split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase() || "?";
    }
}

/**
 * Splices positions structures references values
 */
function handleRemoveStudent(index) {
    students.splice(index, 1);
    updateRosterUI();
}

/**
 * Drives UI panels screen view logic swaps and rolls calculations indices
 */
function executeRandomizerSpin() {
    if (students.length === 0) {
        alert("Roster is empty. Load names inside your Class List display block before initializing picker loops.");
        return;
    }

    spinBtn.disabled = true;
    
    stateIdle.classList.add('hidden');
    stateWinner.classList.add('hidden');
    stateSpinning.classList.remove('hidden');

    setTimeout(() => {
        const winningIndex = Math.floor(Math.random() * students.length);
        const championName = students[winningIndex];

        winnerName.innerText = championName;
        winnerInitial.innerText = championName.trim().charAt(0).toUpperCase() || "?";

        stateSpinning.classList.add('hidden');
        stateWinner.classList.remove('hidden');
        
        appendHistoryRecord(championName);
        triggerModalAnnouncement(championName);

        spinBtn.disabled = false;
    }, 900);
}

/**
 * Prepends elements rows into chronological operations history panels
 */
function appendHistoryRecord(nameVal) {
    if (emptyHistoryText) emptyHistoryText.remove();

    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logItem = document.createElement('div');
    logItem.className = 'history-item';
    logItem.innerHTML = `
        <span class="history-item-name">${nameVal}</span>
        <span class="history-item-time">${stamp}</span>
    `;

    historyContainer.prepend(logItem);
    if (historyContainer.children.length > 4) {
        historyContainer.lastElementChild.remove();
    }
}

function triggerModalAnnouncement(nameVal) {
    modalName.innerText = nameVal;
    winnerModal.classList.remove('hidden');
}

function closeModalView() {
    winnerModal.classList.add('hidden');
}

// Operational DOM Node Event Bindings Management Engine
addBtn.addEventListener('click', handleAddStudent);
studentInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAddStudent(); });
searchInput.addEventListener('input', (e) => { activeFilter = e.target.value; updateRosterUI(); });

// Delegated grid click and keyboard observers capturing actions on records dynamically
rosterGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const dropIndex = parseInt(e.target.getAttribute('data-index'), 10);
        handleRemoveStudent(dropIndex);
    }
});

// Inline Mutation Edit Capture Observers
rosterGrid.addEventListener('blur', (e) => {
    if (e.target.classList.contains('student-name-field')) {
        commitStudentEdit(e.target);
    }
}, true); // Use capturing phase loop handles to listen on child inputs cleanly

rosterGrid.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('student-name-field') && e.key === 'Enter') {
        e.preventDefault(); // Kill newline breakdown formatting mutations
        e.target.blur();    // Triggers blur callback to run database saving operations
    }
});

spinBtn.addEventListener('click', executeRandomizerSpin);
modalCloseBtn.addEventListener('click', closeModalView);
modalRespinBtn.addEventListener('click', () => {
    closeModalView();
    setTimeout(executeRandomizerSpin, 150);
});

// App Initiation Call
updateRosterUI();
// App Initiation Call
updateRosterUI();

// ==========================================================================
// Initialization Cycle: Self-Contained Ghanaian Jollof Toast System
// ==========================================================================
(function initJollofToast() {
    // 1. Build structure dynamically to minimize index.html asset dependencies
    const toastNode = document.createElement('div');
    toastNode.className = 'recipe-toast';
    toastNode.id = 'jollofToast';
    
    toastNode.innerHTML = `
        <button class="toast-close-btn" id="closeToastBtn" aria-label="Close notification">&times;</button>
        <div class="toast-header">
            <span class="toast-icon">🇬🇭</span>
            <h3>How to Prepare Ghanaian Jollof</h3>
        </div>
        <div class="toast-body">
            <p><strong>Ingredients:</strong> Jasmine rice, tomato paste, blended tomatoes, onions, scotch bonnets, ginger, garlic, meat stock, curry powder, and a touch of nutmeg.</p>
            <ol>
                <li><strong>The Stew Base:</strong> Sauté sliced onions in oil. Add tomato paste and fry for 5–10 mins. Pour in blended tomato/pepper mixture and cook down until oil surfaces.</li>
                <li><strong>Flavors & Stock:</strong> Stir in fresh ginger, garlic, curry, nutmeg, and your rich meat stock. Let simmer until highly fragrant.</li>
                <li><strong>The Rice integration:</strong> Thoroughly wash jasmine rice to eliminate excess starch. Stir it directly into the hot stew until evenly coated.</li>
                <li><strong>The Steam Process:</strong> Ensure stock levels barely match the rice. Seal tightly with aluminum foil and a heavy lid. Steam on low heat until perfectly tender and smoky.</li>
            </ol>
        </div>
    `;

    // 2. Append directly inside the running body landscape scope
    document.body.appendChild(toastNode);

    // 3. Functional Node Scoped Event Handler Closures
    const closeBtn = toastNode.querySelector('#closeToastBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toastNode.classList.add('toast-hidden');
            
            // Allow CSS transition timing frames to resolve gracefully before deleting DOM node references
            setTimeout(() => {
                toastNode.remove();
            }, 300);
        });
    }
})();