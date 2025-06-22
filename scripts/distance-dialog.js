/**
 * Distance Calculator Dialog Class
 */

export class DistanceDialog extends Dialog {
  constructor(currentSettings) {
    const content = `
      <div class="distance-calculator-form">
        <div class="form-header">
          <i class="fas fa-route"></i>
          <p>${game.i18n.localize('DISTANCE_CALC.DialogTitle')}</p>
        </div>
        
        <form class="distance-form">
          <div class="form-section">
            <h3>${game.i18n.localize('DISTANCE_CALC.MapSettings')}</h3>
            
          <div class="form-group">
  <label for="milesPerPixel">
    <i class="fas fa-map"></i>
    ${game.i18n.localize('DISTANCE_CALC.MilesPerPixel')}
  </label>
  <input 
    id="milesPerPixel" 
    name="milesPerPixel" 
    type="number" 
    step="0.0001" 
    min="0" 
    value="${currentSettings.milesPerPixel}"
    placeholder="0.01"
    title="${game.i18n.localize('DISTANCE_CALC.MilesPerPixelHint')}"
  />
</div>

          </div>

         <div class="form-section">
  <h3>${game.i18n.localize('DISTANCE_CALC.TravelSettings')}</h3>

  <div class="form-group">
    <label for="move">
      <i class="fas fa-walking"></i>
      ${game.i18n.localize('DISTANCE_CALC.MoveSpeed')}
    </label>
    <input 
      id="move" 
      name="move" 
      type="number" 
      step="0.1" 
      min="0" 
      value="${currentSettings.move}"
      placeholder="12" 
      title="${game.i18n.localize('DISTANCE_CALC.MoveSpeedHint')}"
    />
  </div>

  <div class="form-group">
    <label for="hoursPerDay">
      <i class="fas fa-clock"></i>
      ${game.i18n.localize('DISTANCE_CALC.HoursPerDay')}
    </label>
    <input 
      id="hoursPerDay" 
      name="hoursPerDay" 
      type="number" 
      step="1" 
      min="1" 
      max="24"
      value="${currentSettings.hoursPerDay}"
      placeholder="8" 
      title="${game.i18n.localize('DISTANCE_CALC.HoursPerDayHint')}"
    />
  </div>
</div>

        </form>
      </div>
    `;

    super({
      title: game.i18n.localize('DISTANCE_CALC.DialogTitle'),
      content: content,
      buttons: {
        calculate: {
          icon: '<i class="fas fa-calculator"></i>',
          label: game.i18n.localize('DISTANCE_CALC.Calculate'),
          callback: (html) => this._onSubmit(html),
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('DISTANCE_CALC.Cancel'),
        },
      },
      default: "calculate",
      width: 500,
      height: "auto",
      classes: ["distance-calculator-dialog"],
      resizable: true
    });
  }

  async _onSubmit(html) {
    const formData = new FormData(html.find('form')[0]);
    const data = Object.fromEntries(formData.entries());

    // Validate input
    const milesPerPixel = parseFloat(data.milesPerPixel);
    const move = parseFloat(data.move);
    const hoursPerDay = parseInt(data.hoursPerDay);

    const validation = this._validateInput(milesPerPixel, move, hoursPerDay);
    if (!validation.valid) {
      ui.notifications.error(validation.message);
      return false;
    }

    // Save settings
    const MODULE_NAME = "distance-calculator";
    await game.settings.set(MODULE_NAME, "milesPerPixel", milesPerPixel);
    await game.settings.set(MODULE_NAME, "move", move);
    await game.settings.set(MODULE_NAME, "hoursPerDay", hoursPerDay);

    ui.notifications.info(
      game.i18n.format('DISTANCE_CALC.SettingsSaved', {
        milesPerPixel: milesPerPixel,
        move: move,
        hoursPerDay: hoursPerDay
      })
    );

    // Calculate distance
    await this._calculateDistance(milesPerPixel, move, hoursPerDay);
    return true;
  }

  _validateInput(milesPerPixel, move, hoursPerDay) {
    if (isNaN(milesPerPixel) || milesPerPixel <= 0) {
      return {
        valid: false,
        message: game.i18n.localize('DISTANCE_CALC.InvalidMilesPerPixel')
      };
    }
    if (isNaN(move) || move <= 0) {
      return {
        valid: false,
        message: game.i18n.localize('DISTANCE_CALC.InvalidMove')
      };
    }
    if (isNaN(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24) {
      return {
        valid: false,
        message: game.i18n.localize('DISTANCE_CALC.InvalidHours')
      };
    }
    return { valid: true };
  }

  async _calculateDistance(milesPerPixel, move, hoursPerDay) {
    const drawing = canvas.drawings.placeables.at(-1);

    if (!drawing) {
      ui.notifications.warn(game.i18n.localize('DISTANCE_CALC.NoDrawingFound'));
      return;
    }

    const doc = drawing.document;

    if (!doc.shape || !doc.shape.type) {
      ui.notifications.warn(game.i18n.localize('DISTANCE_CALC.InvalidDrawingData'));
      return;
    }

    if (!['p', 'polyline', 'polygon'].includes(doc.shape.type)) {
      ui.notifications.warn(game.i18n.localize('DISTANCE_CALC.InvalidDrawingType'));
      return;
    }

    const flatPoints = doc.shape.points;

    if (!flatPoints || flatPoints.length === 0) {
      ui.notifications.warn(game.i18n.localize('DISTANCE_CALC.NoPointsFound'));
      return;
    }

    // Convert flat array to point pairs
    const points = [];
    for (let i = 0; i < flatPoints.length; i += 2) {
      points.push([flatPoints[i], flatPoints[i + 1]]);
    }

    // Calculate total distance in pixels
    const distance = (p1, p2) => Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    let totalDistancePixels = 0;
    
    for (let i = 0; i < points.length - 1; i++) {
      totalDistancePixels += distance(points[i], points[i + 1]);
    }

    // Convert to miles and calculate travel time
    const totalMiles = totalDistancePixels * milesPerPixel;
    const mph = move / 2; // Assuming D&D 5e standard conversion
    const totalHours = totalMiles / mph;

    const days = Math.floor(totalHours / hoursPerDay);
    const hours = Math.floor(totalHours % hoursPerDay);
    const minutes = Math.floor((totalHours - Math.floor(totalHours)) * 60);

    // Create chat message with results
    const chatContent = `
      <div class="distance-calculator-result">
        <div class="result-header">
          <i class="fas fa-route"></i>
          <h3>${game.i18n.localize('DISTANCE_CALC.TravelCalculation')}</h3>
        </div>
        <div class="result-content">
          <div class="result-item">
            <strong>${game.i18n.localize('DISTANCE_CALC.TotalDistance')}:</strong> 
            ${totalMiles.toFixed(2)} ${game.i18n.localize('DISTANCE_CALC.Miles')}
          </div>
          <div class="result-item">
            <strong>${game.i18n.localize('DISTANCE_CALC.EstimatedTime')}:</strong> 
            ${days} ${game.i18n.localize('DISTANCE_CALC.Days')}, 
            ${hours} ${game.i18n.localize('DISTANCE_CALC.Hours')}, 
            ${minutes} ${game.i18n.localize('DISTANCE_CALC.Minutes')}
          </div>
          <div class="result-details">
            <small>
              ${game.i18n.format('DISTANCE_CALC.CalculationDetails', {
                speed: mph,
                hoursPerDay: hoursPerDay
              })}
            </small>
          </div>
        </div>
      </div>
    `;

    await ChatMessage.create({
      content: chatContent,
      whisper: []
    });
  }
}