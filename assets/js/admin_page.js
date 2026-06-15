import { APP_CONFIG } from "./config.js";

const TABLES = {
  locations: "farm_locations",
  datasets: "tide_datasets",
  adminUsers: "tide_admin_users",
  calibrationRecords: "location_tide_calibrations",
  calibrationSummary: "location_tide_calibration_admin_summary"
};

const AUTH_SESSION_KEY = "seaweed_tide_planner:admin_auth_session";
const LANGUAGE_SETTINGS_KEY = "seaweed_tide_planner:admin_language_status";
const NEW_LOCATION_ID = "__new_location__";
const NEW_DATASET_ID = "__new_dataset__";

const DATASET_STATUSES = [
  "imported_unverified",
  "pending_review",
  "verified",
  "superseded",
  "rejected"
];

const state = {
  locations: [],
  datasets: [],
  calibrations: [],
  calibrationRecords: [],
  adminUsers: [],
  authSession: null,
  hasLocationDraft: false,
  hasDatasetDraft: false,
  editingLocationId: null,
  editingDatasetId: null,
  selectedCalibrationId: null,
  requestedCalibrationLocationId: ""
};

const els = {};

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("unhandledrejection", (event) => {
  setConnectionStatus("Load error", "status-muted");
  setStatus(els.locationSaveStatus, event.reason?.message || "Unexpected admin page error.", "error");
});

async function init() {
  cacheElements();
  state.requestedCalibrationLocationId = new URLSearchParams(window.location.search).get("location_id") || "";
  bindEvents();
  loadStoredAuthSession();
  updateAuthUi();
  await verifyStoredSession();
  await loadAll();
}

function cacheElements() {
  [
    "adminConnectionStatus",
    "adminAuthStatus",
    "adminLoginModal",
    "adminAuthForm",
    "adminEmail",
    "adminPassword",
    "adminSignIn",
    "adminSignOut",
    "reloadAdminDashboard",
    "metricFarmCount",
    "metricTideSourceCount",
    "metricUnverifiedSources",
    "metricHiddenFarms",
    "metricNotVerifiedFarms",
    "metricNotCalibrated",
    "metricExpiringDatasets",
    "locationCount",
    "datasetCount",
    "locationSaveStatus",
    "datasetSaveStatus",
    "locationsTableBody",
    "datasetsTableBody",
    "reloadLocations",
    "reloadDatasets",
    "newLocation",
    "newDataset",
    "adminUserCount",
    "adminUsersStatus",
    "adminUsersTableBody",
    "reloadAdminUsers",
    "languageSettingsStatus",
    "reloadCalibration",
    "calibrationForm",
    "calibrationLocation",
    "calibrationDataset",
    "calibrationStatus",
    "calibrationConfidence",
    "lowTideOffset",
    "highTideOffset",
    "curveOffset",
    "heightRatio",
    "heightOffset",
    "harvestThreshold",
    "observationRecordNumber",
    "lastEditedBy",
    "calibrationNotes",
    "calibrationSaveStatus",
    "calibrationRowCount",
    "calibrationTableBody"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els.adminAuthForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await signIn();
  });

  els.adminSignOut.addEventListener("click", async () => {
    await signOut();
  });

  els.reloadLocations?.addEventListener("click", () => loadLocations());
  els.reloadDatasets?.addEventListener("click", () => loadDatasets());
  els.reloadAdminUsers?.addEventListener("click", () => loadAdminUsers());
  els.reloadAdminDashboard?.addEventListener("click", () => loadAll());
  els.reloadCalibration?.addEventListener("click", () => loadCalibrationPanelData());

  document.querySelectorAll("[data-language-status]").forEach((select) => {
    select.addEventListener("change", saveLanguageSettings);
  });

  els.newLocation?.addEventListener("click", () => {
    if (!state.authSession) {
      setStatus(els.locationSaveStatus, "Sign in before adding a location.", "error");
      return;
    }
    state.hasLocationDraft = true;
    state.editingLocationId = NEW_LOCATION_ID;
    renderLocations();
    setStatus(els.locationSaveStatus, "New location row added. Click Create when ready.");
  });

  els.newDataset?.addEventListener("click", () => {
    if (!state.authSession) {
      setStatus(els.datasetSaveStatus, "Sign in before adding a dataset.", "error");
      return;
    }
    state.hasDatasetDraft = true;
    state.editingDatasetId = NEW_DATASET_ID;
    renderDatasets();
    setStatus(els.datasetSaveStatus, "New dataset row added. Click Create when ready.");
  });

  els.locationsTableBody?.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-location]");
    if (editButton) {
      if (!state.authSession) {
        setStatus(els.locationSaveStatus, "Sign in before editing a location.", "error");
        return;
      }
      state.editingLocationId = editButton.closest("tr").dataset.rowId;
      renderLocations();
      setStatus(els.locationSaveStatus, "Editing row. Click Save to commit changes.");
      return;
    }

    const calibrationButton = event.target.closest("[data-edit-calibration]");
    if (calibrationButton) {
      if (!state.authSession) {
        setStatus(els.locationSaveStatus, "Sign in before editing calibration.", "error");
        return;
      }
      loadCalibrationIntoForm(calibrationButton.dataset.editCalibration);
      els.calibrationForm?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const button = event.target.closest("[data-save-location]");
    if (!button) return;
    await saveLocationRow(button.closest("tr"));
  });

  els.datasetsTableBody?.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-dataset]");
    if (editButton) {
      if (!state.authSession) {
        setStatus(els.datasetSaveStatus, "Sign in before editing a dataset.", "error");
        return;
      }
      state.editingDatasetId = editButton.closest("tr").dataset.rowId;
      renderDatasets();
      setStatus(els.datasetSaveStatus, "Editing row. Click Save to commit changes.");
      return;
    }

    const button = event.target.closest("[data-save-dataset]");
    if (!button) return;
    await saveDatasetRow(button.closest("tr"));
  });

  els.adminUsersTableBody?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-save-admin-user]");
    if (!button) return;
    await saveAdminUserRow(button.closest("tr"));
  });

  els.calibrationLocation?.addEventListener("change", () => {
    loadCalibrationIntoForm(els.calibrationLocation.value);
  });

  els.calibrationForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveCalibration();
  });

  els.calibrationTableBody?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit-calibration]");
    if (!button) return;
    loadCalibrationIntoForm(button.dataset.editCalibration);
    els.calibrationForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

