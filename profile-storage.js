const PythonLabStorage = (() => {
  const PROFILE_KEY = "pythonLearningLabProfilesV1";
  const ACTIVE_PROFILE_KEY = "pythonLearningLabActiveProfileV1";
  const LEGACY_PROGRESS_KEY = "pythonLearningLabProgress";
  const LEGACY_OWNER_KEY = "pythonLearningLabProgressOwnerV1";

  function newId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function readProfiles() {
    const parsed = readJson(PROFILE_KEY, []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function writeProfiles(profiles) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
  }

  function readLegacyProgress() {
    return readJson(LEGACY_PROGRESS_KEY, {});
  }

  function writeLegacyProgress(progress, ownerId) {
    localStorage.setItem(LEGACY_PROGRESS_KEY, JSON.stringify(progress || {}));
    localStorage.setItem(LEGACY_OWNER_KEY, ownerId);
  }

  function migrateLegacyProgress() {
    const profiles = readProfiles();
    if (profiles.length > 0) return;

    const profile = {
      id: newId(),
      name: "Learner",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: readLegacyProgress()
    };

    writeProfiles([profile]);
    localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
    writeLegacyProgress(profile.progress, profile.id);
  }

  function ensureReady() {
    migrateLegacyProgress();
    let profiles = readProfiles();

    if (profiles.length === 0) {
      const profile = {
        id: newId(),
        name: "Learner",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: {}
      };
      profiles = [profile];
      writeProfiles(profiles);
      localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
      writeLegacyProgress({}, profile.id);
      return profile;
    }

    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    const active = profiles.find(profile => profile.id === activeId) || profiles[0];
    localStorage.setItem(ACTIVE_PROFILE_KEY, active.id);

    const legacyOwner = localStorage.getItem(LEGACY_OWNER_KEY);
    if (legacyOwner === active.id) {
      const currentProgress = readLegacyProgress();
      const profile = profiles.find(item => item.id === active.id);
      profile.progress = currentProgress;
      profile.updatedAt = new Date().toISOString();
      writeProfiles(profiles);
    } else {
      writeLegacyProgress(active.progress || {}, active.id);
    }

    return active;
  }

  function getProfiles() {
    ensureReady();
    return readProfiles();
  }

  function getActiveProfile() {
    ensureReady();
    const profiles = readProfiles();
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    return profiles.find(profile => profile.id === activeId) || profiles[0];
  }

  function saveCurrentLegacyIntoProfile() {
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (!activeId) return;

    const profiles = readProfiles();
    const profile = profiles.find(item => item.id === activeId);
    if (!profile) return;

    if (localStorage.getItem(LEGACY_OWNER_KEY) === activeId) {
      profile.progress = readLegacyProgress();
      profile.updatedAt = new Date().toISOString();
      writeProfiles(profiles);
    }
  }

  function createProfile(name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) throw new Error("Enter a learner name.");

    ensureReady();
    saveCurrentLegacyIntoProfile();
    const profiles = readProfiles();
    const profile = {
      id: newId(),
      name: trimmed.slice(0, 40),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: {}
    };

    profiles.push(profile);
    writeProfiles(profiles);
    localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
    writeLegacyProgress({}, profile.id);
    return profile;
  }

  function setActiveProfile(profileId) {
    ensureReady();
    saveCurrentLegacyIntoProfile();
    const profiles = readProfiles();
    const profile = profiles.find(item => item.id === profileId);
    if (!profile) throw new Error("Learner profile not found.");

    localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
    writeLegacyProgress(profile.progress || {}, profile.id);
    return profile;
  }

  function renameActiveProfile(name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) throw new Error("Enter a learner name.");

    ensureReady();
    saveCurrentLegacyIntoProfile();
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    const profiles = readProfiles();
    const profile = profiles.find(item => item.id === activeId);
    profile.name = trimmed.slice(0, 40);
    profile.updatedAt = new Date().toISOString();
    writeProfiles(profiles);
    return profile;
  }

  function getProgress() {
    ensureReady();
    saveCurrentLegacyIntoProfile();
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    const profiles = readProfiles();
    return profiles.find(item => item.id === activeId)?.progress || {};
  }

  function saveProgress(progress) {
    ensureReady();
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    const profiles = readProfiles();
    const profile = profiles.find(item => item.id === activeId);
    profile.progress = progress || {};
    profile.updatedAt = new Date().toISOString();
    writeProfiles(profiles);
    writeLegacyProgress(profile.progress, profile.id);
  }

  function resetActiveProgress() {
    saveProgress({});
  }

  function deleteActiveProfile() {
    ensureReady();
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    let profiles = readProfiles().filter(profile => profile.id !== activeId);

    if (profiles.length === 0) {
      profiles = [{
        id: newId(),
        name: "Learner",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: {}
      }];
    }

    writeProfiles(profiles);
    localStorage.setItem(ACTIVE_PROFILE_KEY, profiles[0].id);
    writeLegacyProgress(profiles[0].progress || {}, profiles[0].id);
    return profiles[0];
  }

  ensureReady();

  return {
    getProfiles,
    getActiveProfile,
    createProfile,
    setActiveProfile,
    renameActiveProfile,
    getProgress,
    saveProgress,
    resetActiveProgress,
    deleteActiveProfile
  };
})();

window.PythonLabStorage = PythonLabStorage;
