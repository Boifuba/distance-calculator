# Distance Calculator for FoundryVTT

A beautiful and intuitive module for calculating travel distances and estimated journey times based on drawn paths on your FoundryVTT canvas.

## Features

- **Visual Path Calculation**: Draw any path on your canvas and instantly calculate travel distance
- **Flexible Configuration**: Customize miles per pixel, movement speed, and travel hours per day
- **Beautiful Interface**: Modern, responsive dialog with gradient backgrounds and smooth animations
- **Chat Integration**: Results are automatically posted to chat for all players to see
- **Multiple Drawing Types**: Supports freehand drawings, polylines, and polygons
- **Persistent Settings**: Your configuration is saved between sessions

## Installation

1. In FoundryVTT, go to the **Add-on Modules** tab
2. Click **Install Module**
3. Paste the following URL in the **Manifest URL** field:
   ```
   https://github.com/yourusername/distance-calculator/releases/latest/download/module.json
   ```
4. Click **Install**
5. Enable the module in your world settings

## Usage

1. **Access the Tool**: Find the route icon (🛣️) in your Drawing Tools palette
2. **Draw Your Path**: Use any drawing tool to create a path on your canvas
3. **Open Calculator**: Click the Distance Calculator button
4. **Configure Settings**:
   - **Miles per Pixel**: Set your map's scale (e.g., 0.01 for detailed maps)
   - **Movement Speed**: Enter character movement speed (typically 12 for D&D 5e)
   - **Hours per Day**: Set daily travel hours (typically 8 hours)
5. **Calculate**: Click "Calculate Distance" to get results in chat

## Configuration

### Map Scale (Miles per Pixel)
Determine how many miles each pixel represents on your map. This varies based on your map's zoom level and intended scale.

### Movement Speed
Based on your game system:
- **D&D 5e**: Typically 12 (30 feet per round)
- **Pathfinder**: Varies by character
- **Custom**: Set according to your system

### Travel Hours
Realistic travel considerations:
- **8 hours**: Standard adventuring day
- **12 hours**: Forced march
- **6 hours**: Easy travel with rest

## Technical Details

- **Compatibility**: FoundryVTT v11+
- **Dependencies**: None
- **File Structure**: Modular architecture with separate dialog, calculator, and styling files
- **Localization**: Full English localization with easy translation support

## Support

For issues, feature requests, or contributions:
- **GitHub**: [https://github.com/yourusername/distance-calculator](https://github.com/yourusername/distance-calculator)
- **Issues**: [https://github.com/yourusername/distance-calculator/issues](https://github.com/yourusername/distance-calculator/issues)

## License

This module is licensed under the MIT License. See LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Beautiful dialog interface with gradient styling
- Support for freehand drawings, polylines, and polygons
- Persistent settings storage
- Chat message integration
- Responsive design for all screen sizes
- Full English localization