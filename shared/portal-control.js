(function(global){
  var STORAGE_KEY = 'gb_admin_settings';
  var SB = global.SUPABASE_URL || 'https://chfkssclmdshdcijfzdr.supabase.co';
  var SK = global.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmtzc2NsbWRzaGRjaWpmemRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODc2ODUsImV4cCI6MjA4OTE2MzY4NX0.cbJBIgeDRIqFvk3WMmxRoDWo1C73wM44oBDekdcc3sE';
  var H = { apikey: SK, Authorization: 'Bearer ' + SK };

  function cloneSettings(settings){
    return Object.assign({}, settings || {});
  }

  function parseSettingValue(value){
    if(value === 'true') return true;
    if(value === 'false') return false;
    return value;
  }

  function getCachedSettings(){
    try{
      var saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) || {} : {};
    }catch(e){
      return {};
    }
  }

  function cacheSettings(settings){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings || {}));
    }catch(e){}
    return settings || {};
  }

  function mergeSettingsRows(rows, base){
    var next = cloneSettings(base);
    if(Array.isArray(rows)){
      rows.forEach(function(row){
        if(row && row.key){
          next[row.key] = parseSettingValue(row.value);
        }
      });
    }
    return next;
  }

  async function loadSettings(options){
    options = options || {};
    var settings = cloneSettings(options.base || getCachedSettings());
    if(options.remote === false) return settings;
    try{
      var response = await fetch(SB + '/rest/v1/site_settings?select=key,value', { headers: H });
      if(response.ok){
        var rows = await response.json();
        settings = mergeSettingsRows(rows, settings);
        cacheSettings(settings);
      }
    }catch(e){}
    return settings;
  }

  function isTrue(value){
    return value === true || value === 'true' || value === 1 || value === '1';
  }

  function isSectionLive(key, settings){
    var value = (settings || {})[key];
    return !(value === false || value === 'false');
  }

  function shouldShowAds(settings){
    return isSectionLive('show_ads', settings);
  }

  function applySectionVisibility(settings, mappings){
    (mappings || []).forEach(function(map){
      var live = isSectionLive(map.key, settings);
      (map.ids || []).forEach(function(id){
        var el = document.getElementById(id);
        if(el) el.style.display = live ? '' : 'none';
      });
      if(map.tabLabel){
        document.querySelectorAll(map.tabSelector || '.stab').forEach(function(btn){
          if(btn.textContent.trim().indexOf(map.tabLabel) > -1){
            btn.style.display = live ? '' : 'none';
          }
        });
      }
      if(typeof map.callback === 'function'){
        map.callback(live, settings);
      }
    });
  }

  function applyMaintenanceMode(settings, url){
    if(isTrue((settings || {}).maintenance_mode)){
      if(document.body) document.body.innerHTML = '';
      window.location.replace(url || 'coming-soon.html?section=maintenance');
      return true;
    }
    return false;
  }

  function settingText(settings, key, fallback){
    var value = settings && settings[key];
    if(typeof value === 'string' && value.trim()){
      return value.trim();
    }
    return fallback || '';
  }

  function getAdConfig(settings, prefix, defaults){
    defaults = defaults || {};
    return {
      enabled: isTrue(settings && settings[prefix + '_enabled']),
      image: settingText(settings, prefix + '_image', defaults.image || ''),
      link: settingText(settings, prefix + '_link', defaults.link || ''),
      title: settingText(settings, prefix + '_title', defaults.title || ''),
      copy: settingText(settings, prefix + '_copy', defaults.copy || ''),
      cta: settingText(settings, prefix + '_cta', defaults.cta || '')
    };
  }

  function hasAdContent(config){
    return !!(config && config.enabled && (config.image || config.title || config.copy || config.link));
  }

  global.GBPortalControl = {
    STORAGE_KEY: STORAGE_KEY,
    SUPABASE_URL: SB,
    SUPABASE_KEY: SK,
    HEADERS: H,
    parseSettingValue: parseSettingValue,
    getCachedSettings: getCachedSettings,
    cacheSettings: cacheSettings,
    mergeSettingsRows: mergeSettingsRows,
    loadSettings: loadSettings,
    isTrue: isTrue,
    isSectionLive: isSectionLive,
    shouldShowAds: shouldShowAds,
    applySectionVisibility: applySectionVisibility,
    applyMaintenanceMode: applyMaintenanceMode,
    settingText: settingText,
    getAdConfig: getAdConfig,
    hasAdContent: hasAdContent
  };
})(window);