async function loadAll() {
  setConnectionStatus("Loading", "status-muted");
  try {
    loadLanguageSettings();
    await loadDatasets({ quiet: true });
    await loadCalibrations({ quiet: true });
    await loadLocations({ quiet: true });
    if (state.authSession) await loadAdminUsers({ quiet: true });
    renderCalibrationPanel();
    renderDashboardMetrics();
    setConnectionStatus(state.authSession ? "Admin connected" : "Public connected", "");
    setSignedOutHints();
  } catch (error) {
    setConnectionStatus("Supabase error", "status-muted");
    setStatus(els.locationSaveStatus, error.message, "error");
    setStatus(els.datasetSaveStatus, error.message, "error");
  }
}

async function loadAdminUsers(options = {}) {
  if (!els.adminUsersTableBody) return;
  if (!state.authSession) {
    state.adminUsers = [];
    renderAdminUsers();
    setStatus(els.adminUsersStatus, "Sign in to list admin users.");
    return;
  }

  if (!options.quiet) setStatus(els.adminUsersStatus, "Loading admin users...");
  state.adminUsers = await supabaseSelect(TABLES.adminUsers, "select=*&order=email.asc");
  renderAdminUsers();
  if (!options.quiet) setStatus(els.adminUsersStatus, `Loaded ${state.adminUsers.length} admin user(s).`);
}

async function loadLocations(options = {}) {
  if (!options.quiet) setStatus(els.locationSaveStatus, "Loading locations...");
  state.locations = await supabaseSelect(TABLES.locations, "select=*&order=farm_name.asc");
  state.hasLocationDraft = false;
  state.editingLocationId = null;
  renderLocations();
  renderCalibrationPanel();
  renderDashboardMetrics();
  if (!options.quiet) setStatus(els.locationSaveStatus, `Loaded ${state.locations.length} location row(s).`);
}

async function loadDatasets(options = {}) {
  if (!options.quiet) setStatus(els.datasetSaveStatus, "Loading tide datasets...");
  state.datasets = await supabaseSelect(TABLES.datasets, "select=*&order=dataset_key.asc");
  state.hasDatasetDraft = false;
  state.editingDatasetId = null;
  renderDatasets();
  renderCalibrationPanel();
  renderDashboardMetrics();
  if (!options.quiet) setStatus(els.datasetSaveStatus, `Loaded ${state.datasets.length} dataset row(s).`);
}

async function loadCalibrations(options = {}) {
  try {
    state.calibrations = await supabaseSelect(TABLES.calibrationSummary, "select=*&order=location_name.asc");
  } catch (error) {
    state.calibrations = [];
    if (!options.quiet) {
      setStatus(els.locationSaveStatus, `Calibration summary unavailable. Apply the observation/calibration SQL first. ${error.message}`, "error");
    }
  }

  if (!hasCalibrationPanel()) {
    state.calibrationRecords = [];
    return;
  }

  try {
    state.calibrationRecords = await supabaseSelect(TABLES.calibrationRecords, "select=*&order=updated_at.desc");
  } catch (error) {
    state.calibrationRecords = [];
    if (!options.quiet) {
      setStatus(els.calibrationSaveStatus, `Calibration records unavailable. ${writeErrorMessage(error)}`, "error");
    }
  }

  renderCalibrationPanel();
}

async function loadCalibrationPanelData() {
  if (!hasCalibrationPanel()) return;
  setStatus(els.calibrationSaveStatus, "Loading calibration data...");
  try {
    await loadDatasets({ quiet: true });
    await loadLocations({ quiet: true });
    await loadCalibrations({ quiet: true });
    renderCalibrationPanel();
    setStatus(els.calibrationSaveStatus, `Loaded ${state.calibrations.length} calibration row(s).`);
  } catch (error) {
    setStatus(els.calibrationSaveStatus, writeErrorMessage(error), "error");
  }
}

function renderDashboardMetrics() {
  const farms = state.locations.filter((location) => location.active !== false);
  const tideSources = state.datasets;
  const unverifiedSources = tideSources.filter((dataset) => {
    return !["verified", "complete"].includes(String(dataset.verification_status || "").toLowerCase());
  });
  const hiddenFarms = farms.filter((location) => location.public_visible === false || location.active === false);
  const notVerifiedFarms = farms.filter((location) => {
    const status = String(location.status || "").toLowerCase();
    return status && !["active", "verified"].includes(status);
  });
  const notCalibrated = farms.filter((location) => {
    return calibrationStatusForLocation(location).value === "none";
  });
  const expiringDatasets = tideSources.filter((dataset) => {
    return datasetExpiresWithinMonths(dataset, 3);
  });

  setMetric("metricFarmCount", farms.length);
  setMetric("metricTideSourceCount", tideSources.length);
  setMetric("metricUnverifiedSources", unverifiedSources.length);
  setMetric("metricHiddenFarms", hiddenFarms.length);
  setMetric("metricNotVerifiedFarms", notVerifiedFarms.length);
  setMetric("metricNotCalibrated", notCalibrated.length);
  setMetric("metricExpiringDatasets", expiringDatasets.length);
}

function setMetric(id, value) {
  if (els[id]) els[id].textContent = String(value);
}

function datasetExpiresWithinMonths(dataset, monthCount) {
  if (!dataset.valid_to) return false;
  const validTo = new Date(`${dataset.valid_to}T00:00:00Z`);
  if (Number.isNaN(validTo.getTime())) return false;
  const threshold = new Date();
  threshold.setMonth(threshold.getMonth() + monthCount);
  return validTo <= threshold;
}

function renderLocations() {
  const rows = state.hasLocationDraft ? [defaultLocation(), ...state.locations] : state.locations;
  if (!els.locationCount || !els.locationsTableBody) return;
  els.locationCount.textContent = `${rows.length} row${rows.length === 1 ? "" : "s"}`;

  if (!rows.length) {
    els.locationsTableBody.innerHTML = emptyRow(10, "No visible locations returned from Supabase.");
    return;
  }

  els.locationsTableBody.innerHTML = rows.map((row, index) => renderLocationRow(row, index)).join("");
}

function renderAdminUsers() {
  if (!els.adminUsersTableBody) return;
  if (els.adminUserCount) {
    els.adminUserCount.textContent = `${state.adminUsers.length} user${state.adminUsers.length === 1 ? "" : "s"}`;
  }

  if (!state.authSession) {
    els.adminUsersTableBody.innerHTML = emptyRow(7, "Sign in to load admin users.");
    return;
  }

  if (!state.adminUsers.length) {
    els.adminUsersTableBody.innerHTML = emptyRow(7, "No admin users returned from Supabase.");
    return;
  }

  els.adminUsersTableBody.innerHTML = state.adminUsers.map(renderAdminUserRow).join("");
}

