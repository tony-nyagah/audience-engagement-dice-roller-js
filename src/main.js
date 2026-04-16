import "./style.css";

class DiceRoller {
  constructor() {
    this.participants = [];
    this.lastSelectedIndex = null;
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.nameInput = document.getElementById("name-input");
    this.addNameBtn = document.getElementById("add-name-btn");
    this.namesList = document.getElementById("names-list");
    this.startGameBtn = document.getElementById("start-game-btn");
    this.nameEntrySection = document.getElementById("name-entry-section");
    this.diceSection = document.getElementById("dice-section");
    this.dice = document.getElementById("dice");
    this.rollDiceBtn = document.getElementById("roll-dice-btn");
    this.result = document.getElementById("result");
    this.resetGameBtn = document.getElementById("reset-game-btn");
  }

  bindEvents() {
    this.addNameBtn.addEventListener("click", () => this.addParticipant());
    this.nameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addParticipant();
    });
    this.startGameBtn.addEventListener("click", () => this.startGame());
    this.rollDiceBtn.addEventListener("click", () => this.rollDice());
    this.resetGameBtn.addEventListener("click", () => this.resetGame());
  }

  addParticipant() {
    const name = this.nameInput.value.trim();
    if (name && !this.participants.includes(name)) {
      this.participants.push(name);
      this.nameInput.value = "";
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
    this.namesList.innerHTML = "";
    this.participants.forEach((name, index) => {
      const li = document.createElement("li");
      li.className = "participant-item";
      li.innerHTML = `
        <span class="participant-number">${index + 1}</span>
        <span class="participant-name">${name}</span>
        <button class="remove-btn" onclick="diceRoller.removeParticipant(${index})">&#10005;</button>
      `;
      this.namesList.appendChild(li);
    });
    this.updateParticipantsCount();
  }

  updateParticipantsCount() {
    const badge = document.getElementById("participants-count");
    if (badge) badge.textContent = this.participants.length;
  }

  updateStartButton() {
    this.startGameBtn.disabled = this.participants.length === 0;
  }

  startGame() {
    if (this.participants.length === 0) return;

    this.nameEntrySection.classList.add("hidden");
    this.diceSection.classList.remove("hidden");
    this.result.innerHTML = "";
    this.updatePoolInfo();
  }

  /** Returns the indices that are eligible to be picked this roll. */
  getEligibleIndices() {
    const canExclude =
      this.lastSelectedIndex !== null && this.participants.length > 1;

    return this.participants.reduce((acc, _, i) => {
      if (!canExclude || i !== this.lastSelectedIndex) acc.push(i);
      return acc;
    }, []);
  }

  updatePoolInfo() {
    const poolInfo = document.getElementById("pool-info");
    if (!poolInfo) return;

    const canExclude =
      this.lastSelectedIndex !== null && this.participants.length > 1;
    const eligibleCount = canExclude
      ? this.participants.length - 1
      : this.participants.length;

    const chips = this.participants
      .map((name, index) => {
        const isExcluded = canExclude && index === this.lastSelectedIndex;
        return isExcluded
          ? `<span class="pool-chip pool-chip--excluded" title="Can't be picked this roll">${name}</span>`
          : `<span class="pool-chip">${name}</span>`;
      })
      .join("");

    poolInfo.innerHTML = `
      <span class="pool-info-label">Pool (${eligibleCount} eligible)</span>
      <div class="pool-chips">${chips}</div>
    `;
  }

  rollDice() {
    if (this.participants.length === 0) return;

    this.rollDiceBtn.disabled = true;
    this.dice.classList.remove("winner");
    this.dice.classList.add("rolling");
    this.result.innerHTML = "";

    let counter = 0;
    const eligibleIndices = this.getEligibleIndices();

    const rollInterval = setInterval(() => {
      // Flash a random eligible participant's number during the animation
      const randomPos = Math.floor(Math.random() * eligibleIndices.length);
      this.dice.querySelector(".dice-face").textContent =
        eligibleIndices[randomPos] + 1;
      counter++;

      if (counter > 10) {
        clearInterval(rollInterval);
        this.finalizeDiceRoll(eligibleIndices);
      }
    }, 100);
  }

  finalizeDiceRoll(eligibleIndices) {
    const randomPos = Math.floor(Math.random() * eligibleIndices.length);
    const finalIndex = eligibleIndices[randomPos];
    const finalNumber = finalIndex + 1;
    const selectedParticipant = this.participants[finalIndex];

    this.dice.querySelector(".dice-face").textContent = finalNumber;
    this.dice.classList.remove("rolling");
    this.dice.classList.add("winner");

    this.lastSelectedIndex = finalIndex;

    this.result.innerHTML = `
      <div class="result-card">
        <div class="result-label">&#127919; Selected Participant</div>
        <div class="result-name">${selectedParticipant}</div>
        <div class="result-number">Rolled number ${finalNumber}</div>
      </div>
    `;

    this.updatePoolInfo();
    this.createConfetti();
    this.rollDiceBtn.disabled = false;
  }

  createConfetti() {
    const colors = [
      "#FFDD00",
      "#00E5CC",
      "#FF4040",
      "#FFFFFF",
      "#FF8800",
      "#AA44FF",
    ];

    for (let i = 0; i < 70; i++) {
      const piece = document.createElement("div");
      const w = Math.random() * 8 + 5;
      const h = Math.random() > 0.5 ? w : w * 2;

      piece.style.cssText = `
        position: fixed;
        width: ${w}px;
        height: ${h}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border: 2px solid #000000;
        left: ${Math.random() * 100}vw;
        top: -20px;
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 1.5 + 1.5}s linear forwards;
        animation-delay: ${Math.random() * 0.4}s;
      `;

      document.body.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  resetGame() {
    this.diceSection.classList.add("hidden");
    this.nameEntrySection.classList.remove("hidden");
    this.dice.querySelector(".dice-face").textContent = "?";
    this.dice.classList.remove("rolling", "winner");
    this.result.innerHTML = "";
    this.lastSelectedIndex = null;
  }
}

// Initialize the app
window.diceRoller = new DiceRoller();
