/**
 * Distance Calculator Main Class
 */

import { DistanceDialog } from './distance-dialog.js';

export class DistanceCalculator {
  static MODULE_NAME = "distance-calculator";

  constructor() {
    this.settings = {};
    this.loadSettings();
  }

  /**
   * Register module settings
   */
  static async registerSettings() {
    const settings = [
      {
        key: "milesPerPixel",
        data: {
          name: "DISTANCE_CALC.MilesPerPixel",
          hint: "DISTANCE_CALC.MilesPerPixelHint",
          scope: "world",
          config: false,
          type: Number,
          default: 0.01,
        }
      },
      {
        key: "move",
        data: {
          name: "DISTANCE_CALC.MoveSpeed",
          hint: "DISTANCE_CALC.MoveSpeedHint",
          scope: "world",
          config: false,
          type: Number,
          default: 12,
        }
      },
      {
        key: "hoursPerDay",
        data: {
          name: "DISTANCE_CALC.HoursPerDay",
          hint: "DISTANCE_CALC.HoursPerDayHint",
          scope: "world",
          config: false,
          type: Number,
          default: 8,
        }
      }
    ];

    for (const setting of settings) {
      if (!game.settings.settings.has(`${this.MODULE_NAME}.${setting.key}`)) {
        await game.settings.register(this.MODULE_NAME, setting.key, setting.data);
      }
    }
  }

  /**
   * Load current settings
   */
  loadSettings() {
    this.settings = {
      milesPerPixel: game.settings.get(DistanceCalculator.MODULE_NAME, "milesPerPixel"),
      move: game.settings.get(DistanceCalculator.MODULE_NAME, "move"),
      hoursPerDay: game.settings.get(DistanceCalculator.MODULE_NAME, "hoursPerDay")
    };
  }

  /**
   * Open the distance calculator dialog
   */
  openDialog() {
    this.loadSettings();
    new DistanceDialog(this.settings).render(true);
  }

  /**
   * Quick calculate without dialog (for API use)
   */
  async quickCalculate(drawing = null) {
    this.loadSettings();
    
    const targetDrawing = drawing || canvas.drawings.placeables.at(-1);
    
    if (!targetDrawing) {
      ui.notifications.warn(game.i18n.localize('DISTANCE_CALC.NoDrawingFound'));
      return null;
    }

    // Use the same calculation logic as the dialog
    const dialog = new DistanceDialog(this.settings);
    await dialog._calculateDistance(
      this.settings.milesPerPixel, 
      this.settings.move, 
      this.settings.hoursPerDay
    );
  }
}