function renderAdminUserRow(row) {
  const role = row.role || "operator";
  const activeValue = row.active === false ? "inactive" : "active";

  return `
    <tr data-user-id="${escapeAttribute(row.user_id)}">
      <td>${readOnlyCell(row.email)}</td>
      <td class="id-cell">${readOnlyCell(shortId(row.user_id))}</td>
      <td>${selectInput("role", role, adminRoleOptions(role))}</td>
      <td>${selectInput("active", activeValue, [["active", "Active"], ["inactive", "Inactive"]])}</td>
      <td>${textInput("notes", row.notes, "notes")}</td>
      <td>${readOnlyCell(formatDateTime(row.updated_at))}</td>
      <td class="save-cell" data-admin-only>
        <button type="button" data-save-admin-user ${state.authSession ? "" : "disabled"}>Save</button>
      </td>
    </tr>
  `;
}

function renderLocationRow(row, index) {
  const isNew = !row.id;
  const rowId = isNew ? NEW_LOCATION_ID : row.id;
  const isEditing = rowId === state.editingLocationId;
  const rowClass = [isNew ? "draft-row" : "", isEditing ? "editing-row" : ""].filter(Boolean).join(" ");
  const datasetOptions = [
    ["", "Not linked"],
    ...state.datasets.map((dataset) => [dataset.id, dataset.dataset_name])
  ];
  const selectedDatasetId = row.default_tide_dataset_id || datasetIdForKey(row.default_tide_dataset_key);

  if (!isEditing) {
    return `
      <tr data-row-id="${escapeAttribute(rowId)}" data-row-kind="location" class="${rowClass}">
        <td class="id-cell">${locationIdCell(row, index)}</td>
        <td>${readOnlyCell(row.farm_name)}</td>
        <td>${readOnlyCell(row.short_name)}</td>
        <td>${readOnlyCell(row.region)}</td>
        <td>${readOnlyCell(formatCoordinate(row.latitude))}</td>
        <td>${readOnlyCell(formatCoordinate(row.longitude))}</td>
        <td>${readOnlyCell(datasetLabel(row.default_tide_dataset_id || row.default_tide_dataset_key))}</td>
        <td>${calibrationStatusCell(row)}</td>
        <td>${readOnlyCell(recordUseLabel(row, "Shown in app"))}</td>
        <td class="save-cell" data-admin-only>
          <div class="row-action-stack">
            <button type="button" data-edit-location ${state.authSession ? "" : "disabled"}>Edit</button>
            ${editCalibrationLink(row)}
          </div>
        </td>
      </tr>
    `;
  }

  return `
    <tr data-row-id="${escapeAttribute(rowId)}" data-row-kind="location" class="${rowClass}">
      <td class="id-cell">${locationIdCell(row, index)}</td>
      <td>${textInput("farm_name", row.farm_name, "name")}</td>
      <td>${textInput("short_name", row.short_name, "short name")}</td>
      <td>${textInput("region", row.region, "region")}</td>
      <td>${numberInput("latitude", row.latitude, "latitude", "-90", "90", "0.000001")}</td>
      <td>${numberInput("longitude", row.longitude, "longitude", "-180", "180", "0.000001")}</td>
      <td>${selectInput("default_tide_dataset_id", selectedDatasetId, datasetOptions)}</td>
      <td>${calibrationStatusCell(row)}</td>
      <td>${selectInput("app_use", locationUseValue(row), locationUseOptions())}</td>
      <td class="save-cell" data-admin-only>
        <div class="row-action-stack">
          <button type="button" data-save-location ${state.authSession ? "" : "disabled"}>${isNew ? "Create" : "Save"}</button>
          ${editCalibrationLink(row)}
        </div>
      </td>
    </tr>
  `;
}

function renderDatasets() {
  const rows = state.hasDatasetDraft ? [defaultDataset(), ...state.datasets] : state.datasets;
  if (!els.datasetCount || !els.datasetsTableBody) return;
  els.datasetCount.textContent = `${rows.length} row${rows.length === 1 ? "" : "s"}`;

  if (!rows.length) {
    els.datasetsTableBody.innerHTML = emptyRow(10, "No visible tide datasets returned from Supabase.");
    return;
  }

  let displayIndex = 0;
  els.datasetsTableBody.innerHTML = rows.map((row) => renderDatasetRow(row, row.id ? displayIndex++ : -1)).join("");
}

function renderCalibrationPanel() {
  if (!hasCalibrationPanel()) return;
  renderCalibrationSelects();
  renderCalibrationTable();

  if (!els.calibrationLocation?.value && state.locations.length) {
    openInitialCalibrationLocation();
  }
}

function hasCalibrationPanel() {
  return !!(els.calibrationForm || els.calibrationTableBody);
}

function renderCalibrationSelects() {
  if (els.calibrationLocation) {
    const selectedLocation = els.calibrationLocation.value || state.requestedCalibrationLocationId;
    els.calibrationLocation.innerHTML = [
      `<option value="">Select location</option>`,
      ...state.locations.map((location) => {
        const selected = location.id === selectedLocation ? " selected" : "";
        return `<option value="${escapeAttribute(location.id)}"${selected}>${escapeHtml(locationLabel(location))}</option>`;
      })
    ].join("");
  }

  if (els.calibrationDataset) {
    const selectedDataset = els.calibrationDataset.value;
    els.calibrationDataset.innerHTML = [
      `<option value="">Use location default / not set</option>`,
      ...state.datasets.map((dataset) => {
        const label = dataset.dataset_name || dataset.dataset_key || dataset.id;
        const selected = dataset.id === selectedDataset ? " selected" : "";
        return `<option value="${escapeAttribute(dataset.id)}"${selected}>${escapeHtml(label)}</option>`;
      })
    ].join("");
  }
}

function renderCalibrationTable() {
  if (!els.calibrationRowCount || !els.calibrationTableBody) return;
  els.calibrationRowCount.textContent = `${state.calibrations.length} row${state.calibrations.length === 1 ? "" : "s"}`;
  els.calibrationTableBody.innerHTML = state.calibrations.length
    ? state.calibrations.map(renderCalibrationRow).join("")
    : emptyRow(10, "No site locations found.");
}

