import DangerZone from "./DangerZone";
import PreferenceSettings from "./PreferenceSettings";
import ProfileSettings from "./ProfileSettings";
import SettingsHeader from "./SettingsHeader";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SettingsHeader />

      <ProfileSettings />

      <PreferenceSettings />

      <DangerZone />
    </div>
  );
}