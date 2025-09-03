import { useFormContext } from "react-hook-form";
import EmailField from "../EmailField";
import FormCard from "../FormCard";
import NumberField from "../NumberField";
import PasswordField from "../PasswordField";
import PhoneNumberField from "../PhoneNumberField";
import TextField from "../TextField";

interface Props {
  setStep: (step: number) => void;
}

export default function Step1({ setStep }: Props) {
  const { trigger } = useFormContext();
  return (
    <FormCard step={1}>
      <div className="space-y-6">
        <TextField
          name="full_name"
          label="Nom & prénom"
          placeholder="Nom & prénom"
        />
        <EmailField
          name="email"
          label="Adresse e-mail"
          placeholder="Example@gmail.com"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PhoneNumberField
            name="phone"
            label="Numéro de téléphone"
            placeholder="06 12 34 56 78"
          />

          <TextField
            name="profession"
            label="Profession ou statut actuel"
            placeholder="Étudiant, entrepreneur, employé, etc"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PasswordField
            name="password"
            label="Mot de passe"
            placeholder="xxxxxxxxxxxxxxxxx"
          />
          <NumberField name="age" label="Âge" placeholder="18" />
        </div>
      </div>
      <div className="mt-16">
        <button
          type="button"
          onClick={async () => {
            const valid = await trigger([
              "full_name",
              "email",
              "phone",
              "profession",
              "age",
              "password",
            ]);
            if (valid) setStep(2);
          }}
          className="bg-secondary px-4 py-2 rounded-md text-white w-full cursor-pointer"
        >
          Suivant
        </button>
      </div>
    </FormCard>
  );
}