function renderCalibrationRow(row) {
  const status = calibrationStatusForValue(row.calibration_status);
  const evidence = [
    row.observation_record_number ? `record: ${row.observation_record_number}` : "",
    row.confidence ? `confidence: ${row.confidence}` : "",
    row.last_edited_by ? `edited: ${row.last_edited_by}` : ""
  ].filter(Boolean).join("; ");
  const selectedClass = row.location_id === els.calibrationLocation?.value ? "editing-row" : "";

  return `
    <tr class="${selectedClass}">
      <td>${escapeHtml(row.location_code || shortId(row.location_id))}</td>
      <td><strong>${escapeHtml(row.location_name || "")}</strong></td>
      <td><span class="status-pill calibration-status-pill" data-status="${escapeAttribute(status.value)}">${escapeHtml(status.label)}</span></td>
      <td>${escapeHtml(row.reference_dataset_name || "Location default")}</td>
      <td>${formatMinutes(row.low_tide_time_offset_minutes)}</td>
      <td>${formatMinutes(row.high_tide_time_offset_minutes)}</td>
      <td>${formatNumber(row.height_ratio)}</td>
      <td>${formatMetres(row.height_offset_m)}</td>
      <td>${escapeHtml(evidence || "-")}</td>
      <td><button type="button" data-edit-calibration="${escapeAttribute(row.location_id)}" ${state.authSession ? "" : "disabled"}>Edit</button></td>
    </tr>
  `;
}

function openInitialCalibrationLocation() {
  const locationId = state.requestedCalibrationLocationId || els.calibrationLocation?.value || state.locations[0]?.id || "";
  if (!locationId) return;
  loadCalibrationIntoForm(locationId);
}

function loadCalibrationIntoForm(locationId) {
  if (!els.calibrationForm || !els.calibrationLocation) return;
  els.calibrationLocation.value = locationId || "";
  const location = state.locations.find((item) => item.id === locationId);
  const calibration = activeCalibrationForLocation(locationId);
  state.selectedCalibrationId = calibration?.id || null;
  state.requestedCalibrationLocationId = locationId || "";

  els.calibrationDataset.value = calibration?.reference_dataset_id || location?.default_tide_dataset_id || datasetIdForKey(location?.default_tide_dataset_key) || "";
  els.calibrationStatus.value = calibration?.status || "none";
  els.calibrationConfidence.value = calibration?.confidence || "low";
  els.lowTideOffset.value = valueOrEmpty(calibration?.low_tide_time_offset_minutes);
  els.highTideOffset.value = valueOrEmpty(calibration?.high_tide_time_offset_minutes);
  els.curveOffset.value = valueOrEmpty(calibration?.curve_time_offset_minutes);
  els.heightRatio.value = valueOrEmpty(calibration?.height_ratio);
  els.heightOffset.value = valueOrEmpty(calibration?.height_offset_m);
  els.harvestThreshold.value = valueOrEmpty(calibration?.harvest_threshold_m ?? location?.default_harvest_threshold_m);
  els.observationRecordNumber.value = valueOrEmpty(calibration?.observation_record_number);
  els.lastEditedBy.value = valueOrEmpty(calibration?.last_edited_by || currentUserEmail());
  els.calibrationNotes.value = valueOrEmpty(calibration?.notes);
  renderCalibrationTable();
}

async function saveCalibration() {
  try {
    requireSignedIn();
    const locationId = requiredText(els.calibrationLocation.value, "Location");
    const status = els.calibrationStatus.value || "none";
    const payload = {
      location_id: locationId,
      reference_dataset_id: nullableText(els.calibrationDataset.value),
      status,
      active: status !== "none",
      low_tide_time_offset_minutes: nullableInteger(els.lowTideOffset.value),
      high_tide_time_offset_minutes: nullableInteger(els.highTideOffset.value),
      curve_time_offset_minutes: nullableInteger(els.curveOffset.value),
      height_ratio: nullableNumber(els.heightRatio.value),
      height_offset_m: nullableNumber(els.heightOffset.value),
      harvest_threshold_m: nullableNumber(els.harvestThreshold.value),
      observation_record_number: nullableText(els.observationRecordNumber.value),
      notes: nullableText(els.calibrationNotes.value),
      confidence: els.calibrationConfidence.value || "low",
      last_edited_by: currentUserEmail(),
      last_edited_at: new Date().toISOString()
    };

    if (status === "none" && !state.selectedCalibrationId) {
      setStatus(els.calibrationSaveStatus, "No calibration record saved because status is None.");
      return;
    }

    setStatus(els.calibrationSaveStatus, "Saving calibration...");
    if (state.selectedCalibrationId) {
      await supabasePatch(TABLES.calibrationRecords, state.selectedCalibrationId, payload);
    } else {
      await supabaseInsert(TABLES.calibrationRecords, payload);
    }

    await loadCalibrations({ quiet: true });
    loadCalibrationIntoForm(locationId);
    renderLocations();
    setStatus(els.calibrationSaveStatus, "Calibration saved.");
  } catch (error) {
    setStatus(els.calibrationSaveStatus, writeErrorMessage(error), "error");
  }
}

