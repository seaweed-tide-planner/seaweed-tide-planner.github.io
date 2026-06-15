const STORAGE_KEY = "seaweed_tide_planner:language";
const DEFAULT_LANGUAGE = "en";
const KENYA_TIMEZONE = "Africa/Nairobi";

const LANGUAGE_PACKS = {
  en: {
    locale: "en-GB",
    messages: {
      "title.tides": "Seaweed Tide Planner",
      "title.map": "Map - Seaweed Tide Planner",
      "app.eyebrow": "Seaweed farming tide guidance",
      "page.tidesTitle": "Seaweed Tide Planner",
      "page.mapTitle": "Farm & Tide Source Map",
      "nav.tides": "Tides",
      "nav.map": "Map",
      "nav.admin": "Admin",
      "nav.importer": "Importer",
      "nav.mainLabel": "Main navigation",
      "language.label": "Language:",
      "language.ariaLabel": "Language",
      "language.option.en": "English",
      "language.option.sw": "Kiswahili",
      "weatherWarning.ariaLabel": "Weather warning source",
      "weatherWarning.label": "Weather check:",
      "weatherWarning.text": "Heavy rain, strong wind, large waves, or unusual pressure can make tide guidance less reliable and unsafe for field work.",
      "weatherWarning.loadingLabel": "Weather alerts:",
      "weatherWarning.loadingText": "Checking Kenya Meteorological Department alerts...",
      "weatherWarning.clearLabel": "Weather alerts:",
      "weatherWarning.clearText": "No active KMD coastal alerts found. Still check local weather and sea conditions before field work.",
      "weatherWarning.activeLabel": "Active KMD alert:",
      "weatherWarning.activeCoastalLabel": "Active coastal weather alert:",
      "weatherWarning.errorLabel": "Weather alerts unavailable:",
      "weatherWarning.errorText": "Could not refresh KMD alert status. Check the official warnings page before field work.",
      "weatherWarning.lastChecked": "Last checked {time}",
      "weatherWarning.sourceLink": "Check Kenya Meteorological Department warnings",

      "status.loading": "Loading",
      "status.dataset": "Dataset",
      "status.online": "Online",
      "status.offline": "Offline",
      "status.checkingConnection": "Checking connection",
      "status.planning_guidance_unverified": "Planning guidance",
      "status.reference_only": "Reference only",
      "status.prototype_reference": "Prototype reference",
      "status.prototype_placeholder": "Prototype placeholder",
      "status.verified": "Verified",
      "status.pending_verification": "Pending verification",

      "page.locationLabel": "Location",
      "page.locationControlsLabel": "Location and tide controls",
      "page.selectedLocationLabel": "Selected location",
      "page.includeTideReferences": "Include tide data locations",
      "page.farmLocations": "Farm locations",
      "page.tideDataLocations": "Tide data locations",
      "page.localTidesLabel": "Local tides",
      "clock.loading": "Loading",
      "clock.selectedTimezone": "Times shown in selected timezone",
      "clock.timezone": "Times shown in {timezone}",
      "lastUpdated.pending": "Updated --",
      "lastUpdated.time": "Updated {time}",

      "offline.controlsLabel": "Offline farm location controls",
      "offline.statusLoading": "Offline status loading",
      "offline.storageUnavailable": "Offline storage unavailable",
      "offline.selectLocation": "Select a location first",
      "offline.notAvailable": "Not saved for offline use",
      "offline.notAvailableOffline": "Offline data is not saved on this device",
      "offline.make": "Make offline",
      "offline.update": "Update offline",
      "offline.remove": "Remove",
      "offline.statusUnavailable": "Offline status unavailable",
      "offline.downloading": "Downloading linked tide dataset",
      "offline.saveFailed": "Offline save failed",
      "offline.removing": "Removing offline copy",
      "offline.removeFailed": "Offline remove failed",
      "offline.saved": "saved",
      "offline.available": "Offline ready",
      "offline.availablePartial": "Offline saved with limited data",
      "offline.eventCount": "{count} events",
      "offline.hourlyCount": "{count} hourly",
      "offline.partialNote": "Offline bundle saved with metadata only or partial data. Check dataset availability before field use.",
      "offline.completeNote": "Offline bundle includes the selected farm location, linked tide dataset metadata, tide events, and hourly predictions for the shown date range.",

      "summary.tideSummaryLabel": "Tide summary",
      "summary.todayTides": "Todays Tides",
      "summary.current": "Current:",
      "summary.lowTide": "Low Tide:",
      "summary.highTide": "High Tide:",
      "summary.nextHarvest": "Next Harvest",
      "summary.nextHarvestWindow": "Next Harvest window:",
      "summary.lowestTide": "Lowest Tide:",
      "summary.moonSun": "Moon and Sun",
      "summary.moon": "Moon:",
      "summary.newMoon": "New moon:",
      "summary.fullMoon": "Full moon:",
      "summary.sunrise": "Sunrise:",
      "summary.sunset": "Sunset:",
      "summary.harvestThresholdHidden": "Harvest threshold hidden",
      "summary.noHarvestWindow": "No harvest window in range",
      "summary.currentTideState": "{symbol} {trend} ({height}) at {time} local time",
      "summary.lowTideDate": "Low Tide {date}:",

      "threshold.showHarvest": "Show harvest",
      "threshold.whenBelow": "when tide is below",
      "threshold.unitMetres": "m",
      "threshold.reset": "Reset",
      "harvest.window": "Harvest window",
      "harvest.windows": "Harvest windows:",
      "harvest.thresholdHiddenSentence": "Harvest threshold hidden.",
      "harvest.noWindowsInRange": "No harvest windows in this {months}-month range.",
      "harvest.status": "Harvest",
      "harvest.day": "Harvest day ({label})",
      "harvest.start": "Harvest start ({label})",
      "harvest.end": "Harvest end ({label})",
      "harvest.windowLabel": "Harvest window ({label})",
      "harvest.springLow": "Spring low - {harvestText}",

      "forecast.rangeLabel": "{days}-Day Tide Forecast",
      "forecast.rangeAria": "Forecast range",
      "forecast.buttonDays": "{count} day",
      "overview.rangeLabel": "{months}-Month Tide Overview{suffix}",
      "overview.rangeAria": "Overview range",
      "overview.suffixHarvest": " & Harvest Windows",
      "overview.buttonMonth": "{count} month",
      "overview.buttonMonths": "{count} months",
      "chart.forecastAria": "7-day tide forecast chart",
      "chart.overviewAria": "3-month tide overview chart",
      "chart.tideHeight": "Tide Height",
      "chart.highTide": "High Tide",
      "chart.lowTide": "Low Tide",
      "chart.now": "Now",
      "chart.thresholdHarvest": "<= {value}m harvest",
      "chart.tooltipHigh": "High tide",
      "chart.tooltipLow": "Low tide",
      "chart.tooltipHeight": "Tide height",

      "table.title": "Tide Table",
      "table.next14": "next 14 days",
      "table.nextDays": "next {days} days",
      "table.date": "Date",
      "table.harvest": "Harvest",
      "table.morning": "Morning",
      "table.afternoon": "Afternoon",
      "table.loadMoreInitial": "Load next 14 days ↓",
      "table.loadMore": "Load next {days} days ↓",
      "table.empty": "No tide events found in this range.",
      "calendar.title": "Harvest Calendar (3 months)",
      "calendar.weekday.mon": "Mo",
      "calendar.weekday.tue": "Tu",
      "calendar.weekday.wed": "We",
      "calendar.weekday.thu": "Th",
      "calendar.weekday.fri": "Fr",
      "calendar.weekday.sat": "Sa",
      "calendar.weekday.sun": "Su",
      "calendar.harvestLowTitle": "harvest low, min {height}",
      "calendar.moonTitle": "{moon} moon",

      "trend.slack": "Slack",
      "trend.flooding": "Flooding",
      "trend.ebbing": "Ebbing",
      "moonPhase.New Moon": "New Moon",
      "moonPhase.Waxing Crescent": "Waxing Crescent",
      "moonPhase.First Quarter": "First Quarter",
      "moonPhase.Waxing Gibbous": "Waxing Gibbous",
      "moonPhase.Full Moon": "Full Moon",
      "moonPhase.Waning Gibbous": "Waning Gibbous",
      "moonPhase.Last Quarter": "Last Quarter",
      "moonPhase.Waning Crescent": "Waning Crescent",
      "moon.full": "Full",
      "moon.new": "New",
      "moon.illuminated": "{percent} illuminated",

      "details.locationHeading": "Location and tide profile",
      "details.sourceHeading": "Source and verification",
      "details.safetyHeading": "Safety note",
      "details.location": "Location:",
      "details.gps": "GPS:",
      "details.tideProfile": "Tide profile:",
      "details.referenceStation": "Reference station: {station}",
      "details.referenceStationFallback": "Reference station",
      "details.toBeConfirmed": "To be confirmed",
      "details.activeTideData": "Active tide data:",
      "details.dataset": "Dataset:",
      "details.source": "Source:",
      "details.datum": "Datum:",
      "details.timezone": "Timezone:",
      "details.verification": "Verification:",
      "details.locationNote": "Location note:",
      "details.tideReferenceNote": "Source tide data location for {dataset}.",
      "data.active.supabase": "Imported Supabase tide dataset",
      "data.active.offline": "Saved offline tide dataset",
      "data.active.loading": "Loading linked tide dataset",
      "data.active.prototype": "Prototype harmonic fallback",
      "data.loadingTideData": "Loading tide data",
      "safety.prototypeWarning": "This prototype is planning guidance only. Local weather, currents, access conditions, datum differences, and unverified datasets can change field safety. Do not use this as navigation-grade tide data.",
      "safety.footerLabel": "Safety:",
      "safety.footerText": "Not for marine navigation or safety-of-life decisions. Tide guidance may be wrong, stale, unverified, or affected by local weather and sea conditions. Check official/local sources and current conditions before acting.",
      "safety.fullDisclaimer": "Full marine disclaimer",
      "safety.fullDisclaimerShort": "Full disclaimer",
      "noscript.tides": "JavaScript is required to calculate and display tide predictions.",

      "map.statusLoading": "Loading locations",
      "map.statusCounts": "{farms} farm{farmPlural}, {references} tide source{referencePlural}",
      "map.gpsNeeded": "GPS needed",
      "map.farmLocations": "Farm & Tide Source Locations",
      "map.intro": "",
      "map.regionLabel": "Region",
      "map.allRegions": "All regions",
      "map.regionNotSet": "Region not set",
      "map.noRegionMatches": "No mapped locations in this region",
      "map.selectedLocationNotMapped": "Selected location is not mapped yet",
      "map.legendLabel": "Map symbol legend",
      "map.legendFarm": "Farm",
      "map.legendReference": "Tide source",
      "map.offlineControlsLabel": "Offline map controls",
      "map.offlineStatusLoading": "Offline map status loading",
      "map.cacheVisibleTiles": "Save visible map tiles",
      "map.clearTileCache": "Clear map tiles",
      "map.offlineStorageUnavailable": "Offline map storage unavailable",
      "map.offlineTilesReady": "Offline map tiles ready - {count} cached",
      "map.offlineTilesNotSaved": "Map tiles not saved for offline use",
      "map.offlineTilesMissing": "No offline map tiles available for this view",
      "map.noVisibleTiles": "No visible map tiles to save",
      "map.tooManyVisibleTiles": "Current view has {count} tiles. Zoom in or reduce the view below {max} tiles before saving.",
      "map.cachingTiles": "Saving {count} visible map tiles",
      "map.offlineTilesSaved": "Saved {saved} map tiles. {total} tiles cached total.",
      "map.tileCacheFailed": "Map tile save failed",
      "map.sourceLoading": "Location source loading",
      "map.layoutLabel": "Farm and tide source location map and list",
      "map.mapLabel": "Farm and tide source location map",
      "map.mappedFarms": "Farm Locations",
      "map.tideReferences": "Tide Sources",
      "map.needsGps": "Needs GPS",
      "map.libraryMissing": "Map library could not be loaded. Check the internet connection for Leaflet and OpenStreetMap tiles.",
      "map.noGpsData": "No farm or tide-reference GPS coordinates are available yet.",
      "map.openPlanner": "Open tide planner",
      "map.open": "Open",
      "map.showSelectedOnMap": "Show on map",
      "map.offlineLocationNotSaved": "Offline - not saved",
      "map.statusNotSet": "status not set",
      "map.columnName": "Name",
      "map.columnRegion": "Region",
      "map.columnCoordinates": "Coordinates",
      "map.columnOpen": "Open",
      "map.noMappedFarms": "No farm locations have confirmed GPS coordinates yet.",
      "map.noReferences": "No tide sources have coordinates yet.",
      "map.allGps": "All farm locations have GPS coordinates.",
      "map.showOnMap": "Show {name} on the map",
      "map.gpsToConfirm": "GPS to be confirmed",
      "noscript.map": "JavaScript is required to display the farm map.",

      "disclaimer.eyebrow": "Safety notice",
      "disclaimer.title": "Marine navigation and field-safety disclaimer",
      "disclaimer.accept": "I understand - continue",
      "disclaimer.body": "<p><strong>This Tide Planner is not a marine navigation system, official tide table, safety-of-life service, or emergency decision tool.</strong> It is provided only as general seaweed-farming planning guidance.</p><p>Do not use this app as the sole basis for navigation, vessel operation, port entry or departure, anchoring, mooring, route planning, swimming, diving, fishing, crossing channels, crossing reef flats, transporting people or goods, emergency response, or deciding whether conditions are safe.</p><p>Tide times and heights can be affected by source-data errors, unverified datasets, datum differences, timezone conversion, interpolation, weather, wind setup, atmospheric pressure, river flow, swell, currents, coastal shape, reef and lagoon effects, local obstructions, equipment error, user settings, offline/cache age, and changes made after a dataset was imported.</p><p>Before acting, check current local conditions and official or locally approved sources such as harbour authorities, national hydrographic or meteorological services, notices to mariners, tide gauges, trained local observers, and site supervisors. When in doubt, do not go out.</p><p>Use of this Tide Planner is at your own risk. The operators, developers, data processors, project partners, and local administrators cannot guarantee that the displayed tide information is accurate, complete, current, suitable for your location, or safe for any specific activity. They are not responsible for loss, damage, injury, crop loss, production loss, equipment loss, financial loss, or other consequences arising from reliance on, or use of, the displayed tide information.</p><p>You remain responsible for your own decisions and for following local rules, warnings, and instructions.</p>"
    },
    dataText: {}
  },
  sw: {
    locale: "sw-KE",
    messages: {
      "title.tides": "Mpangaji wa Mawimbi ya Mwani",
      "title.map": "Ramani - Mpangaji wa Mawimbi ya Mwani",
      "app.eyebrow": "Mwongozo wa mawimbi kwa kilimo cha mwani",
      "page.tidesTitle": "Mpangaji wa Mawimbi ya Mwani",
      "page.mapTitle": "Ramani ya Mashamba na Vyanzo vya Mawimbi",
      "nav.tides": "Mawimbi",
      "nav.map": "Ramani",
      "nav.admin": "Usimamizi",
      "nav.importer": "Ingiza Data",
      "nav.mainLabel": "Urambazaji mkuu",
      "language.label": "Lugha:",
      "language.ariaLabel": "Lugha",
      "language.option.en": "English",
      "language.option.sw": "Kiswahili",
      "weatherWarning.ariaLabel": "Chanzo cha tahadhari za hali ya hewa",
      "weatherWarning.label": "Kagua hali ya hewa:",
      "weatherWarning.text": "Mvua kubwa, upepo mkali, mawimbi makubwa, au shinikizo la hewa lisilo la kawaida vinaweza kufanya mwongozo wa mawimbi usiwe wa kuaminika na usiwe salama kwa kazi ya shambani.",
      "weatherWarning.loadingLabel": "Tahadhari za hali ya hewa:",
      "weatherWarning.loadingText": "Inakagua tahadhari za Kenya Meteorological Department...",
      "weatherWarning.clearLabel": "Tahadhari za hali ya hewa:",
      "weatherWarning.clearText": "Hakuna tahadhari hai za pwani kutoka KMD. Bado kagua hali ya hewa na bahari kabla ya kazi ya shambani.",
      "weatherWarning.activeLabel": "Tahadhari hai ya KMD:",
      "weatherWarning.activeCoastalLabel": "Tahadhari hai ya hali ya hewa ya pwani:",
      "weatherWarning.errorLabel": "Tahadhari hazipatikani:",
      "weatherWarning.errorText": "Imeshindwa kusasisha tahadhari za KMD. Kagua ukurasa rasmi wa tahadhari kabla ya kazi ya shambani.",
      "weatherWarning.lastChecked": "Ilikaguliwa mwisho {time}",
      "weatherWarning.sourceLink": "Kagua tahadhari za Kenya Meteorological Department",

      "status.loading": "Inapakia",
      "status.dataset": "Seti ya data",
      "status.online": "Mtandaoni",
      "status.offline": "Nje ya mtandao",
      "status.checkingConnection": "Inakagua muunganisho",
      "status.planning_guidance_unverified": "Mwongozo wa kupanga",
      "status.reference_only": "Marejeo tu",
      "status.prototype_reference": "Marejeo ya mfano",
      "status.prototype_placeholder": "Mfano wa muda",
      "status.verified": "Imethibitishwa",
      "status.pending_verification": "Inasubiri uthibitisho",

      "page.locationLabel": "Mahali",
      "page.locationControlsLabel": "Vidhibiti vya mahali na mawimbi",
      "page.selectedLocationLabel": "Mahali palipochaguliwa",
      "page.includeTideReferences": "Jumuisha maeneo ya data ya mawimbi",
      "page.farmLocations": "Maeneo ya mashamba",
      "page.tideDataLocations": "Maeneo ya data ya mawimbi",
      "page.localTidesLabel": "Mawimbi ya eneo",
      "clock.loading": "Inapakia",
      "clock.selectedTimezone": "Nyakati zinaonyeshwa kwa ukanda wa saa uliochaguliwa",
      "clock.timezone": "Nyakati zinaonyeshwa kwa {timezone}",
      "lastUpdated.pending": "Imesasishwa --",
      "lastUpdated.time": "Imesasishwa {time}",

      "offline.controlsLabel": "Vidhibiti vya eneo la shamba nje ya mtandao",
      "offline.statusLoading": "Inapakia hali ya nje ya mtandao",
      "offline.storageUnavailable": "Hifadhi ya nje ya mtandao haipatikani",
      "offline.selectLocation": "Chagua mahali kwanza",
      "offline.notAvailable": "Haijahifadhiwa kwa matumizi nje ya mtandao",
      "offline.notAvailableOffline": "Data ya nje ya mtandao haijahifadhiwa kwenye kifaa hiki",
      "offline.make": "Hifadhi nje ya mtandao",
      "offline.update": "Sasisha hifadhi",
      "offline.remove": "Ondoa",
      "offline.statusUnavailable": "Hali ya nje ya mtandao haipatikani",
      "offline.downloading": "Inapakua seti ya data ya mawimbi iliyounganishwa",
      "offline.saveFailed": "Imeshindwa kuhifadhi nje ya mtandao",
      "offline.removing": "Inaondoa nakala ya nje ya mtandao",
      "offline.removeFailed": "Imeshindwa kuondoa nakala ya nje ya mtandao",
      "offline.saved": "imehifadhiwa",
      "offline.available": "Tayari nje ya mtandao",
      "offline.availablePartial": "Imehifadhiwa nje ya mtandao na data pungufu",
      "offline.eventCount": "matukio {count}",
      "offline.hourlyCount": "rekodi {count} za kila saa",
      "offline.partialNote": "Kifurushi cha nje ya mtandao kimehifadhiwa na taarifa za msingi tu au data pungufu. Kagua upatikanaji wa seti ya data kabla ya matumizi ya shambani.",
      "offline.completeNote": "Kifurushi cha nje ya mtandao kina eneo la shamba ulilochagua, taarifa za seti ya data ya mawimbi, matukio ya mawimbi, na utabiri wa kila saa kwa kipindi kinachoonyeshwa.",

      "summary.tideSummaryLabel": "Muhtasari wa mawimbi",
      "summary.todayTides": "Mawimbi ya Leo",
      "summary.current": "Hali ya sasa:",
      "summary.lowTide": "Maji Kupwa:",
      "summary.highTide": "Maji Kujaa:",
      "summary.nextHarvest": "Mavuno Yanayofuata",
      "summary.nextHarvestWindow": "Muda ujao wa mavuno:",
      "summary.lowestTide": "Maji yaliyo chini zaidi:",
      "summary.moonSun": "Mwezi na Jua",
      "summary.moon": "Mwezi:",
      "summary.newMoon": "Mwezi mpya:",
      "summary.fullMoon": "Mwezi mpevu:",
      "summary.sunrise": "Jua kuchomoza:",
      "summary.sunset": "Jua kuzama:",
      "summary.harvestThresholdHidden": "Kikomo cha mavuno kimefichwa",
      "summary.noHarvestWindow": "Hakuna muda wa mavuno katika kipindi hiki",
      "summary.currentTideState": "{symbol} {trend} ({height}) saa {time} kwa saa za hapa",
      "summary.lowTideDate": "Maji Kupwa {date}:",

      "threshold.showHarvest": "Onyesha mavuno",
      "threshold.whenBelow": "wakati maji yako chini ya",
      "threshold.unitMetres": "m",
      "threshold.reset": "Weka upya",
      "harvest.window": "Muda wa mavuno",
      "harvest.windows": "Vipindi vya mavuno:",
      "harvest.thresholdHiddenSentence": "Kikomo cha mavuno kimefichwa.",
      "harvest.noWindowsInRange": "Hakuna vipindi vya mavuno katika kipindi hiki cha miezi {months}.",
      "harvest.status": "Mavuno",
      "harvest.day": "Siku ya mavuno ({label})",
      "harvest.start": "Mwanzo wa mavuno ({label})",
      "harvest.end": "Mwisho wa mavuno ({label})",
      "harvest.windowLabel": "Muda wa mavuno ({label})",
      "harvest.springLow": "Maji kupwa makubwa - {harvestText}",

      "forecast.rangeLabel": "Utabiri wa Mawimbi wa Siku {days}",
      "forecast.rangeAria": "Kipindi cha utabiri",
      "forecast.buttonDays": "siku {count}",
      "overview.rangeLabel": "Muhtasari wa Mawimbi wa Miezi {months}{suffix}",
      "overview.rangeAria": "Kipindi cha muhtasari",
      "overview.suffixHarvest": " na Vipindi vya Mavuno",
      "overview.buttonMonth": "mwezi {count}",
      "overview.buttonMonths": "miezi {count}",
      "chart.forecastAria": "Chati ya utabiri wa mawimbi wa siku 7",
      "chart.overviewAria": "Chati ya muhtasari wa mawimbi wa miezi 3",
      "chart.tideHeight": "Kimo cha Maji",
      "chart.highTide": "Maji Kujaa",
      "chart.lowTide": "Maji Kupwa",
      "chart.now": "Sasa",
      "chart.thresholdHarvest": "<= {value}m mavuno",
      "chart.tooltipHigh": "Maji kujaa",
      "chart.tooltipLow": "Maji kupwa",
      "chart.tooltipHeight": "Kimo cha maji",

      "table.title": "Jedwali la Mawimbi",
      "table.next14": "siku 14 zijazo",
      "table.nextDays": "siku {days} zijazo",
      "table.date": "Tarehe",
      "table.harvest": "Mavuno",
      "table.morning": "Asubuhi",
      "table.afternoon": "Mchana",
      "table.loadMoreInitial": "Pakia siku 14 zinazofuata ↓",
      "table.loadMore": "Pakia siku {days} zinazofuata ↓",
      "table.empty": "Hakuna matukio ya mawimbi yaliyopatikana katika kipindi hiki.",
      "calendar.title": "Kalenda ya Mavuno (miezi 3)",
      "calendar.weekday.mon": "Jt",
      "calendar.weekday.tue": "Jn",
      "calendar.weekday.wed": "Jtn",
      "calendar.weekday.thu": "Alh",
      "calendar.weekday.fri": "Ij",
      "calendar.weekday.sat": "Jmo",
      "calendar.weekday.sun": "Jpi",
      "calendar.harvestLowTitle": "maji kupwa ya mavuno, chini {height}",
      "calendar.moonTitle": "Mwezi {moon}",

      "trend.slack": "Maji yametulia",
      "trend.flooding": "Maji yanajaa",
      "trend.ebbing": "Maji yanapwa",
      "moonPhase.New Moon": "Mwezi mpya",
      "moonPhase.Waxing Crescent": "Mwezi unaoongezeka kidogo",
      "moonPhase.First Quarter": "Robo ya kwanza ya mwezi",
      "moonPhase.Waxing Gibbous": "Mwezi unaoongezeka",
      "moonPhase.Full Moon": "Mwezi mpevu",
      "moonPhase.Waning Gibbous": "Mwezi unapungua",
      "moonPhase.Last Quarter": "Robo ya mwisho ya mwezi",
      "moonPhase.Waning Crescent": "Mwezi unapungua kidogo",
      "moon.full": "mpevu",
      "moon.new": "mpya",
      "moon.illuminated": "{percent} imeangaziwa",

      "details.locationHeading": "Mahali na wasifu wa mawimbi",
      "details.sourceHeading": "Chanzo na uthibitisho",
      "details.safetyHeading": "Dokezo la usalama",
      "details.location": "Mahali:",
      "details.gps": "GPS:",
      "details.tideProfile": "Wasifu wa mawimbi:",
      "details.referenceStation": "Kituo cha marejeo: {station}",
      "details.referenceStationFallback": "Kituo cha marejeo",
      "details.toBeConfirmed": "Itathibitishwa",
      "details.activeTideData": "Data ya mawimbi inayotumika:",
      "details.dataset": "Seti ya data:",
      "details.source": "Chanzo:",
      "details.datum": "Datum:",
      "details.timezone": "Ukanda wa saa:",
      "details.verification": "Uthibitisho:",
      "details.locationNote": "Dokezo la mahali:",
      "details.tideReferenceNote": "Mahali pa chanzo cha data ya mawimbi kwa {dataset}.",
      "data.active.supabase": "Seti ya data ya mawimbi iliyoingizwa kutoka Supabase",
      "data.active.offline": "Seti ya data ya mawimbi iliyohifadhiwa nje ya mtandao",
      "data.active.loading": "Inapakia seti ya data ya mawimbi iliyounganishwa",
      "data.active.prototype": "Mfano wa hesabu za mawimbi",
      "data.loadingTideData": "Inapakia data ya mawimbi",
      "safety.prototypeWarning": "Mfano huu ni mwongozo wa kupanga tu. Hali ya hewa ya eneo, mikondo, hali ya kufika shambani, tofauti za datum, na seti za data ambazo hazijathibitishwa zinaweza kubadili usalama wa kazi. Usiitumie kama data ya mawimbi ya kiwango cha urambazaji.",
      "safety.footerLabel": "Usalama:",
      "safety.footerText": "Sio kwa urambazaji baharini wala maamuzi ya usalama wa maisha. Mwongozo wa mawimbi unaweza kuwa na makosa, umepitwa na wakati, haujathibitishwa, au umeathiriwa na hali ya hewa na bahari ya eneo. Kagua vyanzo rasmi/vya eneo na hali ya sasa kabla ya kuchukua hatua.",
      "safety.fullDisclaimer": "Kanusho kamili la bahari",
      "safety.fullDisclaimerShort": "Kanusho kamili",
      "noscript.tides": "JavaScript inahitajika ili kuhesabu na kuonyesha utabiri wa mawimbi.",

      "map.statusLoading": "Inapakia maeneo",
      "map.statusCounts": "Mashamba {farms}, vyanzo vya mawimbi {references}",
      "map.gpsNeeded": "GPS inahitajika",
      "map.farmLocations": "Maeneo ya Mashamba na Vyanzo vya Mawimbi",
      "map.intro": "",
      "map.regionLabel": "Eneo",
      "map.allRegions": "Maeneo yote",
      "map.regionNotSet": "Eneo halijawekwa",
      "map.noRegionMatches": "Hakuna maeneo kwenye ramani katika eneo hili",
      "map.selectedLocationNotMapped": "Eneo lililochaguliwa halijawekwa kwenye ramani bado",
      "map.legendLabel": "Maelezo ya alama za ramani",
      "map.legendFarm": "Shamba",
      "map.legendReference": "Chanzo cha mawimbi",
      "map.offlineControlsLabel": "Vidhibiti vya ramani nje ya mtandao",
      "map.offlineStatusLoading": "Inapakia hali ya ramani nje ya mtandao",
      "map.cacheVisibleTiles": "Hifadhi vigae vya ramani vinavyoonekana",
      "map.clearTileCache": "Futa vigae vya ramani",
      "map.offlineStorageUnavailable": "Hifadhi ya ramani nje ya mtandao haipatikani",
      "map.offlineTilesReady": "Vigae vya ramani viko tayari nje ya mtandao - {count} vimehifadhiwa",
      "map.offlineTilesNotSaved": "Vigae vya ramani havijahifadhiwa kwa matumizi nje ya mtandao",
      "map.offlineTilesMissing": "Hakuna vigae vya ramani nje ya mtandao kwa mwonekano huu",
      "map.noVisibleTiles": "Hakuna vigae vya ramani vinavyoonekana vya kuhifadhi",
      "map.tooManyVisibleTiles": "Mwonekano huu una vigae {count}. Karibia au punguza mwonekano uwe chini ya vigae {max} kabla ya kuhifadhi.",
      "map.cachingTiles": "Inahifadhi vigae {count} vya ramani vinavyoonekana",
      "map.offlineTilesSaved": "Imehifadhi vigae {saved}. Jumla iliyohifadhiwa ni {total}.",
      "map.tileCacheFailed": "Imeshindwa kuhifadhi vigae vya ramani",
      "map.sourceLoading": "Inapakia chanzo cha maeneo",
      "map.layoutLabel": "Ramani na orodha ya maeneo ya mashamba na vyanzo vya mawimbi",
      "map.mapLabel": "Ramani ya maeneo ya mashamba na vyanzo vya mawimbi",
      "map.mappedFarms": "Maeneo ya Mashamba",
      "map.tideReferences": "Vyanzo vya Mawimbi",
      "map.needsGps": "Yanahitaji GPS",
      "map.libraryMissing": "Maktaba ya ramani haikuweza kupakiwa. Kagua muunganisho wa intaneti kwa Leaflet na vigae vya OpenStreetMap.",
      "map.noGpsData": "Hakuna GPS za mashamba au marejeo ya mawimbi zinazopatikana kwa sasa.",
      "map.openPlanner": "Fungua mpangaji wa mawimbi",
      "map.open": "Fungua",
      "map.showSelectedOnMap": "Onyesha kwenye ramani",
      "map.offlineLocationNotSaved": "Nje ya mtandao - haijahifadhiwa",
      "map.statusNotSet": "hali haijawekwa",
      "map.columnName": "Jina",
      "map.columnRegion": "Eneo",
      "map.columnCoordinates": "Viwianishi",
      "map.columnOpen": "Fungua",
      "map.noMappedFarms": "Hakuna maeneo ya mashamba yenye GPS iliyothibitishwa kwa sasa.",
      "map.noReferences": "Hakuna vyanzo vya mawimbi vyenye viwianishi kwa sasa.",
      "map.allGps": "Maeneo yote ya mashamba yana viwianishi vya GPS.",
      "map.showOnMap": "Onyesha {name} kwenye ramani",
      "map.gpsToConfirm": "GPS itathibitishwa",
      "noscript.map": "JavaScript inahitajika ili kuonyesha ramani ya mashamba.",

      "disclaimer.eyebrow": "Taarifa ya usalama",
      "disclaimer.title": "Kanusho la urambazaji baharini na usalama wa shambani",
      "disclaimer.accept": "Nimeelewa - endelea",
      "disclaimer.body": "<p><strong>Mpangaji huyu wa Mawimbi si mfumo wa urambazaji baharini, si jedwali rasmi la mawimbi, si huduma ya usalama wa maisha, na si kifaa cha maamuzi ya dharura.</strong> Umetolewa kama mwongozo wa jumla tu wa kupanga kazi za kilimo cha mwani.</p><p>Usitumie programu hii kama msingi pekee wa urambazaji, uendeshaji wa chombo, kuingia au kutoka bandarini, kutia nanga, kufunga chombo, kupanga njia, kuogelea, kupiga mbizi, kuvua samaki, kuvuka mifereji, kuvuka miamba au maeneo ya tambarare ya bahari, kusafirisha watu au mizigo, kukabiliana na dharura, au kuamua kama hali ni salama.</p><p>Nyakati na kimo cha maji vinaweza kuathiriwa na makosa ya chanzo cha data, seti za data ambazo hazijathibitishwa, tofauti za datum, ubadilishaji wa ukanda wa saa, ukadiriaji kati ya vipimo, hali ya hewa, upepo unaokusanya maji, shinikizo la hewa, mtiririko wa mito, mawimbi makubwa, mikondo, umbo la pwani, athari za miamba na laguni, vizuizi vya eneo, makosa ya vifaa, mipangilio ya mtumiaji, umri wa data iliyohifadhiwa nje ya mtandao, na mabadiliko baada ya seti ya data kuingizwa.</p><p>Kabla ya kuchukua hatua, kagua hali ya sasa ya eneo na vyanzo rasmi au vilivyoidhinishwa eneo hilo kama mamlaka za bandari, huduma za kitaifa za hydrographia au hali ya hewa, taarifa kwa mabaharia, vipima mawimbi, waangalizi wa eneo waliofunzwa, na wasimamizi wa eneo. Ukiwa na shaka, usitoke.</p><p>Unatumia Mpangaji huu wa Mawimbi kwa hatari yako mwenyewe. Waendeshaji, watengenezaji, wachakataji data, washirika wa mradi, na wasimamizi wa eneo hawawezi kuhakikisha kuwa taarifa za mawimbi zinazoonyeshwa ni sahihi, kamili, za sasa, zinafaa kwa eneo lako, au ni salama kwa shughuli yoyote maalumu. Hawawajibiki kwa hasara, uharibifu, majeraha, hasara ya mazao, hasara ya uzalishaji, hasara ya vifaa, hasara ya fedha, au matokeo mengine yanayotokana na kutegemea au kutumia taarifa za mawimbi zinazoonyeshwa.</p><p>Wewe unabaki kuwajibika kwa maamuzi yako na kwa kufuata sheria, maonyo, na maagizo ya eneo.</p>"
    },
    dataText: {
      "Kenya Coast Reference": "Marejeo ya Pwani ya Kenya",
      "Kenya Coast": "Pwani ya Kenya",
      "Funzi Farm Area": "Eneo la Shamba la Funzi",
      "Funzi": "Funzi",
      "Shangani Farm Area": "Eneo la Shamba la Shangani",
      "Shangani": "Shangani",
      "Shimoni Farm Area": "Eneo la Shamba la Shimoni",
      "Shimoni": "Shimoni",
      "Fremantle Reference": "Marejeo ya Fremantle",
      "Fremantle": "Fremantle",
      "Southeast Kenya": "Kusini Mashariki mwa Kenya",
      "Kwale County": "Kaunti ya Kwale",
      "Western Australia": "Australia Magharibi",
      "Australia": "Australia",
      "Mombasa / Kenya Coast Reference": "Marejeo ya Mombasa / Pwani ya Kenya",
      "Fremantle, Western Australia Reference": "Marejeo ya Fremantle, Australia Magharibi",
      "Farm GPS location to be confirmed": "Eneo la GPS la shamba litathibitishwa",
      "GPS to be confirmed by local operator": "GPS itathibitishwa na mhudumu wa eneo",
      "Reference only": "Marejeo tu",
      "Prototype chart datum metadata pending": "Taarifa za datum ya chati ya mfano zinasubiri",
      "Planning guidance - not locally verified": "Mwongozo wa kupanga - haujathibitishwa eneo hili",
      "Reference profile - not a Kenya farming location": "Wasifu wa marejeo - si eneo la kilimo Kenya",
      "Uses the Mombasa/Kenya coast reference profile until farm-specific calibration is available.": "Inatumia wasifu wa marejeo wa Mombasa/Pwani ya Kenya hadi upimaji maalumu wa shamba upatikane.",
      "Farm GPS supplied 2026-06-11. Tide timing currently follows the Mombasa/Kenya coast reference profile.": "GPS ya shamba ilitolewa 2026-06-11. Kwa sasa muda wa mawimbi unafuata wasifu wa marejeo wa Mombasa/Pwani ya Kenya.",
      "Placeholder farm-location record. Tide timing currently follows the Mombasa/Kenya coast reference profile.": "Rekodi ya muda ya eneo la shamba. Kwa sasa muda wa mawimbi unafuata wasifu wa marejeo wa Mombasa/Pwani ya Kenya.",
      "Reference profile from the original Seaweed Station dashboard tide implementation.": "Wasifu wa marejeo kutoka utekelezaji wa awali wa mawimbi kwenye dashibodi ya Seaweed Station.",
      "Uses a Mombasa/Kenya coast harmonic reference profile until farm-location calibration and local verification are complete.": "Inatumia wasifu wa marejeo ya kihesabu wa Mombasa/Pwani ya Kenya hadi upimaji wa maeneo ya mashamba na uthibitisho wa eneo ukamilike.",
      "Included only as a regression/reference profile from the Seaweed Station tide implementation.": "Imejumuishwa tu kama wasifu wa majaribio/marejeo kutoka utekelezaji wa mawimbi wa Seaweed Station.",
      "Using static prototype location records": "Inatumia rekodi za mfano za maeneo",
      "Using Supabase farm_locations": "",
      "No Supabase tide references loaded": "Hakuna marejeo ya mawimbi ya Supabase yaliyopakiwa",
      "Using Supabase tide_datasets": "",
      "Farm location loaded from Supabase.": "Eneo la shamba limepakiwa kutoka Supabase.",
      "Tide reference": "Marejeo ya mawimbi"
    }
  }
};

