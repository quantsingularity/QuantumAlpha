// Ambient module declarations for packages that do not ship their own
// TypeScript types and for which no @types package is installed.
//
// react-native-push-notification has no bundled types and no maintained
// @types package compatible with this version, so it is declared here as an
// untyped module. This resolves the implicit-any module error (TS7016).

declare module "react-native-push-notification";