function renderDatasetRow(row, index) {
  const isNew = !row.id;
  const rowId = isNew ? NEW_DATASET_ID : row.id;
  const isEditing = rowId === state.editingDatasetId;
  const rowClass = [isNew ? "draft-row" : "", isEditing ? "editing-row" : ""].filter(Boolean).join(" ");
  const region = datasetRegionValue(row);

  if (!isEditing) {
    return `
      <tr data-row-id="${escapeAttribute(rowId)}" data-row-kind="dataset" class="${rowClass}">
        <td class="id-cell">${datasetIdCell(row, index)}</td>
        <td>${readOnlyCell(row.dataset_name)}</td>
        <td>${readOnlyCell(row.tide_location_name)}</td>
        <td>${readOnlyCell(region)}</td>
        <td>${readOnlyCell(formatCoordinatePair(row.tide_location_latitude, row.tide_location_longitude))}</td>
        <td>${readOnlyCell(formatDateRange(row.valid_from, row.valid_to))}</td>
        <td>${readOnlyCell(row.source_organization || row.source_title)}</td>
        <td>${readOnlyCell(formatStatus(row.verification_status))}</td>
        <td>${readOnlyCell(recordUseLabel(row))}</td>
        <td class="save-cell" data-admin-only>
          <button type="button" data-edit-dataset ${state.authSession ? "" : "disabled"}>Edit</button>
        </td>
      </tr>
    `;
  }

  return `
    <tr data-row-id="${escapeAttribute(rowId)}" data-row-kind="dataset" class="${rowClass}">
      <td class="id-cell">${datasetIdCell(row, index)}</td>
      <td>${textInput("dataset_name", row.dataset_name, "dataset name")}</td>
      <td>${textInput("tide_location_name", row.tide_location_name, "tide location name")}</td>
      <td>${selectInput("tide_location_region", region, tideRegionOptions(region))}</td>
      <td><div class="inline-editor-pair">
        ${numberInput("tide_location_latitude", row.tide_location_latitude, "latitude", "-90", "90", "0.000001")}
        ${numberInput("tide_location_longitude", row.tide_location_longitude, "longitude", "-180", "180", "0.000001")}
      </div></td>
      <td><div class="inline-editor-pair">
        ${dateInput("valid_from", row.valid_from)}
        ${dateInput("valid_to", row.valid_to)}
      </div></td>
      <td>${textInput("source_organization", row.source_organization, "source name")}</td>
      <td>${selectInput("verification_status", row.verification_status || "imported_unverified", DATASET_STATUSES.map((value) => [value, formatStatus(value)]))}</td>
      <td>${selectInput("dataset_use", recordUseValue(row), recordUseOptions())}</td>
      <td class="save-cell" data-admin-only>
        <button type="button" data-save-dataset ${state.authSession ? "" : "disabled"}>${isNew ? "Create" : "Save"}</button>
      </td>
    </tr>
  `;
}

async function saveLocationRow(rowElement) {
  try {
    requireSignedIn();
    const id = rowElement.dataset.rowId === NEW_LOCATION_ID ? null : rowElement.dataset.rowId;
    const current = id ? state.locations.find((row) => row.id === id) || {} : {};
    const appUse = rowValue(rowElement, "app_use");
    const farmName = requiredText(rowValue(rowElement, "farm_name"), "Location name");
    const shortName = nullableText(rowValue(rowElement, "short_name"));
    const selectedDatasetId = nullableText(rowValue(rowElement, "default_tide_dataset_id"));
    const selectedDataset = datasetById(selectedDatasetId);
    const payload = {
      farm_location_key: normalizeKey(shortName || farmName),
      farm_name: farmName,
      short_name: shortName,
      region: requiredText(rowValue(rowElement, "region") || current.region || "Kwale County", "Region"),
      latitude: nullableNumber(rowValue(rowElement, "latitude")),
      longitude: nullableNumber(rowValue(rowElement, "longitude")),
      default_tide_dataset_key: selectedDataset?.dataset_key || null,
      status: locationStatusForUse(appUse, current.status),
      public_visible: appUse === "public",
      active: appUse !== "inactive",
      country: current.country || "Kenya"
    };

    if (supportsLocationDatasetIdField()) {
      payload.default_tide_dataset_id = selectedDatasetId;
    }

    setStatus(els.locationSaveStatus, "Saving location...");
    const savedRows = id
      ? await supabasePatch(TABLES.locations, id, payload)
      : await supabaseInsert(TABLES.locations, payload);
    state.hasLocationDraft = false;
    await loadLocations({ quiet: true });
    setStatus(els.locationSaveStatus, `${savedRows[0]?.farm_name || payload.farm_name} saved.`);
  } catch (error) {
    setStatus(els.locationSaveStatus, writeErrorMessage(error), "error");
  }
}

async function saveDatasetRow(rowElement) {
  try {
    requireSignedIn();
    const id = rowElement.dataset.rowId === NEW_DATASET_ID ? null : rowElement.dataset.rowId;
    const current = id ? state.datasets.find((row) => row.id === id) || {} : {};
    const datasetName = requiredText(rowValue(rowElement, "dataset_name"), "Dataset name");
    const tideLocationName = requiredText(rowValue(rowElement, "tide_location_name"), "Tide location name");
    const tideLocationRegion = requiredText(rowValue(rowElement, "tide_location_region") || datasetRegionValue(current), "Location region");
    const datasetUse = rowValue(rowElement, "dataset_use");
    const payload = {
      dataset_key: current.dataset_key || normalizeDatasetKey(datasetName),
      dataset_name: datasetName,
      source_organization: nullableText(rowValue(rowElement, "source_organization")),
      source_file_name: current.source_file_name || null,
      source_url: current.source_url || null,
      tide_location_key: current.tide_location_key || normalizeDatasetKey(tideLocationName),
      tide_location_name: tideLocationName,
      tide_location_country: countryForRegion(tideLocationRegion),
      tide_location_latitude: nullableNumber(rowValue(rowElement, "tide_location_latitude")),
      tide_location_longitude: nullableNumber(rowValue(rowElement, "tide_location_longitude")),
      timezone: current.timezone || "Africa/Nairobi",
      datum_label: current.datum_label || "Metres above lowest astronomical tide",
      prediction_year: current.prediction_year || yearFromDate(rowValue(rowElement, "valid_from")),
      valid_from: requiredText(rowValue(rowElement, "valid_from"), "Valid from"),
      valid_to: requiredText(rowValue(rowElement, "valid_to"), "Valid to"),
      verification_status: rowValue(rowElement, "verification_status") || "imported_unverified",
      has_hourly_predictions: current.has_hourly_predictions === true,
      has_tide_events: current.has_tide_events === true,
      public_visible: datasetUse === "public",
      active: datasetUse !== "inactive"
    };

    if (supportsDatasetRegionField()) {
      payload.tide_location_region = tideLocationRegion;
    }

    setStatus(els.datasetSaveStatus, "Saving dataset...");
    const savedRows = id
      ? await supabasePatch(TABLES.datasets, id, payload)
      : await supabaseInsert(TABLES.datasets, payload);
    state.hasDatasetDraft = false;
    await loadDatasets({ quiet: true });
    await loadLocations({ quiet: true });
    setStatus(els.datasetSaveStatus, `${savedRows[0]?.dataset_name || payload.dataset_name} saved.`);
  } catch (error) {
    setStatus(els.datasetSaveStatus, writeErrorMessage(error), "error");
  }
}

