/**
 * Calculation engine for the Solar Configurator Web Dashboard.
 *
 * These functions are simplified, browser/server-safe re-implementations of
 * the logic behind the AutoCAD plugin's "Place Tables", "Place Piles", and
 * "Messenger Wire Length" tools — reworked to run on numeric project inputs
 * instead of live CAD geometry.
 */

/**
 * Estimate how many MMS tables fit inside a rectangular plot, given pitch
 * spacing and a boundary setback (mirrors the plugin's "Place Tables" tool,
 * which packs tables inside an offset boundary while respecting pitch).
 */
function calculateTablePlacement({
  boundaryWidthM,
  boundaryHeightM,
  tableWidthM,
  tableLengthM,
  pitch1M,
  pitch2M,
  setbackM = 3,
}) {
  const usableWidth = Math.max(boundaryWidthM - 2 * setbackM, 0);
  const usableHeight = Math.max(boundaryHeightM - 2 * setbackM, 0);

  // Effective footprint per table, including pitch spacing on both axes.
  const cellWidth = tableWidthM + pitch1M;
  const cellHeight = tableLengthM + pitch2M;

  const columns = cellWidth > 0 ? Math.floor(usableWidth / cellWidth) : 0;
  const rows = cellHeight > 0 ? Math.floor(usableHeight / cellHeight) : 0;

  const totalTables = Math.max(rows * columns, 0);

  return {
    rows,
    columns,
    totalTables,
    usableWidth,
    usableHeight,
  };
}

/**
 * Estimate pile count from table count (mirrors "Place Piles", which places
 * a fixed number of piles per table based on table type).
 */
function calculatePiles({ totalTables, pilesPerTable = 4 }) {
  return {
    totalPiles: totalTables * pilesPerTable,
  };
}

/**
 * Estimate total messenger-wire / cable length for a layout, similar to the
 * plugin's "Messenger Wire Length" and "Export Spreadsheet" tools, which sum
 * cable runs and categorize them by direction/type.
 */
function calculateCableBOQ(cableRuns = []) {
  const byType = {};
  let totalLength = 0;
  let totalCost = 0;

  cableRuns.forEach((run) => {
    const length = Number(run.avgLengthM) * Number(run.count);
    const cost = length * Number(run.costPerMeter || 0);

    totalLength += length;
    totalCost += cost;

    const key = `${run.cableType} (${run.routing})`;
    byType[key] = (byType[key] || 0) + length;
  });

  return {
    totalLength: Math.round(totalLength * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    byType,
  };
}

/**
 * Full-project summary combining table placement, piling, and a rough
 * material cost estimate — the web-app equivalent of the plugin's BOQ /
 * Export Spreadsheet output.
 */
function summarizeProject(project) {
  const placement = calculateTablePlacement({
    boundaryWidthM: Number(project.boundary_width_m),
    boundaryHeightM: Number(project.boundary_height_m),
    tableWidthM: Number(project.table_width_m),
    tableLengthM: Number(project.table_length_m),
    pitch1M: Number(project.pitch1_m),
    pitch2M: Number(project.pitch2_m),
    setbackM: Number(project.setback_m),
  });

  const piles = calculatePiles({
    totalTables: placement.totalTables,
    pilesPerTable: Number(project.piles_per_table),
  });

  return { placement, piles };
}

module.exports = {
  calculateTablePlacement,
  calculatePiles,
  calculateCableBOQ,
  summarizeProject,
};
