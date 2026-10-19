import { StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

// Styles shared by more than one screen. Screen-specific styles stay in each screen file.
export const common = StyleSheet.create({
  // Layout
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Surfaces
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },

  // Text
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  heading: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  muted: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  textCenter: {
    textAlign: 'center',
  },

  // Buttons: combine `button` with one color variant, e.g. [common.button, common.buttonPrimary]
  button: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  buttonTextSecondary: {
    color: colors.text,
  },
});