async function saveAdminUserRow(rowElement) {
  try {
    requireSignedIn();
    const userId = requiredText(rowElement.dataset.userId, "User ID");
    const payload = {
      role: rowValue(rowElement, "role") || "operator",
      active: rowValue(rowElement, "active") === "active",
      notes: nullableText(rowValue(rowElement, "notes"))
    };

    setStatus(els.adminUsersStatus, "Saving admin user...");
    await supabasePatchBy(TABLES.adminUsers, "user_id", userId, payload);
    await loadAdminUsers({ quiet: true });
    setStatus(els.adminUsersStatus, "Admin user saved.");
  } catch (error) {
    setStatus(els.adminUsersStatus, writeErrorMessage(error), "error");
  }
}

async function supabaseSelect(table, query) {
  return supabaseRequest(`${table}?${query}`);
}

async function supabaseInsert(table, payload) {
  return supabaseRequest(table, {
    method: "POST",
    body: payload,
    prefer: "return=representation",
    requireAuth: true
  });
}

async function supabasePatch(table, id, payload) {
  return supabaseRequest(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
    prefer: "return=representation",
    requireAuth: true
  });
}

async function supabasePatchBy(table, field, value, payload) {
  return supabaseRequest(`${table}?${encodeURIComponent(field)}=eq.${encodeURIComponent(value)}`, {
    method: "PATCH",
    body: payload,
    prefer: "return=representation",
    requireAuth: true
  });
}

async function supabaseRequest(path, options = {}) {
  if (options.requireAuth) requireSignedIn();

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 18000);
  const token = state.authSession?.access_token || APP_CONFIG.supabase.anonKey;
  const headers = {
    apikey: APP_CONFIG.supabase.anonKey,
    Authorization: `Bearer ${token}`
  };

  if (options.body) headers["Content-Type"] = "application/json";
  if (options.prefer) headers.Prefer = options.prefer;

  try {
    const response = await fetch(`${APP_CONFIG.supabase.restUrl}/${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}${await responseDetail(response)}`);
    }

    if (response.status === 204) return [];
    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Supabase request timed out. Reload the page or check the connection.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function signIn() {
  const email = requiredText(els.adminEmail.value, "Email");
  const password = requiredText(els.adminPassword.value, "Password");

  try {
    setAuthStatus("Signing in...");
    const response = await fetch(`${APP_CONFIG.supabase.url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: APP_CONFIG.supabase.anonKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(await authErrorMessage(response));
    }

    const session = await response.json();
    state.authSession = normalizeSession(session);
    writeStoredAuthSession(state.authSession);
    els.adminPassword.value = "";
    updateAuthUi();
    await loadAll();
  } catch (error) {
    clearStoredAuthSession();
    state.authSession = null;
    updateAuthUi();
    setAuthStatus(error.message, "error");
  }
}

async function signOut() {
  const token = state.authSession?.access_token;
  clearStoredAuthSession();
  state.authSession = null;
  updateAuthUi();

  if (token) {
    try {
      await fetch(`${APP_CONFIG.supabase.url}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: APP_CONFIG.supabase.anonKey,
          Authorization: `Bearer ${token}`
        }
      });
    } catch {
      // Local sign-out still succeeds if the network request fails.
    }
  }

  await loadAll();
}

async function verifyStoredSession() {
  if (!state.authSession?.access_token) return;

  try {
    const response = await fetch(`${APP_CONFIG.supabase.url}/auth/v1/user`, {
      headers: {
        apikey: APP_CONFIG.supabase.anonKey,
        Authorization: `Bearer ${state.authSession.access_token}`
      }
    });

    if (!response.ok) throw new Error("Stored admin session has expired.");

    const user = await response.json();
    state.authSession.user = user;
    writeStoredAuthSession(state.authSession);
    updateAuthUi();
  } catch {
    clearStoredAuthSession();
    state.authSession = null;
    updateAuthUi();
  }
}

function normalizeSession(session) {
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at || (session.expires_in ? Math.floor(Date.now() / 1000) + session.expires_in : null),
    user: session.user || null
  };
}

function loadStoredAuthSession() {
  try {
    const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    state.authSession = raw ? JSON.parse(raw) : null;
  } catch {
    state.authSession = null;
  }
}

function writeStoredAuthSession(session) {
  try {
    window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // In-memory session still works if storage is blocked.
  }
}

function clearStoredAuthSession() {
  try {
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    // Ignore restricted storage.
  }
}

function updateAuthUi() {
  const signedIn = !!state.authSession?.access_token;
  const email = state.authSession?.user?.email || "signed-in admin";

  document.body.classList.toggle("admin-signed-in", signedIn);
  document.body.classList.toggle("admin-login-required", !signedIn);
  if (els.adminLoginModal) {
    els.adminLoginModal.hidden = signedIn;
  }
  els.adminSignIn.disabled = signedIn;
  els.adminSignOut.disabled = !signedIn;
  if (els.newLocation) els.newLocation.hidden = !signedIn;
  if (els.newDataset) els.newDataset.hidden = !signedIn;

  if (!signedIn) {
    state.hasLocationDraft = false;
    state.hasDatasetDraft = false;
    state.editingLocationId = null;
    state.editingDatasetId = null;
    state.selectedCalibrationId = null;
  }

  document.querySelectorAll("[data-edit-location], [data-save-location], [data-edit-dataset], [data-save-dataset], [data-save-admin-user], [data-edit-calibration]").forEach((button) => {
    button.disabled = !signedIn;
  });

  if (signedIn) {
    setAuthStatus(`Signed in as ${email}. Hidden/internal rows are available if your policy allows them.`);
    renderLocations();
    renderCalibrationPanel();
    renderAdminUsers();
    return;
  }

  setAuthStatus("Sign in with an approved Supabase Auth user to save changes.");
  renderLocations();
  renderCalibrationPanel();
  renderAdminUsers();
}

function setSignedOutHints() {
  if (state.authSession) return;

  setStatus(
    els.datasetSaveStatus,
    "Showing public datasets. Sign in to see hidden/internal reference datasets such as KPA where permission is pending."
  );
}

function requireSignedIn() {
  if (!state.authSession?.access_token) {
    throw new Error("Sign in as an approved admin user before saving.");
  }
}

function defaultLocation() {
  return {
    farm_location_key: "",
    farm_name: "",
    short_name: "",
    region: "Kwale County",
    country: "Kenya",
    default_harvest_threshold_m: 0.7,
    status: "prototype_placeholder",
    active: true,
    public_visible: true
  };
}

