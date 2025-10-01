import DashboardHeader from "@/app/admin/DasboardHeader";
import SettingsCard from "@/components/dashboard/project-owner/SettingsCard";
import LanguageIcon from "@/assets/language.svg";
import ClockIcon from "@/assets/clock.svg";
import LockpadIcon from "@/assets/lockpad.svg";
import NotifIcon from "@/assets/white_ring_bell.svg";

const settingsText = [
  {
    title: "Langues",
    description: "Choisissez votre langue d'affichage",
    icon: LanguageIcon,
  },
  {
    title: "Notifications",
    description: "Gérez vos préférences de notification",
    icon: NotifIcon,
  },
  {
    title: "Sécurité",
    description: "Mettez à jour vos paramètres de sécurité",
    icon: LockpadIcon,
  },
  {
    title: "Temps",
    description: "Ajustez vos paramètres de temps",
    icon: ClockIcon,
  },
];

export default function page() {
  return (
    <div>
      <DashboardHeader pageTitle="Mes paramètres" />
      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 mt-24">
        {settingsText.map((setting, idx) => (
          <SettingsCard
            key={idx}
            title={setting.title}
            description={setting.description}
            icon={setting.icon}
          />
        ))}
      </div>
    </div>
  );
}
