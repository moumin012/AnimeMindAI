const supported = (value, detail) => ({ available: Boolean(value), detail });

/**
 * Browser preview adapter. Native Android and iOS adapters must replace this
 * implementation and confirm both capability and permission before an action
 * is advertised as active.
 */
export const mobileControl = {
  async getCapabilities() {
    const notifications = typeof window !== 'undefined' && 'Notification' in window;
    return {
      platform: 'Browser preview',
      notifications: supported(notifications, notifications ? 'Browser notification permission can be requested.' : 'Notifications are unavailable in this browser.'),
      usageAccess: supported(false, 'App usage monitoring is not supported in the browser preview.'),
      appRestrictions: supported(false, 'App restrictions require a native Android or approved iOS implementation.'),
      focusMode: supported(false, 'System Focus control is unavailable in the browser preview.'),
      microphone: supported(Boolean(navigator.mediaDevices?.getUserMedia), 'Only requested when you choose a voice feature.'),
      camera: supported(Boolean(navigator.mediaDevices?.getUserMedia), 'Only requested when you choose document scanning.'),
      location: supported(Boolean(navigator.geolocation), 'Only requested for optional prayer calculations.'),
    };
  },

  async requestNotificationPermission() {
    if (!('Notification' in window)) return { state: 'unsupported' };
    const state = await Notification.requestPermission();
    return { state };
  },

  async requestMediaPermission(kind) {
    if (!navigator.mediaDevices?.getUserMedia) return { state: 'unsupported' };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(kind === 'camera' ? { video: true } : { audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return { state: 'granted' };
    } catch (error) {
      return { state: error.name === 'NotAllowedError' ? 'denied' : 'unavailable' };
    }
  },

  async startStudyPolicy() {
    return {
      active: false,
      reason: 'Focus restrictions are not supported in the browser preview. The StudentOS timer remains available.',
    };
  },

  async stopStudyPolicy() {
    return { stopped: true };
  },
};