function defaultDataset() {
  const year = new Date().getFullYear();
  return {
    dataset_key: "",
    dataset_name: "",
    tide_location_key: "",
    tide_location_name: "",
    tide_location_region: "",
    tide_location_country: "Kenya",
    timezone: "Africa/Nairobi",
    prediction_year: year,
    valid_from: `${year}-01-01`,
    valid_to: `${year}-12-31`,
    verification_status: "imported_unverified",
    has_hourly_predictions: false,
    has_tide_events: false,
    active: true,
    public_visible: false
  };
}

function emptyRow(colspan, message) {
  return `<tr><td colspan="${colspan}" class="empty-state">${escapeHtml(message)}</td></tr>`;
}

function readOnlyCell(value) {
  const text = valueOrEmpty(value).trim();
  return text ? `<span class="readonly-value">${escapeHtml(text)}</span>` : `<span class="readonly-muted">-</span>`;
}

function calibrationStatusCell(location) {
  const status = calibrationStatusForLocation(location);
  return `<span class="status-pill calibration-status-pill" data-status="${escapeAttribute(status.value)}">${escapeHtml(status.label)}</span>`;
}

function calibrationStatusForLocation(location) {
  if (!location?.id) return { value: "none", label: "None" };

  const summary = state.calibrations.find((row) => row.location_id === location.id);
  return calibrationStatusForValue(summary?.calibration_status);
}

function calibrationStatusForValue(statusValue) {
  const status = String(statusValue || "none").toLowerCase();

  if (status === "complete") return { value: "complete", label: "Complete" };
  if (status === "under_review") return { value: "under_review", label: "Under Review" };
  if (status === "retired") return { value: "none", label: "None" };
  return { value: "none", label: "None" };
}

function editCalibrationLink(location) {
  if (!location?.id || !state.authSession) return "";
  if (hasCalibrationPanel()) {
    return `<button type="button" data-edit-calibration="${escapeAttribute(location.id)}">Edit calibration</button>`;
  }
  return `<a class="button-link row-action-link" href="./locations.html?location_id=${escapeAttribute(encodeURIComponent(location.id))}#calibration-inputs">Edit calibration</a>`;
}

function activeCalibrationForLocation(locationId) {
  return state.calibrationRecords.find((row) => row.location_id === locationId && row.active !== false && row.status !== "retired") || null;
}

function locationLabel(location) {
  const parts = [location.location_code, location.farm_name || location.short_name, location.region].filter(Boolean);
  return parts.join(" - ");
}

function readOnlyStack(values) {
  const lines = values
    .map((value) => valueOrEmpty(value).trim())
    .filter(Boolean);

  if (!lines.length) return readOnlyCell("");
  return `<div class="readonly-stack">${lines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</div>`;
}

function datasetLabel(datasetRef) {
  const dataset = state.datasets.find((item) => item.id === datasetRef || item.dataset_key === datasetRef);
  return dataset?.dataset_name || datasetRef || "";
}

function datasetById(datasetId) {
  return state.datasets.find((item) => item.id === datasetId) || null;
}

function datasetIdForKey(datasetKey) {
  return state.datasets.find((item) => item.dataset_key === datasetKey)?.id || "";
}

function supportsLocationDatasetIdField() {
  return state.locations.some((row) => Object.prototype.hasOwnProperty.call(row, "default_tide_dataset_id"));
}

function formatThreshold(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(2)} m` : "";
}

function formatCoordinate(value) {
  if (value === null || value === undefined || value === "") return "";
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(6) : "";
}

function formatCoordinatePair(latitude, longitude) {
  const lat = formatCoordinate(latitude);
  const lon = formatCoordinate(longitude);
  return lat && lon ? `${lat}, ${lon}` : "";
}

function formatDateRange(start, end) {
  if (start && end) return `${start} to ${end}`;
  return start || end || "";
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatMinutes(value) {
  if (value === null || value === undefined || value === "") return "-";
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return `${number > 0 ? "+" : ""}${number} min`;
}

function formatMetres(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(3)} m` : "-";
}

function formatNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : "-";
}

function currentUserEmail() {
  return state.authSession?.user?.email || "signed-in admin";
}

function loadLanguageSettings() {
  const settings = readLanguageSettings();
  document.querySelectorAll("[data-language-status]").forEach((select) => {
    select.value = settings[select.dataset.languageStatus] || "active";
  });
}

function saveLanguageSettings() {
  const settings = readLanguageSettings();
  document.querySelectorAll("[data-language-status]").forEach((select) => {
    settings[select.dataset.languageStatus] = select.value;
  });

  try {
    window.localStorage.setItem(LANGUAGE_SETTINGS_KEY, JSON.stringify(settings));
    setStatus(els.languageSettingsStatus, "Language status saved in this browser for the prototype.");
  } catch {
    setStatus(els.languageSettingsStatus, "Language status changed for this session only. Browser storage is blocked.", "error");
  }
}

