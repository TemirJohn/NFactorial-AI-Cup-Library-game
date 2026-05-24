import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor(game, x, y) {
    super(x, y, 48, 64); // Increased size from 32x48 to 48x64
    this.game = game;
    
    // Stats (from design doc)
    this.stats = {
      moveSpeed: 3, // meters per second (assuming 1 meter = 32 pixels)
      pickupRadius: 1,
      returnRadius: 0.5, // Half a tile - must be touching shelf
      carrySlots: 5,
      stamina: 100,
      maxStamina: 100,
      chaosDampening: 0,
      xpMultiplier: 1.0 // For Reading Glasses upgrade
    };
    
    // Upgrade tracking
    this.upgradeLevels = {};
    
    // Movement
    this.baseSpeed = this.stats.moveSpeed * 32; // Convert to pixels/second
    this.sprintMultiplier = 1.5;
    this.isSprinting = false;
    
    // Books carried
    this.carriedBooks = [];
    
    // Animation
    this.facing = 'down'; // up, down, left, right
    this.lastHorizontalFacing = 'left'; // Track last horizontal direction for sprite flipping
    this.animationTimer = 0;
    this.animationFrame = 0;
    this.isMoving = false;
    
    // Collision box (covers most of the player)
    this.collisionBox = {
      offsetX: 8,
      offsetY: 24, // Adjusted for larger sprite
      width: 32,
      height: 36  // Adjusted for larger sprite
    };
    
    // Repel radius for kids
    this.repelRadius = 1.5 * 32; // 1.5 meters in pixels

    // Shush Wave weapon (activated via power-up pickup)
    this.shushWave = {
      cooldown: 0,
      cooldownMax: 5,
      range: 220,
      halfAngle: Math.PI / 5, // 36 degrees
      stunDuration: 2.5,
      active: false,
      activeTimer: 0,
      activeDuration: 0.4
    };

    // Power-up state
    this.powerUpTimer = 0;     // shush wave remaining time
    this.powerUpDuration = 30;
    this.coffeeTimer = 0;      // unlimited stamina remaining time
    this.magnetTimer = 0;      // giant pickup radius remaining time

    // Sound effects
    this.outOfBreathSound = null;
    this.isPlayingOutOfBreath = false;
  }
  
  update(deltaTime) {
    const input = this.game.inputManager;
    
    // Get movement input
    const movement = input.getMovementVector();
    
    // Handle sprinting
    this.isSprinting = input.isActionDown('sprint') && this.stats.stamina > 0;
    
    if (this.isSprinting) {
      if (this.coffeeTimer > 0) {
        // Coffee: keep stamina full
        this.stats.stamina = this.stats.maxStamina;
      } else {
        this.stats.stamina -= 20 * deltaTime;
        this.stats.stamina = Math.max(0, this.stats.stamina);
      }
    } else {
      this.stats.stamina += 10 * deltaTime;
      this.stats.stamina = Math.min(this.stats.maxStamina, this.stats.stamina);
    }
    
    // Handle out of breath sound
    if (input.isActionDown('sprint') && this.stats.stamina < 1) {
      // Player is holding shift but has very low stamina
      if (!this.isPlayingOutOfBreath) {
        this.playOutOfBreathSound();
        this.isPlayingOutOfBreath = true;
      }
    } else {
      // Stop the sound if they release shift or regain stamina
      if (this.isPlayingOutOfBreath) {
        this.stopOutOfBreathSound();
        this.isPlayingOutOfBreath = false;
      }
    }
    
    // Calculate speed - only apply sprint multiplier if we have stamina
    const currentSpeed = this.baseSpeed * (this.isSprinting && this.stats.stamina > 0 ? this.sprintMultiplier : 1);
    
    // Apply movement
    this.vx = movement.x * currentSpeed;
    this.vy = movement.y * currentSpeed;
    
    // Calculate new position
    const newX = this.x + this.vx * deltaTime;
    const newY = this.y + this.vy * deltaTime;
    
    // Check collisions with shelves
    const state = this.game.stateManager.currentState;
    let canMoveX = true;
    let canMoveY = true;
    
    if (state && state.shelves) {
      for (const shelf of state.shelves) {
        // Check X movement
        if (this.checkCollision(newX, this.y, shelf)) {
          canMoveX = false;
        }
        // Check Y movement
        if (this.checkCollision(this.x, newY, shelf)) {
          canMoveY = false;
        }
        // Check diagonal movement if both X and Y are blocked
        if (!canMoveX && !canMoveY && this.checkCollision(newX, newY, shelf)) {
          break; // Already blocked in both directions
        }
      }
    }
    
    // Apply movement if no collision
    if (canMoveX) {
      this.x = newX;
    }
    if (canMoveY) {
      this.y = newY;
    }
    
    // Keep within world bounds
    if (state && state.worldWidth && state.worldHeight) {
      this.x = Math.max(0, Math.min(state.worldWidth - this.width, this.x));
      this.y = Math.max(0, Math.min(state.worldHeight - this.height, this.y));
    }
    
    // Update facing direction only when moving - prioritize horizontal movement
    if (this.vx !== 0 || this.vy !== 0) {
      // Only update facing when actually moving
      if (this.vx !== 0) {
        // If moving horizontally at all, face left or right
        this.facing = this.vx > 0 ? 'right' : 'left';
        this.lastHorizontalFacing = this.facing; // Remember horizontal direction
      } else {
        // Only face up/down if not moving horizontally
        this.facing = this.vy > 0 ? 'down' : 'up';
      }
    }
    // When not moving, maintain the last facing direction
    
    // Update animation
    this.isMoving = this.vx !== 0 || this.vy !== 0;
    if (this.isMoving) {
      this.animationTimer += deltaTime;
      if (this.animationTimer >= 0.2) {
        this.animationFrame = (this.animationFrame + 1) % 2; // Alternate between 2 frames
        this.animationTimer = 0;
      }
    } else {
      this.animationFrame = 0;
      this.animationTimer = 0;
    }
    
    // Countdown power-up timers
    if (this.powerUpTimer > 0) this.powerUpTimer -= deltaTime;
    if (this.coffeeTimer > 0)  this.coffeeTimer  -= deltaTime;
    if (this.magnetTimer > 0)  this.magnetTimer  -= deltaTime;

    // Update shush wave cooldown and animation
    if (this.shushWave.cooldown > 0) {
      this.shushWave.cooldown -= deltaTime;
    }
    if (this.shushWave.active) {
      this.shushWave.activeTimer += deltaTime;
      if (this.shushWave.activeTimer >= this.shushWave.activeDuration) {
        this.shushWave.active = false;
      }
    }

    // Update camera to follow player
    this.game.camera.follow(this);
  }
  
  render(ctx, interpolation) {
    // Get appropriate sprite based on animation frame
    let sprite;
    if (this.isMoving) {
      sprite = this.animationFrame === 0 
        ? this.game.assetLoader.getImage('librarianWalk1')
        : this.game.assetLoader.getImage('librarianWalk2');
    } else {
      sprite = this.game.assetLoader.getImage('librarianStand'); // Use standing sprite when not moving
    }
    
    // Fallback to placeholder if sprites not loaded
    if (!sprite) {
      sprite = this.game.assetLoader.getImage('librarian');
    }
    
    // Draw speed trail effect if moving fast with upgrades
    const speedLevel = this.upgradeLevels?.speed || 0;
    if (speedLevel > 0 && (this.vx !== 0 || this.vy !== 0)) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      
      // Draw motion blur trails
      for (let i = 1; i <= speedLevel; i++) {
        const trailX = this.x - (this.vx * 0.01 * i);
        const trailY = this.y - (this.vy * 0.01 * i);
        ctx.globalAlpha = 0.3 - (i * 0.05);
        
        if (sprite) {
          this.game.renderer.drawSprite(
            sprite,
            trailX,
            trailY,
            this.width,
            this.height,
            {
              flipX: this.lastHorizontalFacing === 'right' // Use last horizontal direction for flipping
            }
          );
        }
      }
      ctx.restore();
    }
    
    if (!sprite) return;
    
    // Draw sprite with direction flipping
    this.game.renderer.drawSprite(
      sprite,
      this.x,
      this.y,
      this.width,
      this.height,
      {
        flipX: this.lastHorizontalFacing === 'right' // Use last horizontal direction for flipping
      }
    );
    
    // Shush wave aura (blue)
    if (this.powerUpTimer > 0) {
      const auraAlpha = 0.25 + Math.sin(Date.now() * 0.005) * 0.1;
      const auraR = 36 + Math.sin(Date.now() * 0.004) * 4;
      ctx.save();
      ctx.globalAlpha = auraAlpha;
      ctx.strokeStyle = '#66aaff';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(this.getCenterX(), this.getCenterY(), auraR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Coffee aura (golden)
    if (this.coffeeTimer > 0) {
      const auraAlpha = 0.3 + Math.sin(Date.now() * 0.006) * 0.12;
      const auraR = 28 + Math.sin(Date.now() * 0.005) * 3;
      ctx.save();
      ctx.globalAlpha = auraAlpha;
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.arc(this.getCenterX(), this.getCenterY(), auraR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Magnet aura (purple, large)
    if (this.magnetTimer > 0) {
      const auraAlpha = 0.2 + Math.sin(Date.now() * 0.007) * 0.1;
      const auraR = this.stats.pickupRadius * 32 * 5 + Math.sin(Date.now() * 0.003) * 6;
      ctx.save();
      ctx.globalAlpha = auraAlpha;
      ctx.strokeStyle = '#dd44ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.arc(this.getCenterX(), this.getCenterY(), auraR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Draw shush wave cone animation
    if (this.shushWave.active) {
      const progress = this.shushWave.activeTimer / this.shushWave.activeDuration;
      const alpha = 1 - progress;
      const waveRadius = this.shushWave.range * (0.3 + progress * 0.7);
      const waveAngle = this.getShushWaveAngle();
      const halfAngle = this.shushWave.halfAngle;
      const cx = this.getCenterX();
      const cy = this.getCenterY();

      ctx.save();
      ctx.globalAlpha = alpha * 0.55;
      ctx.fillStyle = '#88ccff';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, waveRadius, waveAngle - halfAngle, waveAngle + halfAngle);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#4499ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, waveRadius, waveAngle - halfAngle, waveAngle + halfAngle);
      ctx.closePath();
      ctx.stroke();

      // "SHHH!" floating text
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textX = cx + Math.cos(waveAngle) * waveRadius * 0.65;
      const textY = cy + Math.sin(waveAngle) * waveRadius * 0.65;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText('SHHH!', textX, textY);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SHHH!', textX, textY);

      ctx.restore();
    }

    // Draw pickup radius indicator when Long Arms upgrade is active
    if (this.upgradeLevels?.pickupRadius > 0) {
      ctx.save();
      
      // Enhanced pulsing effect
      const pulseScale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
      const radius = this.stats.pickupRadius * 32 * pulseScale;
      const centerX = this.getCenterX();
      const centerY = this.getCenterY();
      
      // Outer glow circle
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
      ctx.stroke();
      
      // Main circle with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, radius - 10, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(100, 200, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(100, 200, 255, 0.3)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]); // Dashed line
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner bright circle for emphasis
      ctx.strokeStyle = 'rgba(150, 220, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]); // Solid line
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 4, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    }
    
    // Draw pickup radius (debug)
    if (this.game.debug.showCollisionBoxes) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        this.getCenterX(),
        this.getCenterY(),
        this.stats.pickupRadius * 32,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      
      // Draw repel radius
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(
        this.getCenterX(),
        this.getCenterY(),
        this.repelRadius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw carried books indicator with colors
    if (this.carriedBooks.length > 0) {
      ctx.save();
      
      // Draw book count
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${this.carriedBooks.length}/${this.stats.carrySlots}`,
        this.getCenterX(),
        this.y - 5
      );
      
      // Draw colored indicators for each book type
      const bookColors = {};
      this.carriedBooks.forEach(book => {
        bookColors[book.color] = (bookColors[book.color] || 0) + 1;
      });
      
      let offsetX = -20;
      Object.entries(bookColors).forEach(([color, count]) => {
        // Draw colored circle for each book type
        const colorHex = this.getBookColorHex(color);
        ctx.fillStyle = colorHex;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.arc(this.getCenterX() + offsetX, this.y - 20, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw count if more than 1
        if (count > 1) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 8px Arial';
          ctx.fillText(count.toString(), this.getCenterX() + offsetX, this.y - 17);
        }
        
        offsetX += 15;
      });
      
      ctx.restore();
    }
  }
  
  activatePowerUp() {
    this.powerUpTimer = this.powerUpDuration;
    this.shushWave.cooldown = 0; // ready to use immediately
  }

  triggerShushWave() {
    if (this.powerUpTimer <= 0 || this.shushWave.cooldown > 0) return false;
    this.shushWave.cooldown = this.shushWave.cooldownMax;
    this.shushWave.active = true;
    this.shushWave.activeTimer = 0;
    return true;
  }

  getShushWaveAngle() {
    switch (this.facing) {
      case 'right': return 0;
      case 'left': return Math.PI;
      case 'down': return Math.PI / 2;
      case 'up': return -Math.PI / 2;
      default: return 0;
    }
  }

  pickupBook(book) {
    if (this.carriedBooks.length >= this.stats.carrySlots) {
      return false;
    }
    
    this.carriedBooks.push(book);
    return true;
  }
  
  shelveBook(shelf) {
    // Find a book that matches this shelf's color
    const bookIndex = this.carriedBooks.findIndex(
      book => book.color === shelf.color
    );
    
    if (bookIndex !== -1) {
      const book = this.carriedBooks.splice(bookIndex, 1)[0];
      return book;
    }
    
    return null;
  }
  
  dropAllBooks() {
    const dropped = [...this.carriedBooks];
    this.carriedBooks = [];
    return dropped;
  }
  
  // Upgrade methods
  upgrade(stat, amount) {
    switch (stat) {
      case 'moveSpeed':
        this.stats.moveSpeed += amount;
        this.baseSpeed = this.stats.moveSpeed * 32;
        break;
      case 'pickupRadius':
        this.stats.pickupRadius += amount;
        break;
      case 'returnRadius':
        this.stats.returnRadius += amount;
        break;
      case 'carrySlots':
        this.stats.carrySlots += amount;
        break;
      case 'stamina':
        this.stats.maxStamina += amount;
        this.stats.stamina += amount;
        break;
      case 'chaosDampening':
        this.stats.chaosDampening += amount;
        break;
      case 'xpMultiplier':
        this.stats.xpMultiplier += amount;
        break;
    }
  }
  
  getXPMultiplier() {
    return this.stats.xpMultiplier;
  }
  
  checkCollision(x, y, entity) {
    // Check if entity has a collision box
    if (!entity.collisionBox) {
      return false;
    }
    
    // Calculate player's collision bounds at new position using collision box
    const playerLeft = x + this.collisionBox.offsetX;
    const playerRight = playerLeft + this.collisionBox.width;
    const playerTop = y + this.collisionBox.offsetY;
    const playerBottom = playerTop + this.collisionBox.height;
    
    // Calculate entity's collision bounds
    const entityLeft = entity.x + entity.collisionBox.offsetX;
    const entityRight = entityLeft + entity.collisionBox.width;
    const entityTop = entity.y + entity.collisionBox.offsetY;
    const entityBottom = entityTop + entity.collisionBox.height;
    
    // Check for overlap
    return !(playerLeft >= entityRight || 
             playerRight <= entityLeft || 
             playerTop >= entityBottom || 
             playerBottom <= entityTop);
  }
  
  getBookColorHex(color) {
    const colors = {
      red: '#ff4444',
      blue: '#4444ff',
      green: '#44ff44',
      yellow: '#ffff44',
      purple: '#ff44ff',
      orange: '#ff8844'
    };
    return colors[color] || '#888888';
  }
  
  playOutOfBreathSound() {
    if (!this.outOfBreathSound) {
      this.outOfBreathSound = new Audio('./out_of_breath.mp3');
      this.outOfBreathSound.volume = 0.6;
      this.outOfBreathSound.loop = true;
    }
    this.outOfBreathSound.play().catch(e => console.log('Out of breath sound play failed:', e));
  }
  
  stopOutOfBreathSound() {
    if (this.outOfBreathSound) {
      this.outOfBreathSound.pause();
      this.outOfBreathSound.currentTime = 0;
    }
  }
  
  cleanup() {
    // Stop all sounds when player is cleaned up
    this.stopOutOfBreathSound();
    this.isPlayingOutOfBreath = false;
  }
}