import './style.css'

class DiceRoller {
  constructor() {
    this.participants = [];
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.nameInput = document.getElementById('name-input');
    this.addNameBtn = document.getElementById('add-name-btn');
    this.namesList = document.getElementById('names-list');
    this.startGameBtn = document.getElementById('start-game-btn');
    this.nameEntrySection = document.getElementById('name-entry-section');
    this.diceSection = document.getElementById('dice-section');
    this.dice = document.getElementById('dice');
    this.rollDiceBtn = document.getElementById('roll-dice-btn');
    this.result = document.getElementById('result');
    this.resetGameBtn = document.getElementById('reset-game-btn');
  }

  bindEvents() {
    this.addNameBtn.addEventListener('click', () => this.addParticipant());
    this.nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addParticipant();
    });
    this.startGameBtn.addEventListener('click', () => this.startGame());
    this.rollDiceBtn.addEventListener('click', () => this.rollDice());
    this.resetGameBtn.addEventListener('click', () => this.resetGame());
  }

  addParticipant() {
    const name = this.nameInput.value.trim();
    if (name && !this.participants.includes(name)) {
      this.participants.push(name);
      this.nameInput.value = '';
      this.updateParticipantsList();
      this.updateStartButton();
    }
  }

  removeParticipant(index) {
    this.participants.splice(index, 1);
    this.updateParticipantsList();
    this.updateStartButton();
  }

  updateParticipantsList() {
    this.namesList.innerHTML = '';
    this.participants.forEach((name, index) => {
      const li = document.createElement('li');
      li.className = 'participant-item';
      li.innerHTML = `
        <span>${name}</span>
        <div>
          <span class="participant-number">${index + 1}</span>
          <button class="remove-btn" onclick="diceRoller.removeParticipant(${index})">×</button>
        </div>
      `;
      this.namesList.appendChild(li);
    });
  }

  updateStartButton() {
    this.startGameBtn.disabled = this.participants.length === 0;
  }

  startGame() {
    if (this.participants.length === 0) return;
    
    this.nameEntrySection.classList.add('hidden');
    this.diceSection.classList.remove('hidden');
    this.result.innerHTML = '';
  }

  rollDice() {
    if (this.participants.length === 0) return;

    this.rollDiceBtn.disabled = true;
    this.dice.classList.add('rolling');
    
    // Simulate rolling animation
    let counter = 0;
    const rollInterval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * this.participants.length) + 1;
      this.dice.querySelector('.dice-face').textContent = randomNum;
      counter++;
      
      if (counter > 10) {
        clearInterval(rollInterval);
        this.finalizeDiceRoll();
      }
    }, 100);
  }

  finalizeDiceRoll() {
    const finalNumber = Math.floor(Math.random() * this.participants.length) + 1;
    const selectedParticipant = this.participants[finalNumber - 1];
    
    this.dice.querySelector('.dice-face').textContent = finalNumber;
    this.dice.classList.remove('rolling');
    
    this.result.innerHTML = `
      <h3>🎯 Selected Participant:</h3>
      <p><strong>${selectedParticipant}</strong> (Number ${finalNumber})</p>
    `;
    
    this.rollDiceBtn.disabled = false;
  }

  resetGame() {
    this.diceSection.classList.add('hidden');
    this.nameEntrySection.classList.remove('hidden');
    this.dice.querySelector('.dice-face').textContent = '?';
    this.result.innerHTML = '';
  }
}

// Initialize the app
window.diceRoller = new DiceRoller();