export function setLanguage(language) {
  const nextLanguage = supportedLanguage(language);
  writeStoredLanguage(nextLanguage);
  applyLanguage(nextLanguage);
}

export function getLanguage() {
  return supportedLanguage(readStoredLanguage() || detectDefaultLanguage());
}

export function getLocale() {
  return getActivePack().locale || LANGUAGE_PACKS[DEFAULT_LANGUAGE].locale;
}

export function t(key, params = {}) {
  const activeMessages = getActivePack().messages;
  const fallbackMessages = LANGUAGE_PACKS[DEFAULT_LANGUAGE].messages;
  const template = activeMessages[key] ?? fallbackMessages[key] ?? key;
  return interpolate(template, params);
}

export function translateDataText(value) {
  if (value === null || value === undefined) return "";

  const text = String(value);
  const activeDataText = getActivePack().dataText || {};
  const fallbackDataText = LANGUAGE_PACKS[DEFAULT_LANGUAGE].dataText || {};

  if (Object.prototype.hasOwnProperty.call(activeDataText, text)) return activeDataText[text];
  if (Object.prototype.hasOwnProperty.call(fallbackDataText, text)) return fallbackDataText[text];

  const parts = text.split("; ");
  if (parts.length > 1) {
    return parts.map((part) => translateDataText(part)).join("; ");
  }

  const commaParts = text.split(", ");
  if (commaParts.length > 1) {
    return commaParts.map((part) => translateDataText(part)).join(", ");
  }

  return text;
}

