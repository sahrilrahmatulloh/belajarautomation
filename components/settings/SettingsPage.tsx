import DangerZone from "./DangerZone";
import DummyDataSettings from "./DummyDataSettings";
import PreferenceSettings from "./PreferenceSettings";
import PrivacySettings from "./PrivacySettings";
import ProfileSettings from "./ProfileSettings";
import SettingsHeader from "./SettingsHeader";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SettingsHeader />

      <ProfileSettings />

      <PreferenceSettings />

      <PrivacySettings />

      <DummyDataSettings />

      <DangerZone />
    </div>
  );
}