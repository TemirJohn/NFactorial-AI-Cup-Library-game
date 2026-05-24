import { State } from './State.js';

export class GameOverState extends State {
  constructor(game) {
    super(game);
    this.won = false;
    this.reason = '';
    this.stats = {};
    this.menuItems = [
      { key: 'gameover_playAgain', action: () => this.playAgain() },
      { key: 'gameover_mainMenu', action: () => this.mainMenu() }
    ];
    this.selectedIndex = 0;
    this.selectSound = null;

    // Video background (DOM element, shared with MenuState)
    this.video = null;
  }
  
  enter(data) {
    this.won = data.won || false;
    this.reason = data.reason || '';
    this.selectedIndex = 0;
    
    // Initialize select sound if not already created
    if (!this.selectSound) {
      this.selectSound = new Audio('./menu_select.mp3');
      this.selectSound.volume = 0.7;
    }
    
    // Play "uh oh" sound if player lost
    if (!this.won) {
      const uhOhSound = new Audio('./uh_oh.mp3');
      uhOhSound.volume = 0.6;
      uhOhSound.play().catch(e => console.log('Uh oh sound play failed:', e));
    }
    
    // Use the shared DOM video element
    if (!this.video) {
      this.video = document.getElementById('menu-video');
    }
    this.video.style.display = 'block';
    this.video.play().catch(e => console.log('Video play failed:', e));
    
    // Collect game stats
    const gameData = this.game.gameData;
    this.stats = {
      timeElapsed: Math.floor(gameData.elapsedTime),
      level: gameData.playerLevel,
      chaosLevel: Math.floor(gameData.chaosLevel),
      booksCollected: gameData.booksCollected || 0,
      booksShelved: gameData.booksShelved || 0,
      kidsRepelled: gameData.kidsRepelled || 0,
    };
  }
  
  exit() {
    if (this.video) {
      this.video.pause();
      this.video.style.display = 'none';
    }
  }
  
  update(deltaTime) {
    const input = this.game.inputManager;
    
    // Menu navigation
    if (input.isKeyPressed('ArrowUp') || input.isKeyPressed('w')) {
      this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
      this.playSelectSound();
    }
    
    if (input.isKeyPressed('ArrowDown') || input.isKeyPressed('s')) {
      this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
      this.playSelectSound();
    }
    
    if (input.isKeyPressed('Enter') || input.isKeyPressed(' ')) {
      this.menuItems[this.selectedIndex].action();
    }
    
    // Mouse support
    const mousePos = input.getMousePosition();
    if (mousePos) {
      const { width, height } = this.game;
      const boxWidth = 700;
      const boxHeight = 600;
      const boxX = (width - boxWidth) / 2;
      const boxY = (height - boxHeight) / 2;
      
      // Check each menu item
      for (let i = 0; i < this.menuItems.length; i++) {
        const y = boxY + 480 + i * 50;
        const itemTop = y - 20;
        const itemBottom = y + 20;
        const itemLeft = boxX + 150;
        const itemRight = boxX + boxWidth - 150;
        
        if (mousePos.x >= itemLeft && mousePos.x <= itemRight &&
            mousePos.y >= itemTop && mousePos.y <= itemBottom) {
          // Mouse is over this item
          if (this.selectedIndex !== i) {
            this.selectedIndex = i;
            this.playSelectSound();
          }
          
          // Check for click
          if (input.isMouseButtonPressed(0)) { // 0 = left mouse button
            this.menuItems[this.selectedIndex].action();
          }
          break;
        }
      }
    }
  }
  
  render(renderer, interpolation) {
    const ctx = renderer.ctx;
    const { width, height } = this.game;
    
    // Video is rendered as a DOM element behind the canvas — just clear canvas here
    ctx.clearRect(0, 0, width, height);
    
    // Result box with rounded corners
    const boxWidth = 700;
    const boxHeight = 600;
    const boxX = (width - boxWidth) / 2;
    const boxY = (height - boxHeight) / 2;
    const borderRadius = 20;
    
    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x, y, width, height, radius) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };
    
    // Draw box background with transparency
    drawRoundedRect(boxX, boxY, boxWidth, boxHeight, borderRadius);
    ctx.fillStyle = 'rgba(245, 230, 211, 0.9)'; // Semi-transparent
    ctx.fill();
    
    ctx.strokeStyle = '#3d2914';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const t = (key) => this.game.locale.t(key);

    // Title
    ctx.fillStyle = this.won ? '#228B22' : '#8B0000';
    ctx.font = 'bold 64px Arial';
    ctx.fillText(this.won ? t('gameover_victory') : t('gameover_gameOver'), width / 2, boxY + 80);

    // Subtitle
    ctx.fillStyle = '#3d2914';
    ctx.font = '24px Arial';
    if (this.won) {
      ctx.fillText(t('gameover_victoryMsg'), width / 2, boxY + 130);
    } else {
      ctx.fillText(this.reason === 'chaos' ? t('gameover_chaosOverwhelmed') : t('gameover_chaosMsg'), width / 2, boxY + 130);
    }

    // Stats
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    const statX = boxX + 100;
    let statY = boxY + 200;

    const minutes = Math.floor(this.stats.timeElapsed / 60);
    const seconds = this.stats.timeElapsed % 60;

    const statLines = [
      `${t('gameover_timeSurvived')} ${minutes}:${seconds.toString().padStart(2, '0')}`,
      `${t('gameover_finalLevel')} ${this.stats.level}`,
      `${t('gameover_peakChaos')} ${this.stats.chaosLevel}%`,
      `${t('gameover_booksCollected')} ${this.stats.booksCollected}`,
      `${t('gameover_booksShelved')} ${this.stats.booksShelved}`,
      `${t('gameover_kidsRepelled')} ${this.stats.kidsRepelled}`
    ];

    statLines.forEach(line => {
      ctx.fillText(line, statX, statY);
      statY += 30;
    });

    // Menu items
    ctx.textAlign = 'center';
    ctx.font = '32px Arial';
    this.menuItems.forEach((item, index) => {
      const y = boxY + 480 + index * 50;

      if (index === this.selectedIndex) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(boxX + 150, y - 20, boxWidth - 300, 40);
        ctx.fillStyle = '#f5e6d3';
      } else {
        ctx.fillStyle = '#3d2914';
      }

      ctx.fillText(t(item.key), width / 2, y);
    });
    
    ctx.restore();
  }
  
  playAgain() {
    this.game.stateManager.changeState('playing');
  }
  
  mainMenu() {
    this.game.stateManager.changeState('menu');
  }
  
  playSelectSound() {
    if (this.selectSound) {
      this.selectSound.currentTime = 0;
      this.selectSound.play().catch(e => console.log('Select sound play failed:', e));
    }
  }
}