import PostHog from 'posthog-react-native';

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let client: PostHog | null = null;

// Privacy-respecting by default: no client is constructed — and no network
// call is ever made — until a real API key is supplied in .env. There is
// no autocapture and no PII; every event tracked below is a deliberate,
// anonymous product-usage signal (a screen viewed, a plan generated), not
// device fingerprinting.
export function initAnalytics() {
  if (!apiKey) {
    console.warn(
      'PostHog key not set — analytics is disabled. Set EXPO_PUBLIC_POSTHOG_KEY in .env to enable it.'
    );
    return;
  }

  client = new PostHog(apiKey, {
    host,
    captureAppLifecycleEvents: false,
  });
}

export function trackScreen(name: string) {
  client?.screen(name);
}

type EventProperties = Record<string, string | number | boolean | null>;

export function trackEvent(name: string, properties?: EventProperties) {
  client?.capture(name, properties);
}

// Lets a user turn tracking off from Settings without needing a restart.
export function setAnalyticsOptOut(optOut: boolean) {
  if (optOut) {
    client?.optOut();
  } else {
    client?.optIn();
  }
}