export function translateStatusLabel(status) {
  const key = `status.${status}`;
  const label = t(key);
  if (label !== key) return label;
  return String(status || "").replace(/_/g, " ");
}

function initLanguageSelector() {
  applyLanguage(getLanguage());

  document.querySelectorAll("[data-language-option]").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.languageOption);
    });
  });
}

function applyLanguage(language) {
  const selectedLanguage = supportedLanguage(language);

  document.documentElement.lang = selectedLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  applyTranslatedAttribute("data-i18n-aria-label", "aria-label");
  applyTranslatedAttribute("data-i18n-title", "title");
  applyTranslatedAttribute("data-i18n-placeholder", "placeholder");

  document.querySelectorAll("[data-language-option]").forEach((button) => {
    const active = button.dataset.languageOption === selectedLanguage;
    button.setAttribute("aria-pressed", String(active));
    button.textContent = t(`language.option.${button.dataset.languageOption}`);
  });

  document.dispatchEvent(new CustomEvent("seaweed-language-change", {
    detail: { language: selectedLanguage }
  }));
}

function applyTranslatedAttribute(dataAttribute, targetAttribute) {
  document.querySelectorAll(`[${dataAttribute}]`).forEach((element) => {
    element.setAttribute(targetAttribute, t(element.getAttribute(dataAttribute)));
  });
}

