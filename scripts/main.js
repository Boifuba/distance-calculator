/**
 * Distance Calculator Module for FoundryVTT
 * Main initialization file
 */

import { DistanceCalculator } from './distance-calculator.js';

Hooks.once('init', async () => {
  console.log('Distance Calculator | Initializing module');
  
  // Register module settings
  await DistanceCalculator.registerSettings();
});

Hooks.once('ready', () => {
  console.log('Distance Calculator | Module ready');
  
  // Initialize the calculator and make it globally available
  window.DistanceCalculator = new DistanceCalculator();
  
  // Create simple global function for macro access
  window.openDistanceCalculator = () => {
    window.DistanceCalculator.openDialog();
  };
  
  console.log('Distance Calculator | Global functions registered');
  
  // Add control button to drawing tools
  Hooks.on('getSceneControlButtons', (controls) => {
    const drawingControls = controls.find(c => c.name === 'drawings');
    if (drawingControls) {
      drawingControls.tools.push({
        name: 'distance-calculator',
        title: 'DISTANCE_CALC.ButtonTitle',
        icon: 'fas fa-route',
        button: true,
        onClick: () => window.DistanceCalculator.openDialog()
      });
    }
  });
});