function readLanguageSettings() {
  try {
    const raw = window.localStorage.getItem(LANGUAGE_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function datasetDataFlags(row) {
  const flags = [];
  if (row.has_hourly_predictions) flags.push("Hourly");
  if (row.has_tide_events) flags.push("Events");
  return flags;
}

function recordUseLabel(row, publicLabel = "Public") {
  const value = recordUseValue(row);
  if (value === "inactive") return "Inactive";
  if (value === "internal") return "Internal only";
  return publicLabel;
}

function locationIdCell(row, index) {
  const label = locationDisplayId(row, index);
  if (!row.id) return `<span class="muted-cell">${escapeHtml(label)}</span>`;
  return `<a href="${escapeAttribute(dashboardTableUrl(TABLES.locations))}" target="_blank" rel="noopener" title="Supabase UUID: ${escapeAttribute(row.id)}">${escapeHtml(label)}</a>`;
}

function locationDisplayId(row, index) {
  if (row.location_code) return row.location_code;
  if (!row.id) return "LID-New";
  return `LID-${String(index + 1).padStart(5, "0")}`;
}

function datasetIdCell(row, index) {
  const label = datasetDisplayId(row, index);
  if (!row.id) return `<span class="muted-cell">${escapeHtml(label)}</span>`;
  return `<a href="${escapeAttribute(dashboardTableUrl(TABLES.datasets))}" target="_blank" rel="noopener" title="Supabase UUID: ${escapeAttribute(row.id)}">${escapeHtml(label)}</a>`;
}

function datasetDisplayId(row, index) {
  if (row.dataset_code) return row.dataset_code;
  if (!row.id) return "DID-New";
  return `DID-${String(index + 1).padStart(5, "0")}`;
}

function datasetRegionValue(row) {
  return row.tide_location_region || row.tide_location_country || "";
}

function supportsDatasetRegionField() {
  return state.datasets.some((row) => Object.prototype.hasOwnProperty.call(row, "tide_location_region"));
}

function tideRegionOptions(selectedValue) {
  const baseOptions = [
    ["", "Select region"],
    ["Kwale County", "Kwale County, Kenya"],
    ["Mombasa County", "Mombasa County, Kenya"],
    ["Lamu County", "Lamu County, Kenya"],
    ["Dar es Salaam Region", "Dar es Salaam Region, Tanzania"],
    ["Regional / mixed", "Regional / mixed"]
  ];

  if (selectedValue && !baseOptions.some(([value]) => value === selectedValue)) {
    return [[selectedValue, selectedValue], ...baseOptions];
  }

  return baseOptions;
}

function countryForRegion(region) {
  const text = String(region || "").toLowerCase();
  if (text.includes("dar es salaam") || text.includes("tanzania")) return "Tanzania";
  if (text.includes("regional")) return "Regional";
  return "Kenya";
}

function locationUseValue(row) {
  return recordUseValue(row);
}

function locationUseOptions() {
  return recordUseOptions("Shown in app");
}

function recordUseValue(row) {
  if (row.active === false) return "inactive";
  if (row.public_visible === false) return "internal";
  return "public";
}

function recordUseOptions(publicLabel = "Public") {
  return [
    ["public", publicLabel],
    ["internal", "Internal only"],
    ["inactive", "Inactive"]
  ];
}

function adminRoleOptions(selectedRole) {
  const baseOptions = [
    ["admin", "Admin"],
    ["operator", "Operator"]
  ];

  if (selectedRole && !baseOptions.some(([value]) => value === selectedRole)) {
    return [[selectedRole, formatStatus(selectedRole)], ...baseOptions];
  }

  return baseOptions;
}

function locationStatusForUse(appUse) {
  if (appUse === "inactive") return "inactive";
  if (appUse === "internal") return "reference_only";
  return "active";
}

function idLink(id, tableName) {
  if (!id) return `<span class="muted-cell">New row</span>`;
  return `<a href="${escapeAttribute(dashboardTableUrl(tableName))}" target="_blank" rel="noopener" title="${escapeAttribute(id)}">${escapeHtml(shortId(id))}</a>`;
}

function dashboardTableUrl(tableName) {
  return `https://supabase.com/dashboard/project/${APP_CONFIG.supabase.projectRef}/editor?schema=public&table=${encodeURIComponent(tableName)}`;
}

function textInput(field, value, label) {
  return `<input data-field="${escapeAttribute(field)}" type="text" value="${escapeAttribute(valueOrEmpty(value))}" aria-label="${escapeAttribute(label)}">`;
}

function numberInput(field, value, label, min, max, step) {
  return `<input data-field="${escapeAttribute(field)}" type="number" value="${escapeAttribute(valueOrEmpty(value))}" min="${min}" max="${max}" step="${step}" aria-label="${escapeAttribute(label)}">`;
}

function dateInput(field, value) {
  return `<input data-field="${escapeAttribute(field)}" type="date" value="${escapeAttribute(valueOrEmpty(value))}" aria-label="${escapeAttribute(formatStatus(field))}">`;
}

function selectInput(field, selectedValue, options) {
  const optionHtml = options.map(([value, label]) => {
    const selected = String(value || "") === String(selectedValue || "") ? " selected" : "";
    return `<option value="${escapeAttribute(value)}"${selected}>${escapeHtml(label)}</option>`;
  }).join("");
  return `<select data-field="${escapeAttribute(field)}" aria-label="${escapeAttribute(formatStatus(field))}">${optionHtml}</select>`;
}

function checkboxInput(field, checked, label) {
  return `
    <label>
      <input data-field="${escapeAttribute(field)}" type="checkbox"${checked ? " checked" : ""}>
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

function rowValue(rowElement, field) {
  const input = rowElement.querySelector(`[data-field="${field}"]`);
  if (!input) return "";
  if (input.type === "checkbox") return input.checked;
  return input.value;
}

function setConnectionStatus(text, extraClass) {
  if (!els.adminConnectionStatus) return;
  els.adminConnectionStatus.textContent = text;
  els.adminConnectionStatus.className = `status-pill ${extraClass || ""}`.trim();
}

function setAuthStatus(message, type = "") {
  if (!els.adminAuthStatus) return;
  els.adminAuthStatus.textContent = message;
  els.adminAuthStatus.dataset.status = type;
}

function setStatus(element, message, type = "") {
  if (!element) return;
  element.textContent = message || "";
  element.dataset.status = type;
}

async function responseDetail(response) {
  try {
    const errorBody = await response.json();
    const detail = errorBody.message || errorBody.details || errorBody.hint || "";
    return detail ? ` - ${detail}` : "";
  } catch {
    const detail = await response.text();
    return detail ? ` - ${detail}` : "";
  }
}

async function authErrorMessage(response) {
  try {
    const body = await response.json();
    return body.msg || body.message || body.error_description || `${response.status} ${response.statusText}`;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
}

function writeErrorMessage(error) {
  const message = error?.message || String(error);
  if (/401|403|permission|policy|row-level|JWT/i.test(message)) {
    return `${message}. Writes need an authenticated admin policy. The service-role key must not be placed in this page.`;
  }
  return message;
}

function requiredText(value, label) {
  const text = String(value || "").trim();
  if (!text) throw new Error(`${label} is required.`);
  return text;
}

function nullableText(value) {
  const text = String(value || "").trim();
  return text || null;
}

function nullableNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return number;
}

function nullableInteger(value) {
  const number = nullableNumber(value);
  return number === null ? null : Math.round(number);
}

function normalizeKey(value) {
  return requiredText(value, "Location key")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeDatasetKey(value) {
  return requiredText(value, "Dataset key")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function yearFromDate(value) {
  const match = String(value || "").match(/^(\d{4})-/);
  return match ? Number(match[1]) : new Date().getFullYear();
}

function valueOrEmpty(value) {
  return value === null || value === undefined ? "" : String(value);
}

function shortId(id) {
  if (!id) return "New";
  return `${id.slice(0, 8)}...`;
}

function formatStatus(value) {
  return String(value || "unknown").replace(/_/g, " ");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
