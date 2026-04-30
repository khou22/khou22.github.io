---
title: "Getting Started with the CNC Router"
author: "Kevin Hou"
date: 2016-03-06 23:59:45
description: "Part of a wood project I'm working on. Using SketchUp and Aspire to prepare the CNC cutpath."
image: "/media/blog/images/Blog_Post_Placeholder_Image.jpg"
tags: []
featured: false
---

## Cutting Topographical Maps on the CNC Router

This guide serves as a central reference point for fabricating detailed topographical maps using a CNC router. While this article originated from my own personal workspace notes, documenting the nuances and hurdles of computer-aided manufacturing (CAM) workflows provides a foundational guide for anyone attempting to carve intricate landscape geometries. 

As this project continues to evolve and further technical challenges arise, I plan to expand upon the strategies outlined below.

---

### Preparing the Model: SketchUp to Rhino

The physical creation of a topographical piece begins digitally with source terrain data and a reliable 3D modeling pipeline. The primary workflow relies on SketchUp, Google Earth data, and Rhino for scaling and machine path generation.

1. **Source Terrain Acquisition**: Using the Google Earth plugin inside of SketchUp, use the **Add Location** feature under the Geo-location options to choose the desired terrain boundaries. 
2. **Terrain Extraction**: Ensure that the software is displaying actual terrain contours by activating the **Show Terrain** toggle.
3. **Model Exportation**: Export the resulting geometry directly from SketchUp as a `.3ds` mesh file.
4. **Re-scaling & Sizing**: Import the `.3ds` file into Rhino, choosing the **Component / 3D Model** import type. From here, establish your workpiece bounds, taking note to scale dimensions precisely against your target physical stock material.

### Generating Machine Operations

Once the digital model matches real-world dimensions, toolpaths are constructed to safely and efficiently transform raw timber into topographic contours.

* **Establishing Toolpaths**: Prepare the raw model inside CAM software (such as Aspire or RhinoCAM) by configuring the material setup and tool database.
* **Roughing Operations**: Execute a **3D Rough Toolpath** first. This operation utilizes a larger end-mill or roughing tool to remove bulk stock quickly in stepped layers, leaving a stepped approximation of the terrain.
* **Finishing Passes**: Conclude the physical machining with a **3D Finishing Toolpath**. Using a smaller ball-nose bit and tight stepover tolerances, the finishing run tracks the exact curvature of the imported terrain to produce smooth, sweeping topography.
