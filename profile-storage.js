const PythonLabStorage = (() => {
  const PROFILE_KEY = "pythonLearningLabProfilesV1";
  const ACTIVE_PROFILE_KEY = "pythonLearningLabActiveProfileV1";
  const LEGACY_PROGRESS_KEY = "pythonLearningLabProgress";

  function newId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function readProfiles() {
    try {
      const parsed = JSON.parse(localStorage.getItem(PROFILE_KEY));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeProfiles(profiles) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
  }

  function migrateLegacyProgress() {
    const profiles = readProfiles();
    if (profiles.length > 0) return;

    let legacyProgress = {};
    try {
      legacyProgress = JSON.parse(localStorage.getItem(LEGACY_PROGRESS_KEY)) || {};
    } catch {
      legacyProgress = {};
    }

    const profile = {
      id: newId(),
      name: "Learner",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: legacyProgress
    };

    writeProfiles([profile]);
    localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
  }

  function ensureReady() {
    migrateLegacyProgress();
    const profiles = readProfiles();

    if (profiles.length === 0) {
      const profile = {
        id: newId(),
        name: "Learner",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: {}
      };
      writeProfiles([profile]);
      localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
      return profile;
    }

    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    const active = profiles.find(profile => profile.id === activeId) || profiles[0];
    localStorage.setItem(ACTIVE_PROFILE_KEY, active.id);
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

  function createProfile(name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) throw new Error("Enter a learner name.");

    const profiles = getProfiles();
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
    return profile;
  }

  function setActiveProfile(profileId) {
    const profiles = getProfiles();
    const profile = profiles.find(item => item.id === profileId);
    if (!profile) throw new Error("Learner profile not found.");
    localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
    return profile;
  }

  function renameActiveProfile(name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) throw new Error("Enter a learner name.");

    const active = getActiveProfile();
    const profiles = getProfiles();
    const profile = profiles.find(item => item.id === active.id);
    profile.name = trimmed.slice(0, 40);
    profile.updatedAt = new Date().toISOString();
    writeProfiles(profiles);
    return profile;
  }

  function getProgress() {
    return getActiveProfile()?.progress || {};
  }

  function saveProgress(progress) {
    const active = getActiveProfile();
    const profiles = getProfiles();
    const profile = profiles.find(item => item.id === active.id);
    profile.progress = progress || {};
    profile.updatedAt = new Date().toISOString();
    writeProfiles(profiles);
  }

  function resetActiveProgress() {
    saveProgress({});
  }

  function deleteActiveProfile() {
    const active = getActiveProfile();
    let profiles = getProfiles().filter(profile => profile.id !== active.id);

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
    return profiles[0];
  }

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
