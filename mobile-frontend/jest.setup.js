/* eslint-disable no-undef */
// Jest setup for native modules that have no JS implementation under the test
// environment. Without these mocks, importing components that depend on native
// modules (AsyncStorage, vector icons, linear gradient) throws at module load
// and fails the whole test suite.

// Official AsyncStorage mock.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Vector icons render as a simple component in tests.
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");
jest.mock("react-native-vector-icons/Ionicons", () => "Icon");
jest.mock("react-native-vector-icons/MaterialIcons", () => "Icon");
jest.mock("react-native-vector-icons/FontAwesome", () => "Icon");

// Linear gradient renders as a passthrough view in tests.
jest.mock("react-native-linear-gradient", () => "LinearGradient");

// Haptic feedback is a no-op in tests.
jest.mock("react-native-haptic-feedback", () => ({
  trigger: jest.fn(),
}));