function supportedLanguage(language) {
  return Object.prototype.hasOwnProperty.call(LANGUAGE_PACKS, language) ? language : DEFAULT_LANGUAGE;
}

function getActivePack() {
  return LANGUAGE_PACKS[getLanguage()] || LANGUAGE_PACKS[DEFAULT_LANGUAGE];
}

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function detectDefaultLanguage() {
  const timezone = getBrowserTimezone();
  const browserLanguages = getBrowserLanguages();

  if (timezone === KENYA_TIMEZONE) return "sw";
  if (browserLanguages.some((language) => /^sw(?:-|$)/i.test(language))) return "sw";

  return DEFAULT_LANGUAGE;
}

function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

function getBrowserLanguages() {
  const nav = typeof navigator === "undefined" ? null : navigator;
  if (!nav) return [];
  if (Array.isArray(nav.languages) && nav.languages.length) return nav.languages;
  return nav.language ? [nav.language] : [];
}

function writeStoredLanguage(language) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage can be unavailable in restricted browsers. The active page still updates.
  }
}

function interpolate(template, params) {
  return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match;
  });
}

window.SeaweedTideLanguage = {
  getLanguage,
  getLocale,
  setLanguage,
  t,
  translateDataText,
  supportedLanguages: Object.keys(LANGUAGE_PACKS)
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanguageSelector);
} else {
  initLanguageSelector();
}
