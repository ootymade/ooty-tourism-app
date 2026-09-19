import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

// Sentry.init with an empty/undefined dsn disables reporting rather than
// throwing, so this is safe to call unconditionally — crash reporting
// simply stays off until a real DSN is supplied in .env.
export function initSentry() {
  Sentry.init({
    dsn,
    enabled: Boolean(dsn),
    tracesSampleRate: 0.2,
    sendDefaultPii: false,
  });

  if (!dsn) {
    console.warn(
      'Sentry DSN not set — crash reporting is disabled. Set EXPO_PUBLIC_SENTRY_DSN in .env to enable it.'
    );
  }
}

export { Sentry };
